import { BigInt, Bytes, store } from "@graphprotocol/graph-ts"
import {
  FavoriteCreated as FavoriteCreatedEvent,
  FavoriteDeleted as FavoriteDeletedEvent,
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
import { Favorite, Order, Product, Stats, User } from "../generated/schema"

// 全局统计实体 id（固定为 "stats"）
const STATS_ID = Bytes.fromUTF8("stats")

function getStats(): Stats {
  let stats = Stats.load(STATS_ID)
  if (stats == null) {
    stats = new Stats(STATS_ID)
    stats.userCount = BigInt.zero()
    stats.productCount = BigInt.zero()
    stats.orderCount = BigInt.zero()
    stats.paidOrderCount = BigInt.zero()
    stats.totalRevenue = BigInt.zero()
    stats.favoriteCount = BigInt.zero()
  }
  return stats
}

// 收藏组合键：user地址(小写十六进制)-prodId
function favoriteId(userAddr: Bytes, prodId: BigInt): Bytes {
  return Bytes.fromUTF8(
    userAddr.toHexString() + "-" + prodId.toString()
  )
}

// ---------- User ----------

export function handleUserCreated(event: UserCreatedEvent): void {
  // 实体 id 使用用户链上地址（address，转小写十六进制）
  let entity = User.load(event.params.userAddr)
  if (entity == null) {
    entity = new User(event.params.userAddr)
    entity.active = true
    entity.createdAtBlock = event.block.number

    let stats = getStats()
    stats.userCount = stats.userCount.plus(BigInt.fromI32(1))
    stats.save()
  }
  entity.age = event.params.age
  entity.name = event.params.name
  entity.updatedAtBlock = event.block.number
  entity.updatedAtTimestamp = event.block.timestamp

  entity.save()
}

export function handleUserModified(event: UserModifiedEvent): void {
  let entity = User.load(event.params.userAddr)
  if (entity == null) {
    entity = new User(event.params.userAddr)
    entity.active = true
    entity.createdAtBlock = event.block.number
  }
  entity.age = event.params.age
  entity.name = event.params.name
  entity.updatedAtBlock = event.block.number
  entity.updatedAtTimestamp = event.block.timestamp

  entity.save()
}

export function handleUserDeleted(event: UserDeletedEvent): void {
  let entity = User.load(event.params.userAddr)
  if (entity == null) {
    entity = new User(event.params.userAddr)
    entity.age = BigInt.zero()
    entity.name = ""
    entity.createdAtBlock = event.block.number
  }
  entity.active = false
  entity.updatedAtBlock = event.block.number
  entity.updatedAtTimestamp = event.block.timestamp

  entity.save()
}

// ---------- Product ----------

export function handleProdCreated(event: ProdCreatedEvent): void {
  let entity = new Product(event.params.prodId.toString())
  entity.prodName = event.params.prodName
  entity.unitPrice = event.params.unitPrice
  entity.active = true
  entity.createdAtBlock = event.block.number
  entity.updatedAtBlock = event.block.number
  entity.updatedAtTimestamp = event.block.timestamp

  entity.save()

  let stats = getStats()
  stats.productCount = stats.productCount.plus(BigInt.fromI32(1))
  stats.save()
}

export function handleProdModified(event: ProdModifiedEvent): void {
  let entity = Product.load(event.params.prodId.toString())
  if (entity == null) {
    entity = new Product(event.params.prodId.toString())
    entity.active = true
    entity.createdAtBlock = event.block.number
  }
  entity.prodName = event.params.prodName
  entity.unitPrice = event.params.unitPrice
  entity.updatedAtBlock = event.block.number
  entity.updatedAtTimestamp = event.block.timestamp

  entity.save()
}

export function handleProdDeleted(event: ProdDeletedEvent): void {
  let entity = Product.load(event.params.prodId.toString())
  if (entity == null) {
    entity = new Product(event.params.prodId.toString())
    entity.prodName = ""
    entity.unitPrice = BigInt.zero()
    entity.createdAtBlock = event.block.number
  }
  entity.active = false
  entity.updatedAtBlock = event.block.number
  entity.updatedAtTimestamp = event.block.timestamp

  entity.save()
}

// ---------- Order ----------

export function handleOrderCreated(event: OrderCreatedEvent): void {
  let entity = new Order(event.params.orderId.toString())
  entity.user = event.params.userAddr
  entity.product = event.params.prodId.toString()
  entity.amount = event.params.amount
  entity.totalPrice = event.params.totalPrice
  entity.status = "Created"
  entity.createdAtBlock = event.block.number
  entity.createdAtTimestamp = event.block.timestamp
  entity.updatedAtBlock = event.block.number
  entity.updatedAtTimestamp = event.block.timestamp
  entity.txHash = event.transaction.hash

  entity.save()

  let stats = getStats()
  stats.orderCount = stats.orderCount.plus(BigInt.fromI32(1))
  stats.save()
}

export function handleOrderPaid(event: OrderPaidEvent): void {
  let entity = Order.load(event.params.orderId.toString())
  if (entity == null) return

  entity.status = "Paid"
  entity.updatedAtBlock = event.block.number
  entity.updatedAtTimestamp = event.block.timestamp

  entity.save()

  let stats = getStats()
  stats.paidOrderCount = stats.paidOrderCount.plus(BigInt.fromI32(1))
  stats.totalRevenue = stats.totalRevenue.plus(entity.totalPrice)
  stats.save()
}

export function handleOrderCanceled(event: OrderCanceledEvent): void {
  let entity = Order.load(event.params.orderId.toString())
  if (entity == null) return

  entity.status = "Canceled"
  entity.updatedAtBlock = event.block.number
  entity.updatedAtTimestamp = event.block.timestamp

  entity.save()
}

// ---------- Favorite ----------

export function handleFavoriteCreated(event: FavoriteCreatedEvent): void {
  let entity = new Favorite(
    favoriteId(event.params.userAddr, event.params.prodId)
  )
  entity.user = event.params.userAddr
  entity.product = event.params.prodId.toString()
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let stats = getStats()
  stats.favoriteCount = stats.favoriteCount.plus(BigInt.fromI32(1))
  stats.save()
}

export function handleFavoriteDeleted(event: FavoriteDeletedEvent): void {
  let id = favoriteId(event.params.userAddr, event.params.prodId)
  let entity = Favorite.load(id)
  if (entity == null) return

  store.remove("Favorite", id.toHexString())

  let stats = getStats()
  if (stats.favoriteCount.gt(BigInt.zero())) {
    stats.favoriteCount = stats.favoriteCount.minus(BigInt.fromI32(1))
  }
  stats.save()
}
