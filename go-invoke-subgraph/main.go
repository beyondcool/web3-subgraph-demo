// go-invoke-subgraph —— 用 Go 调用 The Graph 子图 API 的最小示例
//
// 使用的库：github.com/machinebox/graphql
//
//	一个轻量的 GraphQL HTTP 客户端：手写原生 GraphQL 查询字符串 + 变量，
//	响应解码进普通 struct —— 和教程 graphql.md 里的查询一一对应。
//
// 运行方式：
//
//	go mod tidy   # 首次运行前拉取依赖
//	go run .
//
// 可选环境变量：
//
//	SUBGRAPH_TOKEN=xxx   若端点需要访问令牌，则自动带上 Authorization 头
//
// 演示两个最常用的模式（对应教程 graphql.md）：
//
//	示例 1：一次请求同时取多类数据（统计 + 产品 + _meta，见 §17.5）
//	示例 2：变量 + id_gt 游标分页，遍历全部产品（见 §7.3 / §19.6）
package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/machinebox/graphql"
)

// 子图 API 地址（Studio）
const endpoint = "https://api.studio.thegraph.com/query/1758071/zh-subgraph-01/version/latest"

// ---------- 与 schema.graphql 对应的响应结构 ----------
//
// 两类特殊映射务必注意：
//   1. BigInt 在 API 里一律以字符串返回（uint256 可能超出整数范围）
//   2. Bytes  以 "0x..." 十六进制字符串返回
// 字段名与 schema 保持一致，用 json tag 显式标注。

type Stats struct {
	ID             string `json:"id"` // Bytes → "0x7374617473"（"stats" 的 UTF-8 hex）
	UserCount      string `json:"userCount"`
	ProductCount   string `json:"productCount"`
	OrderCount     string `json:"orderCount"`
	PaidOrderCount string `json:"paidOrderCount"`
	TotalRevenue   string `json:"totalRevenue"` // BigInt → string（wei）
	FavoriteCount  string `json:"favoriteCount"`
}

type Product struct {
	ID        string `json:"id"` // String，十进制字符串
	ProdName  string `json:"prodName"`
	UnitPrice string `json:"unitPrice"` // BigInt → string（wei）
	Active    bool   `json:"active"`
}

type Meta struct {
	Block struct {
		Number    int    `json:"number"`
		Hash      string `json:"hash"`      // Bytes → "0x..."；不带 block 参数时才有值
		Timestamp int    `json:"timestamp"` // Unix 秒
	} `json:"block"`
	Deployment        string `json:"deployment"` // 本次部署的 IPFS CID
	HasIndexingErrors bool   `json:"hasIndexingErrors"`
}

func main() {
	client := graphql.NewClient(endpoint,
		graphql.WithHTTPClient(&http.Client{Timeout: 15 * time.Second}))

	dashboard(client)        // 示例 1：一次请求同时取多类数据
	cursorPagination(client) // 示例 2：变量 + 游标分页遍历全部产品
}

// newRequest 构造请求；若设置了 SUBGRAPH_TOKEN 环境变量则附加鉴权头
// （NewRequest 已初始化好 Header，可直接 Set）
func newRequest(query string) *graphql.Request {
	req := graphql.NewRequest(query)
	if token := os.Getenv("SUBGRAPH_TOKEN"); token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	return req
}

// dashboard 示例 1：一个请求同时取 统计 + 产品 Top5 + 索引状态
func dashboard(client *graphql.Client) {
	query := `
query Dashboard($first: Int!, $minPrice: String!) {
  stats: stats_collection(first: 1) {
    userCount
    productCount
    orderCount
    paidOrderCount
    totalRevenue
    favoriteCount
  }
  products(first: $first, where: { unitPrice_gte: $minPrice },
           orderBy: unitPrice, orderDirection: desc) {
    id
    prodName
    unitPrice
    active
  }
  _meta {
    block { number hash timestamp }
    deployment
    hasIndexingErrors
  }
}`

	req := newRequest(query)
	req.Var("first", 5)
	req.Var("minPrice", "0") // BigInt 过滤值以字符串传参；"0" 相当于不过滤

	var res struct {
		Stats    []Stats   `json:"stats"` // 别名 stats → stats_collection
		Products []Product `json:"products"`
		Meta     Meta      `json:"_meta"`
	}
	if err := client.Run(context.Background(), req, &res); err != nil {
		fail(err) // GraphQL 层错误（字段名写错等）也会在这里返回
	}

	fmt.Println("== 示例 1：一次请求同时取多类数据 ==")
	if len(res.Stats) > 0 {
		s := res.Stats[0]
		fmt.Printf("全局统计 : 用户 %s | 产品 %s | 订单 %s | 总销售额 %s wei\n",
			s.UserCount, s.ProductCount, s.OrderCount, s.TotalRevenue)
	}
	fmt.Printf("索引状态 : #%d | deployment %s | 索引错误 %v\n",
		res.Meta.Block.Number, res.Meta.Deployment, res.Meta.HasIndexingErrors)
	for _, p := range res.Products {
		fmt.Printf("产品 %s | %-12s | %20s wei | 在售 %v\n",
			p.ID, p.ProdName, p.UnitPrice, p.Active)
	}
	fmt.Println()
}

// cursorPagination 示例 2：用 id_gt 游标分页遍历所有产品（避免大 skip）
func cursorPagination(client *graphql.Client) {
	query := `
		query AllProducts($pageSize: Int!, $lastId: String) {
			products(first: $pageSize, where: { id_gt: $lastId }, orderBy: id, orderDirection: asc) {
				id
				prodName
				unitPrice
			}
		}`

	const pageSize = 8
	lastId := "" // 游标：上一页最后一条的 id；"" 表示从头开始
	var all []Product

	fmt.Println("== 示例 2：id_gt 游标分页遍历全部产品 ==")
	for {
		req := newRequest(query)
		req.Var("pageSize", pageSize)
		req.Var("lastId", lastId)

		var res struct {
			Products []Product `json:"products"`
		}
		ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		err := client.Run(ctx, req, &res)
		cancel()
		if err != nil {
			fail(err)
		}

		all = append(all, res.Products...)
		fmt.Printf("  取回 %d 条（累计 %d），游标 id_gt=%q\n", len(res.Products), len(all), lastId)
		if len(res.Products) < pageSize {
			break // 不足一页 → 已取完
		}
		lastId = res.Products[len(res.Products)-1].ID // 移动游标
	}

	fmt.Printf("遍历完成，共 %d 个产品：\n", len(all))
	for i, p := range all {
		fmt.Printf("  %2d) 产品 %s | %-12s | %20s wei\n", i+1, p.ID, p.ProdName, p.UnitPrice)
	}
}

// fail 打印错误并退出
func fail(err error) {
	fmt.Fprintln(os.Stderr, "查询失败:", err)
	os.Exit(1)
}
