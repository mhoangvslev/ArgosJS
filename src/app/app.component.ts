import { Component, HostListener, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Database, Watcher, NeoVis, CentralityAlgorithmEnum, CommunityDetectionAlgoritmEnum, PathFindingAlgorithmEnum, Neo4JConstructor, DatabaseFactory, WatcherFactory, WatcherEnum, ProviderEnum } from "argosjs";
import { MatTableDataSource } from '@angular/material';
import { Options } from 'ng5-slider';

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

  _visualiser: NeoVis;

  centralityAlgorithm: CentralityAlgorithmEnum = CentralityAlgorithmEnum.None;
  ca_algorithms: CentralityAlgorithmEnum[];

  communityDetectionAlgorithm: CommunityDetectionAlgoritmEnum = CommunityDetectionAlgoritmEnum.None;
  cda_algorithms: CommunityDetectionAlgoritmEnum[]

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
    model: require('../models/Account.js')
  }

  dataSource = new MatTableDataSource();
  columns: Array<any> = [];
  displayedColumns: string[] = this.columns.map(column => column.name);

  filterAddress: string;
  filterAddressOut: boolean;
  filterAddressIn: boolean;

  filterFromDate: number;
  filterToDate: number;
  filterQuery: string;

  filterStoryDateRange: Options = {
    floor: 0,
    ceil: 1
  }
  filterStoryCommunity: number = 0;

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
    this.setupForm = this.formBuildier.group({
      ethersAbi: [config.contract.abi, Validators.required],
      ethersAddr: [config.contract.address, Validators.required],
      clearDB: [false],
      fromDate: [],
      toDate: []
    });

    const self = this;
    self._dbService = DatabaseFactory.createDbInstance(self.dbConstructor);
    self._dbService.executeQuery({
      query: "MATCH (n)-[r]->(m) RETURN min(r.date) as minBlk, max(r.date) as maxBlk"
    }).then((result) => {
      const minBlk = new Date(result[0].get('minBlk'));
      const maxBlk = new Date(result[0].get('maxBlk'));

      self.filterStoryDateRange = {
        floor: minBlk.getTime(),
        ceil: maxBlk.getTime(),
        translate: (value, label) => {
          return new Date(value).toLocaleDateString()
        }
      }
    })

    this._visualiser = new NeoVis(this.dbConstructor, "viz", config.datavis.neovis);
  }

  get getFormControls() { return this.setupForm.controls; }

  /* Argos */
  initArgos() {

    // Attributes from form
    const ctrl = this.setupForm.controls;
    const abi = ctrl.ethersAbi.value;
    const addr = ctrl.ethersAddr.value;
    const clearDB = ctrl.clearDB.value;
    let fromDate = ctrl.fromDate.value;
    let toDate = ctrl.toDate.value;

    fromDate = fromDate ? new Date(fromDate.year + "-" + fromDate.month + "-" + fromDate.day).getTime() / 1000 : undefined;
    toDate = toDate ? new Date(toDate.year + "-" + toDate.month + "-" + toDate.day).getTime() / 1000 : undefined;

    this._contractService = WatcherFactory.createWatcherInstance({
      type: WatcherEnum.EthereumWatcher,
      provider: ProviderEnum.InfuraProvider,
      clearDB: clearDB,
      address: addr,
      abi: abi,
      db: this.dbConstructor,
      providerConf: config.providers,
      exportDir: config.contract.export
    });

    this._contractService.watchEvents("Transfer", fromDate, toDate);
  }

  drawCommunity() {
    this._visualiser.detectCommunity(this.communityDetectionAlgorithm, { label: 'Account', relationship: 'TRANSFER', writeProperty: "community" });
  }

  drawCentrality() {
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

  execFilterAddress(event: any) {
    this._visualiser.filterNodesByAddress(this.filterAddress, this.filterAddressOut, this.filterAddressIn);
  }

  execFilterQuery(event: any) {
    this._visualiser.displayWithCypher({ query: this.filterQuery }, 0)
  }

  execFilterStory(event: any) {
    this._visualiser.filterCommunityByDateRange(this.filterFromDate, this.filterToDate, this.filterStoryCommunity);
  }

}
