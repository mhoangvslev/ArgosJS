import { Component, OnInit } from '@angular/core';
import { NeoVis, DatabaseEnum, CentralityAlgorithmEnum, CommunityDetectionAlgoritmEnum } from "argosjs";
import { FormGroup, FormBuilder } from '@angular/forms';

const config = require("../../../argos-config.js");

@Component({
  selector: 'app-visualiser',
  templateUrl: './visualiser.component.html',
  styleUrls: ['./visualiser.component.css']
})

export class VisualiserComponent implements OnInit {

  setupForm: FormGroup;
  _visualiser: NeoVis;

  centralityAlgorithm: CentralityAlgorithmEnum;
  ca_algorithms: CentralityAlgorithmEnum[];

  communityDetectionAlgorithm: CommunityDetectionAlgoritmEnum;
  cda_algorithms: CommunityDetectionAlgoritmEnum[]

  constructor(private formBuildier: FormBuilder) {
    this.cda_algorithms = [
      undefined,
      CommunityDetectionAlgoritmEnum.Louvain,
      CommunityDetectionAlgoritmEnum.LabelPropagation,
      CommunityDetectionAlgoritmEnum.ConnectedComponents,
      CommunityDetectionAlgoritmEnum.StronglyConnectedComponents,
      CommunityDetectionAlgoritmEnum.ClusteringCoefficient,
      CommunityDetectionAlgoritmEnum.BalancedTriads
    ];

    this.ca_algorithms = [
      undefined,
      CentralityAlgorithmEnum.PageRank,
      CentralityAlgorithmEnum.ArticleRank,
      CentralityAlgorithmEnum.BetweenessCentrality,
      CentralityAlgorithmEnum.ClosenessCentrality,
      CentralityAlgorithmEnum.HarmonicCentrality,
      CentralityAlgorithmEnum.EigenvectorCentrality,
      CentralityAlgorithmEnum.DegreeCentrality,
    ]
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
          "size": "size",
          "community": "community"
        }
      },
      {
        "TRANSFER": {
          "thickness": "weight",
          "caption": false
        }
      }
    )
  }

  draw() {
    this._visualiser.clear();
    this._visualiser.centrality(this.centralityAlgorithm, { label: 'Account', relationship: 'TRANSFER', writeProperty: 'size' });
    this._visualiser.detectCommunity(this.communityDetectionAlgorithm, { label: 'Account', relationship: 'TRANSFER' });
    this._visualiser.refresh();
  }

}
