import { Injectable } from '@angular/core';
import * as Neode from 'neode';

declare let require: any;
const config = require('../../../argos-config.json'); 

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private dbInstance: Neode;

  constructor() { 
    const bolt: string = config.neo4j.bolt;
    const username: string = config.neo4j.username;
    const password: string = config.neo4j.password;

    this.dbInstance = new Neode(bolt, username, password);
  }

  public createERC20Model(){
    this.dbInstance.model('Account',  {
      address: {
        type: 'string',
        primary: true
      },
      balance: 'number'
    });

    this.dbInstance.model('Sender').relationship('send', 'SEND', 'out', 'Receiver', {
      since: {
        type: 'number',
        required: true
      }
    });

    this.dbInstance.model('Receiver').relationship('receive', 'RECEIVE', 'in', 'Sender', {
      since: {
        type: 'number',
        required: true
      }
    });
  }

  public dbCreateNode(sender: string, receiver: string, value: number){
    
    let qSender, qReceiver;
    
    const qSenderQuery = this.dbFindNode('sender', 'Account', 'address', sender)
      .then((result) => {
        if(result.records.length == 0){
          qSender = result.records[0];
        }else{
          qSender = this.dbInstance.create('Account', {
            address: sender,
            balance: 0
          })
        }
      });
    
    const qReceiverQuery = this.dbFindNode('receiver', 'Account', 'address', receiver)
      .then((result) => {
        if(result.records.length == 0){
          qReceiver = result.records[0];
        }else{
          qReceiver = this.dbInstance.create('Account', {
            address: receiver,
            balance: value
          })
        }
      });
  }

  async dbFindNode(alias: string, model: any, target: string, condition: any){
    const builder = this.dbInstance.query();
    return builder
      .match(alias, model)
      .where(alias + '.' + target, condition)
      .return(alias)
      .execute();
  }
}
