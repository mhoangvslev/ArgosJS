import { Injectable } from '@angular/core';
import * as Neode from 'neode';

const config = require('../../../argos-config.js'); 

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

    Promise.all([
      this.dbInstance.model('Account',  {
        address: {
          primary: true,
          type: 'string'
        }
      }),
  
      this.dbInstance.model('Account').relationship('send', 'SEND', 'out', 'Account', {
        amount: {
          type: 'string'
        }
      }, true, "delete"),
  
      this.dbInstance.model('Account').relationship('receive', 'RECEIVE', 'in', 'Account', {
        amount: {
          type: 'string'
        }
      }, true, "delete")
    ]).then(
      // On fullfilled 
      ([model, modelS, modelR]) => {
        console.log(model, modelS, modelR);
      },

      // On rejected
      (error) => {
        console.log("Could not create models", error); 
      }
    );
    

    this.dbInstance.deleteAll('Account').then(() => {
      console.log("Reset database");
    });
  }

  public dbRelateNodes(sender: Neode.Node<any>, receiver: Neode.Node<any>, value: string){
    // Create relationships
    sender.relateTo(receiver, 'send', { amount: value }).catch( (error) => {console.log("Could not relate nodes", error);} );
    receiver.relateTo(sender, 'receive', { amount: value }).catch( (error) => {console.log("Could not relate nodes", error);} );;
  }

  public dbCreateNode(senderAddr: string, receiverAddr: string, value: string){

    // Find nodes
    Promise.all([
      this.dbInstance.mergeOn('Account', {address: senderAddr}, {address: senderAddr}),
      this.dbInstance.mergeOn('Account', {address: receiverAddr}, {address: receiverAddr}),
    ]).then(

      // On fullfilled
      ([sender, receiver]) => {
        // Sender and receiver found
        //console.log("Found both", sender, receiver);
        this.dbRelateNodes(sender, receiver, value);        
      },

      // On rejected
      (error) => {
        console.log("Could not create/update node", error);
      }
    );
  }
}
