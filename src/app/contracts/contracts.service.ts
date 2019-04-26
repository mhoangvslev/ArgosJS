import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { DatabaseService } from '../database/database.service';

const options = require('../../../argos-config.js'); 


@Injectable({
  providedIn: 'root'
})
export class ContractsService {

  private _provider: ethers.providers.EtherscanProvider;
  private _contract: ethers.Contract;
  private _contractAddr: string;
  private _dbService: DatabaseService;

  private eventHistory: {}; 

  constructor(abi: string, addr: string, dbService: DatabaseService) { 
    const etherScanAPI = options.etherscan.api;
    this._provider = new ethers.providers.EtherscanProvider('homestead', etherScanAPI);
    console.log(this._provider);

    this._contractAddr = addr;
    this._contract = new ethers.Contract(this._contractAddr, abi, this._provider);
    console.log(this._contract);

    this._dbService = dbService;
  }

  async getEvents(eventName: string, fromBlock = 0, toBlock = 'latest') {
    
    console.log("Getting events '" +  eventName + "' from block #" + fromBlock + " to block #"+ toBlock)
    let event = this._contract.interface.events[eventName];

    let logs = await this._provider.getLogs({
      fromBlock,
      toBlock,
      address: this._contractAddr,
      topics: [ event.topic ]
    });

    return logs
      .map(log => event.decode(log.data, log.topics))
      //.filter(item => item._from != "0x0000000000000000000000000000000000000000");
  }

  async Listen_ERC20(){

    console.log('Start logging ERC20 events')

    this._dbService.createERC20Model();
    const events = await this.getEvents("Transfer");

    //console.log(events);

    var p = Promise.resolve();

    events.forEach( (event) => {
      let sender: string = event.from;
      let receiver: string = event.to;
      let value: ethers.utils.BigNumber = event.value;
      let strValue = value.toString();

      console.log(strValue);
      this._dbService.dbCreateNode(sender, receiver, strValue);

      console.log("Database updated!");
    });
  }  
}
