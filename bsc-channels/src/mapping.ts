import { Address } from "@graphprotocol/graph-ts";
import { ChannelCreation } from "../generated/ChannelFactory/ChannelFactory";
import { ERC20Abi } from "../generated/ChannelFactory/ERC20Abi";
import { ChannelMastercopy } from "../generated/ChannelFactory/ChannelMastercopy";
import { ChannelsEntity } from "../generated/schema";
import * as config from "../config";

export function handleChannelCreation(event: ChannelCreation): void {
  let USDT_Contract = ERC20Abi.bind(Address.fromString(config.USDT_ADDRESS));
  let DAI_Contract = ERC20Abi.bind(Address.fromString(config.DAI_ADDRESS));
  let USDC_Contract = ERC20Abi.bind(Address.fromString(config.USDC_ADDRESS));

  let entity = new ChannelsEntity(event.params.channel.toHexString());

  entity.channel = event.params.channel;

  entity.dai = DAI_Contract.balanceOf(event.params.channel); //getting data from contract
  entity.usdt = USDT_Contract.balanceOf(event.params.channel); //getting data from contract
  entity.usdc = USDC_Contract.balanceOf(event.params.channel); //getting data from contract

  let ChannelMastercopy_Contract = ChannelMastercopy.bind(event.params.channel);
  entity.alice = ChannelMastercopy_Contract.getAlice();
  entity.bob = ChannelMastercopy_Contract.getBob();
  entity.save();
}
