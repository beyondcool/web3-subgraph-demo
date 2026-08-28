// script/Interact.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
// 导入你要交互的合约接口
import {ZhSubgraph01} from "../src/ZhSubgraph01.sol";

contract InteractScript is Script {
    uint256 constant NUM_USERS = 10;
    uint256 constant NUM_PRODS = 20;
    uint256 constant NUM_ORDERS = 10;

    function run() public {
        // 1. 从环境变量读取私钥
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 2. 连接已部署的合约
        address contractAddress = 0xD9716d16E4885b55643406C6365F8db6Fb4cC9E0; // 替换为你的合约地址
        ZhSubgraph01 zh = ZhSubgraph01(contractAddress);

        // ==================== 3. 创建用户（10条）====================
        // 用确定性的“模拟用户地址”（非真实签名者，仅作为事件数据里的用户标识）
        string[10] memory userNames = [
            "Alice", "Bob", "Carol", "David", "Eve",
            "Frank", "Grace", "Henry", "Ivy", "Jack"
        ];
        address[10] memory userAddrs;
        for (uint256 i = 0; i < NUM_USERS; i++) {
            userAddrs[i] = vm.addr(0xA000 + i); // 一组确定性测试私钥对应的地址
            uint256 age = 18 + i * 4;           // 18 ~ 54
            zh.createUser(userAddrs[i], age, userNames[i]);
        }

        // ==================== 4. 创建产品（20条）====================
        // 单价从低到高，模拟不同价位商品
        for (uint256 p = 0; p < NUM_PRODS; p++) {
            string memory prodName = string.concat("Product-", vm.toString(p + 1));
            uint256 unitPrice = (p + 1) * 0.01 ether; // 0.01 ~ 0.2 ETH
            zh.createProd(prodName, unitPrice);
        }

        // ==================== 5. 创建订单（10条）====================
        // 关系模拟：
        //   - User : Order = 1 : 多 → 前 7 笔订单按 o % NUM_USERS 轮转分配给用户，
        //     最后 3 笔全部给第 0 个用户，制造“一个用户多笔订单”。
        //   - Order : Prod = 多 : 多 → 每笔订单的 prodId 各不相同且跨越多个产品区间。
        for (uint256 o = 0; o < NUM_ORDERS; o++) {
            address buyer = (o < 7) ? userAddrs[o % NUM_USERS] : userAddrs[0];

            uint256 prodId = (o * 2) % NUM_PRODS + 1;   // 覆盖 1..19
            uint256 amount = o % 5 + 1;                  // 1~5

            uint256 unitPrice = prodId * 0.01 ether;
            uint256 totalPrice = unitPrice * amount;

            zh.createOrder(buyer, prodId, amount, totalPrice);
        }

        // ==================== 6. 模拟订单生命周期：支付 / 取消 ====================
        // 支付前 7 笔订单，取消后 3 笔，让事件更丰富真实
        for (uint256 o = 0; o < NUM_ORDERS; o++) {
            if (o < 7) {
                zh.payOrder(o + 1);
            } else {
                zh.cancelOrder(o + 1);
            }
        }

        // ==================== 7. 模拟部分数据的修改 / 删除 ====================
        // 修改几个产品和用户的信息，测试 update 类事件的索引
        zh.modifyUser(userAddrs[0], 30, "Alice-Updated");
        zh.modifyUser(userAddrs[1], 40, "Bob-Updated");
        zh.modifyProd(1, "Product-1-Renamed", 0.015 ether);
        zh.modifyProd(5, "Product-5-Renamed", 0.06 ether);

        // 删除最后一个产品和一个用户，测试 remove 逻辑
        zh.deleteProd(20);
        zh.deleteUser(userAddrs[9]);

        // ==================== 8. 收藏数据：5 个用户，每人收藏 3~5 个产品 ====================
        address[5] memory favUsers = [
            userAddrs[0], userAddrs[1], userAddrs[2], userAddrs[3], userAddrs[4]
        ];

        for (uint256 u = 0; u < favUsers.length; u++) {
            uint256 favCount = 3 + (u % 3); // 3 / 4 / 5
            for (uint256 k = 0; k < favCount; k++) {
                // 产品 id 错开，避免所有人收藏完全相同的集合（1..19）
                uint256 prodId = (u * 3 + k) % (NUM_PRODS - 1) + 1;
                zh.addFavorite(favUsers[u], prodId);
            }
        }

        // ==================== 9. 少量取消收藏 ====================
        for (uint256 u = 0; u < favUsers.length; u++) {
            // 各自收藏集合的第一个产品（算法确保已经添加过这些“收藏”）
            uint256 delProdId = (u * 3) % (NUM_PRODS - 1) + 1;
            zh.delFavorite(favUsers[u], delProdId);
        }

        vm.stopBroadcast();
    }
}