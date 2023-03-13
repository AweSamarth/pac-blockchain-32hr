import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  ItemBought as ItemBoughtEvent,
  ItemCancelled as ItemCancelledEvent,
  ItemListed as ItemListedEvent  
} from "../generated/NftMarketplace/NftMarketplace"

import {ItemListed, ActiveItem, ItemBought, ItemCancelled} from "../generated/schema"
//these are types


export function handleItemBought(event: ItemBoughtEvent): void {
  //item bought event is just the raw event
  // item bought object is what we want to save
  // they are of different types

  let itemBought = ItemBought.load() //for loading 


}

export function handleItemCancelled(event: ItemCancelledEvent): void {

}

export function handleItemListed(event: ItemListedEvent): void {

}

function getIdFromEventParams(tokenId: BigInt, nftAddress:Address):string{
  return tokenId.toHexString()+nftAddress.toHexString()
}
