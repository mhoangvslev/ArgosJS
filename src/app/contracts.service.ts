import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { BaseProvider } from 'ethers/providers';

declare let window: any;
declare let require: any;

@Injectable({
  providedIn: 'root'
})
export class ContractsService {

  private _provider: ethers.providers.EtherscanProvider;
  private tokContract: ethers.Contract;
  private tokContractAddr: string;
  private tokContractName: string;

  private eventHistory: {}; 

  constructor(provider: string, abi: string, addr: string, name: string) { 
    const options = require('../../argos-config.json'); 
    const etherScanAPI = options.etherscan.api;

    this._provider = new ethers.providers.EtherscanProvider('homestead', etherScanAPI);
    this._provider.resetEventsBlock(0);
    console.log(this._provider);

    this.tokContractAddr = addr;
    this.tokContractName = name;
    this.tokContract = new ethers.Contract(this.tokContractAddr, abi, this._provider);
    console.log(this.tokContract);
  }


  async Listen_ERC20(){

    console.log('Start logging ERC20 events')

    const topics = [
      ethers.utils.id("Transfer(address, address, uint256)"),
      ethers.utils.id("Approval(address, address, uint256)")
    ];

    const filter = {
      address: this.tokContractAddr,
      topics: topics
    };

    this._provider
      .getHistory(this.tokContractAddr, 0, "latest")
      .then((history) => {
        history.forEach((tx) => {
          console.log(tx);
        })
      });

    this.tokContract.on("Transfer", (from, to, value, event) => {
      console.log(from, to, value);
      console.log(event.blockNumber);
    });
  }

  
}
