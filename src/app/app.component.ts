import { Component, HostListener, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Database, Watcher, ProviderEnum, WatcherFactory, WatcherEnum, DatabaseEnum } from "argosjs";

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

  constructor(private formBuildier: FormBuilder) {
  }

  /* Form controls */
  ngOnInit() {
    this.setupForm = this.formBuildier.group({
      ethersAbi: [config.contract.abi, Validators.required],
      ethersAddr: [config.contract.address, Validators.required],
      clearDB: [false]
    });
  }

  get getFormControls() { return this.setupForm.controls; }

  /* Argos */
  initArgos() {

    // Attributes from form
    const ctrl = this.setupForm.controls;
    const abi = ctrl.ethersAbi.value;
    const addr = ctrl.ethersAddr.value;
    const clearDB = ctrl.clearDB.value;

    const dbConstructor = {
      type: DatabaseEnum.Neo4J,
      config: config.database.neo4j,
      model: require('../models/Account.js')
    }

    this._contractService = WatcherFactory.createWatcherInstance({
      type: WatcherEnum.EthereumWatcher,
      provider: ProviderEnum.InfuraProvider,
      clearDB: clearDB,
      address: addr,
      abi: abi,
      db: dbConstructor,
      providerConf: config.providers
    });
    this._contractService.watchEvents("Transfer", "transfer");
  }
}
