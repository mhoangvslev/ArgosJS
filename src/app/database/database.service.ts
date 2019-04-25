import { Injectable } from '@angular/core';
import * as Neode from 'neode';

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
      }
    });

    this.dbInstance.model('Account').relationship('send', 'SEND', 'out', 'Account', {
      amount: {
        type: 'number',
        required: true
      }
    });

    this.dbInstance.model('Account').relationship('receive', 'RECEIVE', 'in', 'Account', {
      amount: {
        type: 'number',
        required: true
      }
    });
  }

  public dbCreateNode(sender: string, receiver: string, value: number){
    
    Promise.all([
      this.dbInstance.create('Account', { address: sender }),
      this.dbInstance.create('Account', { address: receiver })
    ]).then( ([sender, receiver]) => {
      // Merge duplicata
      this.dbInstance.merge('Account', { address: sender });
      this.dbInstance.merge('Account', { address: receiver });

      // Create relationships
      sender.relateTo(receiver, 'send', { amount: value});
      receiver.relateTo(sender, 'receive', { amount: value });
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
