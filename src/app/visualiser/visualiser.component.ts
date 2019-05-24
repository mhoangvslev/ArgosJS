import { Component, OnInit } from '@angular/core';
import { NeoVis, DatabaseEnum, CentralityAlgorithmEnum, CommunityDetectionAlgoritmEnum } from "argosjs";
import { FormGroup, FormBuilder } from '@angular/forms';
import { PathFindingAlgorithmEnum } from 'argosjs/types/visualiser/Visualiser';

const config = require("../../../argos-config.js");

@Component({
  selector: 'app-visualiser',
  templateUrl: './visualiser.component.html',
  styleUrls: ['./visualiser.component.css']
})

export class VisualiserComponent implements OnInit {

  setupForm: FormGroup;
  _visualiser: NeoVis;

  centralityAlgorithm: CentralityAlgorithmEnum = CentralityAlgorithmEnum.None;
  ca_algorithms: CentralityAlgorithmEnum[];

  communityDetectionAlgorithm: CommunityDetectionAlgoritmEnum = CommunityDetectionAlgoritmEnum.None;
  cda_algorithms: CommunityDetectionAlgoritmEnum[]

  pathAlgo: PathFindingAlgorithmEnum = PathFindingAlgorithmEnum.None;
  pathfinding_algorithms: PathFindingAlgorithmEnum[]

  queryLimit: number = 700;

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

  ngOnInit() {
    this.setupForm = this.formBuildier.group({

    });

    const dbConstructor = {
      type: DatabaseEnum.Neo4J,
      config: config.database.neo4j,
      model: require('../../models/Account.js')
    }

    this._visualiser = new NeoVis(dbConstructor, "viz",
      {
        "Account": {
          "size": config.datavis.neovis.node.sizeProp,
          "community": config.datavis.neovis.node.communityProp
        }
      },
      {
        "TRANSFER": {
          "thickness": config.datavis.neovis.relationship.thicknessProp,
          "caption": config.datavis.neovis.relationship.captionProp
        }
      }
    )
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
    this._visualiser.renderWithCypher({query: ""}, this.queryLimit);
  }

  resetViz(event: any) {
    this._visualiser.clear();
  }

}
