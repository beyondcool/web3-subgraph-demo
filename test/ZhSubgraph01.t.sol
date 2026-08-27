// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {ZhSubgraph01} from "../src/ZhSubgraph01.sol";

contract CounterTest is Test {
    ZhSubgraph01 public subgrap;

    function setUp() public {
        subgrap = new ZhSubgraph01();
    }

    function test_xxx() public {
       
    }
}
