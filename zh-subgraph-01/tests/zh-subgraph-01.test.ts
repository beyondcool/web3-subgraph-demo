import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { OrderCanceled } from "../generated/schema"
import { OrderCanceled as OrderCanceledEvent } from "../generated/ZhSubgraph01/ZhSubgraph01"
import { handleOrderCanceled } from "../src/zh-subgraph-01"
import { createOrderCanceledEvent } from "./zh-subgraph-01-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let orderId = BigInt.fromI32(234)
    let newOrderCanceledEvent = createOrderCanceledEvent(orderId)
    handleOrderCanceled(newOrderCanceledEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("OrderCanceled created and stored", () => {
    assert.entityCount("OrderCanceled", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "OrderCanceled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "orderId",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
