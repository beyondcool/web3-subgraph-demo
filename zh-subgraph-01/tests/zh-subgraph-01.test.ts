import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { FavoriteCreated } from "../generated/schema"
import { FavoriteCreated as FavoriteCreatedEvent } from "../generated/ZhSubgraph01/ZhSubgraph01"
import { handleFavoriteCreated } from "../src/zh-subgraph-01"
import { createFavoriteCreatedEvent } from "./zh-subgraph-01-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let userAddr = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let prodId = BigInt.fromI32(234)
    let newFavoriteCreatedEvent = createFavoriteCreatedEvent(userAddr, prodId)
    handleFavoriteCreated(newFavoriteCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("FavoriteCreated created and stored", () => {
    assert.entityCount("FavoriteCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "FavoriteCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "userAddr",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "FavoriteCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "prodId",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
