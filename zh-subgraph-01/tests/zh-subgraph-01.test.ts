import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  handleFavoriteCreated,
  handleOrderCreated,
  handleOrderPaid,
  handleProdCreated,
  handleUserCreated,
  handleUserDeleted,
  handleUserModified
} from "../src/zh-subgraph-01"
import {
  createFavoriteCreatedEvent,
  createOrderCreatedEvent,
  createOrderPaidEvent,
  createProdCreatedEvent,
  createUserCreatedEvent,
  createUserDeletedEvent,
  createUserModifiedEvent
} from "./zh-subgraph-01-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

const USER_ADDR = "0x0000000000000000000000000000000000000001"

describe("Domain model handlers", () => {
  beforeAll(() => {
    let userAddr = Address.fromString(USER_ADDR)

    handleUserCreated(
      createUserCreatedEvent(userAddr, BigInt.fromI32(30), "Alice")
    )
    handleUserModified(
      createUserModifiedEvent(userAddr, BigInt.fromI32(31), "Alice")
    )
    handleProdCreated(
      createProdCreatedEvent(BigInt.fromI32(1), "Coffee", BigInt.fromI32(50))
    )
    handleOrderCreated(
      createOrderCreatedEvent(
        BigInt.fromI32(100),
        userAddr,
        BigInt.fromI32(1),
        BigInt.fromI32(2),
        BigInt.fromI32(100)
      )
    )
    handleOrderPaid(createOrderPaidEvent(BigInt.fromI32(100)))
    handleFavoriteCreated(
      createFavoriteCreatedEvent(userAddr, BigInt.fromI32(1))
    )
    handleUserDeleted(createUserDeletedEvent(userAddr))
  })

  afterAll(() => {
    clearStore()
  })

  test("User entity id is the user on-chain address (lowercase hex)", () => {
    assert.entityCount("User", 1)
    // id == event.params.userAddr（address 转小写十六进制）
    assert.fieldEquals("User", USER_ADDR, "age", "31")
    assert.fieldEquals("User", USER_ADDR, "name", "Alice")
    assert.fieldEquals("User", USER_ADDR, "active", "false")
  })

  test("Product entity is stored by prodId", () => {
    assert.entityCount("Product", 1)
    assert.fieldEquals("Product", "1", "prodName", "Coffee")
    assert.fieldEquals("Product", "1", "unitPrice", "50")
    assert.fieldEquals("Product", "1", "active", "true")
  })

  test("Order entity links user and product, status Paid", () => {
    assert.entityCount("Order", 1)
    assert.fieldEquals("Order", "100", "user", USER_ADDR)
    assert.fieldEquals("Order", "100", "product", "1")
    assert.fieldEquals("Order", "100", "amount", "2")
    assert.fieldEquals("Order", "100", "totalPrice", "100")
    assert.fieldEquals("Order", "100", "status", "Paid")
  })

  test("Favorite entity is stored", () => {
    assert.entityCount("Favorite", 1)
  })

  test("Stats counters", () => {
    // Stats.id 为 Bytes（固定 "stats"），store 中按十六进制字符串存储
    let statsId = Bytes.fromUTF8("stats").toHexString()
    assert.fieldEquals("Stats", statsId, "userCount", "1")
    assert.fieldEquals("Stats", statsId, "productCount", "1")
    assert.fieldEquals("Stats", statsId, "orderCount", "1")
    assert.fieldEquals("Stats", statsId, "paidOrderCount", "1")
    assert.fieldEquals("Stats", statsId, "totalRevenue", "100")
    assert.fieldEquals("Stats", statsId, "favoriteCount", "1")
  })
})
