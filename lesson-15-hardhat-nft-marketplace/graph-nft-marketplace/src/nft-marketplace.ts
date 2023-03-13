import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import {
  ItemBought as ItemBoughtEvent,
  ItemCancelled as ItemCancelledEvent,
  ItemListed as ItemListedEvent  
} from "../generated/NftMarketplace/NftMarketplace"

import {ItemListed, ActiveItem, ItemBought,  ItemCanceled} from "../generated/schema"
//these are types


export function handleItemBought(event: ItemBoughtEvent): void {
  //item bought event is just the raw event
  // item bought object is what we want to save
  // they are of different types

  let itemBought = ItemBought.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress)) //for loading 
  let activeItem =ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  if(!itemBought){
    itemBought = new ItemBought(getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )

  }

  itemBought.buyer = event.params.buyer
  itemBought.nftAddress = event.params.nftAddress
  itemBought.tokenId = event.params.tokenId
  activeItem!.buyer = event.params.buyer

  itemBought.save()
  activeItem!.save()
// !. something is a TypeScript notation which means that necessarily have an activeItem else the lhs won't be executed
// if it has a buyer, update buyer with events.params.buyer else don't


}

export function handleItemCancelled(event: ItemCancelledEvent): void {
  let itemCancelled = ItemCanceled.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress)) 

  if(!itemCancelled){
    itemCancelled = new ItemCanceled(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))

  }

  itemCancelled.seller = event.params.seller
  itemCancelled.nftAddress = event.params.nftAddress
  itemCancelled.tokenId = event.params.tokenId
  activeItem!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD")

  itemCancelled.save()
  activeItem!.save()
}

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed = ItemListed.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem =ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))

  if(!itemListed){
    itemListed = new ItemListed(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))

  }
  if(!activeItem){
    activeItem = new ActiveItem(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))

  }

  itemListed.seller = event.params.seller
  activeItem.seller = event.params.seller

  itemListed.nftAddress = event.params.nftAddress
  activeItem.nftAddress =event.params.nftAddress
  
  itemListed.tokenId = event.params.tokenId
  activeItem.tokenId= event.params.tokenId

  itemListed.price = event.params.price
  activeItem.price = event.params.price

  itemListed.save()
  activeItem.save()

}

function getIdFromEventParams(tokenId: BigInt, nftAddress:Address):string{
  return tokenId.toHexString()+nftAddress.toHexString()
}
