import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  OrderCanceled,
  OrderCreated,
  OrderPaid,
  ProdCreated,
  ProdDeleted,
  ProdModified,
  UserCreated,
  UserDeleted,
  UserModified
} from "../generated/ZhSubgraph01/ZhSubgraph01"

export function createOrderCanceledEvent(orderId: BigInt): OrderCanceled {
  let orderCanceledEvent = changetype<OrderCanceled>(newMockEvent())

  orderCanceledEvent.parameters = new Array()

  orderCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )

  return orderCanceledEvent
}

export function createOrderCreatedEvent(
  orderId: BigInt,
  userAddr: Address,
  prodId: BigInt,
  amount: BigInt,
  totalPrice: BigInt
): OrderCreated {
  let orderCreatedEvent = changetype<OrderCreated>(newMockEvent())

  orderCreatedEvent.parameters = new Array()

  orderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam("userAddr", ethereum.Value.fromAddress(userAddr))
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam("prodId", ethereum.Value.fromUnsignedBigInt(prodId))
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalPrice",
      ethereum.Value.fromUnsignedBigInt(totalPrice)
    )
  )

  return orderCreatedEvent
}

export function createOrderPaidEvent(orderId: BigInt): OrderPaid {
  let orderPaidEvent = changetype<OrderPaid>(newMockEvent())

  orderPaidEvent.parameters = new Array()

  orderPaidEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )

  return orderPaidEvent
}

export function createProdCreatedEvent(
  prodId: BigInt,
  prodName: string,
  unitPrice: BigInt
): ProdCreated {
  let prodCreatedEvent = changetype<ProdCreated>(newMockEvent())

  prodCreatedEvent.parameters = new Array()

  prodCreatedEvent.parameters.push(
    new ethereum.EventParam("prodId", ethereum.Value.fromUnsignedBigInt(prodId))
  )
  prodCreatedEvent.parameters.push(
    new ethereum.EventParam("prodName", ethereum.Value.fromString(prodName))
  )
  prodCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "unitPrice",
      ethereum.Value.fromUnsignedBigInt(unitPrice)
    )
  )

  return prodCreatedEvent
}

export function createProdDeletedEvent(prodId: BigInt): ProdDeleted {
  let prodDeletedEvent = changetype<ProdDeleted>(newMockEvent())

  prodDeletedEvent.parameters = new Array()

  prodDeletedEvent.parameters.push(
    new ethereum.EventParam("prodId", ethereum.Value.fromUnsignedBigInt(prodId))
  )

  return prodDeletedEvent
}

export function createProdModifiedEvent(
  prodId: BigInt,
  prodName: string,
  unitPrice: BigInt
): ProdModified {
  let prodModifiedEvent = changetype<ProdModified>(newMockEvent())

  prodModifiedEvent.parameters = new Array()

  prodModifiedEvent.parameters.push(
    new ethereum.EventParam("prodId", ethereum.Value.fromUnsignedBigInt(prodId))
  )
  prodModifiedEvent.parameters.push(
    new ethereum.EventParam("prodName", ethereum.Value.fromString(prodName))
  )
  prodModifiedEvent.parameters.push(
    new ethereum.EventParam(
      "unitPrice",
      ethereum.Value.fromUnsignedBigInt(unitPrice)
    )
  )

  return prodModifiedEvent
}

export function createUserCreatedEvent(
  userAddr: Address,
  age: BigInt,
  name: string
): UserCreated {
  let userCreatedEvent = changetype<UserCreated>(newMockEvent())

  userCreatedEvent.parameters = new Array()

  userCreatedEvent.parameters.push(
    new ethereum.EventParam("userAddr", ethereum.Value.fromAddress(userAddr))
  )
  userCreatedEvent.parameters.push(
    new ethereum.EventParam("age", ethereum.Value.fromUnsignedBigInt(age))
  )
  userCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return userCreatedEvent
}

export function createUserDeletedEvent(userAddr: Address): UserDeleted {
  let userDeletedEvent = changetype<UserDeleted>(newMockEvent())

  userDeletedEvent.parameters = new Array()

  userDeletedEvent.parameters.push(
    new ethereum.EventParam("userAddr", ethereum.Value.fromAddress(userAddr))
  )

  return userDeletedEvent
}

export function createUserModifiedEvent(
  userAddr: Address,
  age: BigInt,
  name: string
): UserModified {
  let userModifiedEvent = changetype<UserModified>(newMockEvent())

  userModifiedEvent.parameters = new Array()

  userModifiedEvent.parameters.push(
    new ethereum.EventParam("userAddr", ethereum.Value.fromAddress(userAddr))
  )
  userModifiedEvent.parameters.push(
    new ethereum.EventParam("age", ethereum.Value.fromUnsignedBigInt(age))
  )
  userModifiedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return userModifiedEvent
}
