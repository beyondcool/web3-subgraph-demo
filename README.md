# 部署和验证合约
## 部署

部署后，记录区块链高度，配置subgraph时需要填写。

```shell
forge script script/Deploy.s.sol:DeployScript \
    --rpc-url $SEPOLIA_RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    -vvv
```
## 验证

```shell
forge verify-contract <DEPLOYED_ADDRESS> src/ZhSubgraph01.sol:ZhSubgraph01 \
    --chain sepolia
```

