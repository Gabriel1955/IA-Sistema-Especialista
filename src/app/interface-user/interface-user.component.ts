import { KnowledgeBaseService } from './../knowledge-base/knowledge-base.service';
import { InferenceMachineService } from './../inference-machine/inference-machine.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-interface-user',
  templateUrl: './interface-user.component.html',
  styleUrls: ['./interface-user.component.css']
})
export class InterfaceUserComponent implements OnInit {

  premissas = [];
  conclutions = [];
  constructor(private inferenceMachineService: InferenceMachineService,
    private knowledgeBaseService: KnowledgeBaseService) {

  }

  ngOnInit() {
    this.getPremissas();
    InferenceMachineService.emirtConclutions.subscribe(data => {
      this.conclutions = data;
    })
  }

  initMachine(sinal) {
    this.inferenceMachineService.initMachine(sinal);
  }
  getPremissas() {
    this.knowledgeBaseService.getReferencias().subscribe(data => {
      this.premissas = data.referencias;
    })
  }
}
