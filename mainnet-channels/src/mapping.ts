import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  ChannelFactory,
  ChannelCreation,
} from "../generated/ChannelFactory/ChannelFactory";
import { ERC20Abi } from "../generated/ChannelFactory/ERC20Abi";
import { ChannelsEntity, CountEntity } from "../generated/schema";

const DAI_Address = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const USDC_Address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

export function handleChannelCreation(event: ChannelCreation): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  // let entity = Channels.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  // if (entity == null) {
  let DAI_Contract = ERC20Abi.bind(Address.fromString(DAI_Address));
  let USDC_Contract = ERC20Abi.bind(Address.fromString(USDC_Address));
  let entity = new ChannelsEntity(event.transaction.hash.toHexString());
  let countEntity = CountEntity.load("channels");
  if (countEntity == null) {
    countEntity = new CountEntity("channels");
    countEntity.count = BigInt.fromI32(0);
  }

  if (entity == null) {
    countEntity.count = countEntity.count.plus(BigInt.fromI32(1));
  }

  entity.channel = event.params.channel;

  entity.dai = DAI_Contract.balanceOf(event.params.channel); //getting data from contract
  entity.usdc = USDC_Contract.balanceOf(event.params.channel); //getting data from contract
  // Entity fields can be set using simple assignments
  // entity.count = BigInt.fromI32(0);
  // }

  // BigInt and BigDecimal math are supported

  // Entity fields can be set based on event parameters

  // Entities can be written to the store with `.save()`
  entity.save();
  countEntity.save();

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.createChannel(...)
  // - contract.getChainId(...)
  // - contract.getChannelAddress(...)
  // - contract.getMastercopy(...)
  // - contract.getProxyCreationCode(...)
  // - contract.getStoredChainId(...)
}
