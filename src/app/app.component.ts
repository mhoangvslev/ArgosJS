import { Component, HostListener, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Neo4J, EthereumWatcher, Database, Watcher, ProviderEnum } from "argosjs";

const config = require("../../argos-config.js");

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ArgosJS (Panoptes)';

  setupForm: FormGroup;
  _contractService: Watcher;
  _dbService: Database;

  constructor(private formBuildier: FormBuilder ) {
  }

  /* Form controls */
  ngOnInit(){
    this.setupForm = this.formBuildier.group({
      ethersAbi: [ config.contract.abi, Validators.required],
      ethersAddr: [ config.contract.address, Validators.required],
    });
  }

  get getFormControls() { return this.setupForm.controls; }
  
  /* Argos */
  initArgos(){

    // Attributes from form
    const ctrl = this.setupForm.controls;
    const abi = ctrl.ethersAbi.value;
    const addr = ctrl.ethersAddr.value;
  
    this._dbService = new Neo4J(config.neo4j.bolt, config.neo4j.username, config.neo4j.password, true);
    this._dbService.dbCreateModel(require('../models/Account.js'));

    this._contractService = new EthereumWatcher(addr, abi, ProviderEnum.InfuraProvider, this._dbService, config);
    this._contractService.watchEvents("Transfer", "transfer");
  }
}
