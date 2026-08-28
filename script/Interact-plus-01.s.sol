// script/Interact.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
// 导入你要交互的合约接口
import {ZhSubgraph01} from "../src/ZhSubgraph01.sol";

contract InteractScript is Script {

    function run() public {
        // 1. 从环境变量读取私钥
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 2. 连接已部署的合约
        address contractAddress = 0x0648396CAD3AFd367594a6651A22C01cdc881428; // 替换为你的合约地址
        ZhSubgraph01 zh = ZhSubgraph01(contractAddress);

        zh.createProd("note x", 3000);

        vm.stopBroadcast();
    }
}