// script/Deploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {ZhSubgraph01} from "../src/ZhSubgraph01.sol"; // 替换为你的合约

contract DeployScript is Script {
    function run() public {
        // 打印当前区块高度
        console.log("Current block number:", block.number);

        // 使用私钥开始广播交易
        vm.startBroadcast();

        // 部署你的合约，这里以 Counter 为例
        ZhSubgraph01 subgraph01 = new ZhSubgraph01();
        console.log("subgraph01 deployed to:", address(subgraph01));

        vm.stopBroadcast();
    }
}