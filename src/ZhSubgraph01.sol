// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract ZhSubgraph01 {

    uint private nextOrderId = 1;
    uint private nextProdId = 1;

    event UserCreated(address indexed userAddr, uint age, string name);
    event UserModified(address indexed userAddr, uint age, string name);
    event UserDeleted(address indexed userAddr);

    event OrderCreated(uint indexed orderId, address indexed userAddr, uint indexed prodId, uint amount, uint totalPrice);
    event OrderCanceled(uint orderId);
    event OrderPaid(uint orderId);

    event ProdCreated(uint indexed prodId, string prodName, uint unitPrice);
    event ProdModified(uint indexed prodId, string prodName, uint unitPrice);
    event ProdDeleted(uint indexed prodId);

    // 用户数据（用户地址由参数传入，便于脚本模拟多个用户）
    function createUser(address userAddr, uint age, string calldata name) external returns (bool rs) {
        emit UserCreated(userAddr, age, name);
        return true;
    }

    function modifyUser(address userAddr, uint age, string calldata name) external returns (string memory result) {
        emit UserModified(userAddr, age, name);
        return "Ok.";
    }

    function deleteUser(address userAddr) external {
        emit UserDeleted(userAddr);
    }

    // 产品数据（比如 NFT）
    function createProd(string calldata prodName, uint unitPrice) external returns (bool)  {
        emit ProdCreated(nextProdId, prodName, unitPrice);
        nextProdId++;
        return true;
    }

    function modifyProd(uint prodId, string calldata prodName, uint unitPrice) external returns(bool){
        emit ProdModified(prodId, prodName, unitPrice);
        return true;
    }
    
    function deleteProd(uint prodId) external returns(bool){
        emit ProdDeleted(prodId);
        return true;
    }
    
    // 订单数据
    function createOrder(address userAddr, uint prodId, uint amount, uint totalPrice) external returns (bool)  {
        emit OrderCreated(nextOrderId, userAddr, prodId, amount, totalPrice);
        nextOrderId++;
        return true;
    }

    function cancelOrder(uint orderId) external returns(bool){
        emit OrderCanceled(orderId);
        return true;
    }

    function payOrder(uint orderId) external returns(bool){
        emit OrderPaid(orderId);
        return true;
    }
}