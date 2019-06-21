import { Component, HostListener, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Database, Watcher, NeoVis, CentralityAlgorithmEnum, CommunityDetectionAlgoritmEnum, PathFindingAlgorithmEnum, Neo4JConstructor, DatabaseFactory, WatcherFactory, WatcherEnum, ProviderEnum } from "argosjs";
import { MatTableDataSource } from '@angular/material';
import { Options, LabelType } from 'ng5-slider';

const config = require("../../config/argos-config.js");

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private _eventWatcher: Watcher;
  private _dbService: Database;

  private _visualiser: NeoVis;

  //private _strategies: object = require("../../database/strategies/KittyStrategies.js");
  private _strategies: object = require("../../database/strategies/AccountStrategies.js");

  title = 'ArgosJS (Panoptes)';

  setupForm: FormGroup;

  nodeTypes: string[];
  relTypes: string[];

  centralityAlgorithm: CentralityAlgorithmEnum = CentralityAlgorithmEnum.None;
  ca_algorithms: CentralityAlgorithmEnum[];
  ca_label: string;
  ca_relationship: string;
  
  communityDetectionAlgorithm: CommunityDetectionAlgoritmEnum = CommunityDetectionAlgoritmEnum.None;
  cda_algorithms: CommunityDetectionAlgoritmEnum[];
  cda_label: string;
  cda_relationship: string;

  pathAlgo: PathFindingAlgorithmEnum = PathFindingAlgorithmEnum.None;
  pathfinding_algorithms: PathFindingAlgorithmEnum[]

  queryLimit: number = 700;
  csvFolder: any;

  dbConstructor: Neo4JConstructor = {
    username: config.database.neo4j.username,
    password: config.database.neo4j.password,
    bolt: config.database.neo4j.bolt,
    enterpriseMode: config.database.neo4j.enterpriseMode,
    driverConf: config.database.neo4j.driverConf,
    model: {
      //Kitty: require('../../database/models/Kitty.js'),
      Account: require('../../database/models/Account.js')
    }
  }

  /*
  dataSource = new MatTableDataSource();
  columns: Array<any> = [];
  displayedColumns: string[] = this.columns.map(column => column.name);
  */

  filterFromDate: number;
  filterToDate: number;
  filterQuery: string;

  filterStoryDateRange: Options = {
    floor: 0,
    ceil: 1
  }
  filterStoryCommunity: number = 0;
  _contractInfo: any;

  constructor(private formBuildier: FormBuilder) {
    this.cda_algorithms = [
      CommunityDetectionAlgoritmEnum.None,
      CommunityDetectionAlgoritmEnum.Louvain,
      CommunityDetectionAlgoritmEnum.LabelPropagation,
      CommunityDetectionAlgoritmEnum.ConnectedComponents,
      CommunityDetectionAlgoritmEnum.StronglyConnectedComponents,
      CommunityDetectionAlgoritmEnum.ClusteringCoefficient,
      CommunityDetectionAlgoritmEnum.BalancedTriads
    ];

    this.ca_algorithms = [
      CentralityAlgorithmEnum.None,
      CentralityAlgorithmEnum.PageRank,
      CentralityAlgorithmEnum.ArticleRank,
      CentralityAlgorithmEnum.BetweenessCentrality,
      CentralityAlgorithmEnum.ClosenessCentrality,
      CentralityAlgorithmEnum.HarmonicCentrality,
      CentralityAlgorithmEnum.EigenvectorCentrality,
      CentralityAlgorithmEnum.DegreeCentrality,
    ];

    this.pathfinding_algorithms = [
      PathFindingAlgorithmEnum.None,
      PathFindingAlgorithmEnum.MinimumWeightSpanningTree,
      PathFindingAlgorithmEnum.ShortestPath,
      PathFindingAlgorithmEnum.SingleSourceShortestPath,
      PathFindingAlgorithmEnum.AllPairsShortestPath,
      PathFindingAlgorithmEnum.AStar,
      PathFindingAlgorithmEnum.RandomWalk
    ];
  }

  /* Form controls */
  ngOnInit() {

    const self = this;

    // Create DB service
    this._dbService = DatabaseFactory.createDbInstance(self.dbConstructor);
    this.nodeTypes = this._dbService.getNodeTypes();
    this.relTypes = this._dbService.getRelTypes();

    this.ca_label = (this.nodeTypes.length == 1) ? this.nodeTypes[0] : undefined;
    this.cda_label = (this.nodeTypes.length == 1) ? this.nodeTypes[0] : undefined;

    this.ca_relationship = (this.relTypes.length == 1) ? this.relTypes[0] : undefined;
    this.cda_relationship = (this.relTypes.length == 1) ? this.relTypes[0] : undefined;
    
    // Create default watcher
    this._contractInfo = this._strategies["Contracts"]["BNB"];
    this._eventWatcher = WatcherFactory.createWatcherInstance({
      type: WatcherEnum.EthereumWatcher,
      provider: ProviderEnum.InfuraProvider,
      clearDB: false,
      address: this._contractInfo.address,
      abi: this._contractInfo.abi,
      db: this.dbConstructor,
      providerConf: config.providers,
      exportDir: config.contract.export
    });

    // Set DES and PS to the watcher
    this._eventWatcher.setStrategies({
      DataExtractionStrategy: this._strategies["DataExtractionStrategy"],
      PersistenceStrategy: this._strategies["PersistenceStrategy"]
    });

    // Create visualiser
    this._visualiser = new NeoVis(this.dbConstructor, "viz", config.datavis.neovis);
    this._visualiser.setVisualisationStrategy(this._strategies["VisualisationStrategy"]);


    // Setup form
    this._dbService.executeQuery({
      query: "MATCH (n)-[r]->(m) RETURN min(r.date) as minBlk, max(r.date) as maxBlk"
    }).then((result) => {
      console.log(result[0]);

      const minBlk = new Date(result[0].get('minBlk'));
      const maxBlk = new Date(result[0].get('maxBlk'));

      this.filterFromDate = minBlk.getTime();
      this.filterToDate = maxBlk.getTime();

      self.filterStoryDateRange = {
        floor: minBlk.getTime(),
        ceil: maxBlk.getTime(),
        translate: (value, label) => {

          const date = new Date(value)
          const formatted = date.toLocaleDateString() + '@' + date.toLocaleTimeString();

          return formatted;
        }
      }
    });

    // Form
    this.setupForm = this.formBuildier.group({
      ethersAbi: [config.contract.abi, Validators.required],
      ethersAddr: [config.contract.address, Validators.required],
      clearDB: [false],
      fromDate: [],
      toDate: []
    });
  }

  get getFormControls() { return this.setupForm.controls; }

  /* Argos */
  initArgos() {

    // Attributes from form
    const ctrl = this.setupForm.controls;
    //const abi = ctrl.ethersAbi.value;
    //const addr = ctrl.ethersAddr.value;

    const clearDB = ctrl.clearDB.value;
    let fromDateForm = ctrl.fromDate.value;
    let toDateForm = ctrl.toDate.value;


    const fromDate = fromDateForm ? new Date(fromDateForm.year + "-" + fromDateForm.month + "-" + fromDateForm.day) : undefined;
    const toDate = toDateForm ? new Date(toDateForm.year + "-" + toDateForm.month + "-" + toDateForm.day) : undefined;

    this._eventWatcher.setClearDBFlag(clearDB);

    // Set DES and PS to the watcher
    this._eventWatcher.setStrategies({
      DataExtractionStrategy: this._strategies["DataExtractionStrategy"],
      PersistenceStrategy: this._strategies["PersistenceStrategy"]
    });

    // Watch events
    this._eventWatcher.watchEvents(this._contractInfo["eventName"], fromDate, toDate)
      .then(() => {
        this._visualiser.refresh();
      });
  }

  drawCommunity(event: any) {
    this._visualiser.detectCommunity(this.communityDetectionAlgorithm, { label: 'Account', relationship: 'TRANSFER', writeProperty: "community" });
  }

  drawCentrality(event: any) {
    this._visualiser.centrality(this.centralityAlgorithm, { label: 'Account', relationship: 'TRANSFER', writeProperty: "size" });
  }

  drawPath() {
    this._visualiser.pathfinding({ algo: PathFindingAlgorithmEnum.ShortestPath, param: {} });
  }

  redraw(event: any) {
    this._visualiser.setQueryLimit(this.queryLimit);
  }

  resetViz(event: any) {
    this._visualiser.clear();
  }

  execFilterQuery(event: any) {
    this._visualiser.displayWithCypher({ query: this.filterQuery }, 0)
  }

  execFilterStory(event: any) {
    this._visualiser.filterCommunityByDateRange(
      this.filterFromDate,
      this.filterToDate,
      this.filterStoryCommunity
    );
  }

}
