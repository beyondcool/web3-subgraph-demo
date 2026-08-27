import {
  OrderCanceled as OrderCanceledEvent,
  OrderCreated as OrderCreatedEvent,
  OrderPaid as OrderPaidEvent,
  ProdCreated as ProdCreatedEvent,
  ProdDeleted as ProdDeletedEvent,
  ProdModified as ProdModifiedEvent,
  UserCreated as UserCreatedEvent,
  UserDeleted as UserDeletedEvent,
  UserModified as UserModifiedEvent
} from "../generated/ZhSubgraph01/ZhSubgraph01"
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
} from "../generated/schema"

export function handleOrderCanceled(event: OrderCanceledEvent): void {
  let entity = new OrderCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.orderId = event.params.orderId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderCreated(event: OrderCreatedEvent): void {
  let entity = new OrderCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.orderId = event.params.orderId
  entity.userAddr = event.params.userAddr
  entity.prodId = event.params.prodId
  entity.amount = event.params.amount
  entity.totalPrice = event.params.totalPrice

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderPaid(event: OrderPaidEvent): void {
  let entity = new OrderPaid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.orderId = event.params.orderId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProdCreated(event: ProdCreatedEvent): void {
  let entity = new ProdCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.prodId = event.params.prodId
  entity.prodName = event.params.prodName
  entity.unitPrice = event.params.unitPrice

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProdDeleted(event: ProdDeletedEvent): void {
  let entity = new ProdDeleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.prodId = event.params.prodId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProdModified(event: ProdModifiedEvent): void {
  let entity = new ProdModified(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.prodId = event.params.prodId
  entity.prodName = event.params.prodName
  entity.unitPrice = event.params.unitPrice

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUserCreated(event: UserCreatedEvent): void {
  let entity = new UserCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.userAddr = event.params.userAddr
  entity.age = event.params.age
  entity.name = event.params.name

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUserDeleted(event: UserDeletedEvent): void {
  let entity = new UserDeleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.userAddr = event.params.userAddr

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUserModified(event: UserModifiedEvent): void {
  let entity = new UserModified(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.userAddr = event.params.userAddr
  entity.age = event.params.age
  entity.name = event.params.name

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
