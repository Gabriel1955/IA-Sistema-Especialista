import { element } from 'protractor';
import { KnowledgeBaseService } from './../knowledge-base/knowledge-base.service';
import { Observable } from 'rxjs/Observable';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class InferenceMachineService {

  stack;
  factsBase = [];
  factsBaseGrau = [];
  candidates = [];
  precedencia = ["*", "+"];
  count = 0;
  static emirtConclutions = new EventEmitter<any>();

  constructor(private knowledgeBaseService: KnowledgeBaseService) {
    this.stack = [];
  }

  initMachine(symptom) {
    this.factsBase = [];
    this.factsBase[symptom] = true;
    this.factsBaseGrau[symptom] = 100;
    this.knowledgeBaseService.getCandidatesKnowledgeBase(symptom).subscribe(data => {
    //pegando as candidatas, expressões que tem na premissa o valor escolhido pelo usuario
      this.candidates = data.bypremissas;
      this.candidates.forEach(element => {//inicia a maquina logic em cima de cada valor da premissa
        //para saber seu valor logico
        this.logicMachine(element.Premissa, element.Conclusao, element.grau_certeza);
        //apos voltar da recursão da maquina logica seta os valores e manda para o usuario
        this.sendConclutions(this.candidates);
      });
    })

  }

  logicMachine(premissa, conclucao,grau_certeza) {
    premissa = premissa.split(" ");//convert premissa em um array
    premissa.forEach((element, key) => {//pegando cada valor da premissa
      if (this.isVariableLogic(element)) {//verifica se o valor é uma variavel
        var valueInFactsBase = this.factsBase[element];//buscar valores na base de fatos
        if (valueInFactsBase == null) {//se base de fatos não possui o valor
          var dataOfKnowledgeBase ;
          dataOfKnowledgeBase = this.httpPuro(element)//procura na base de conhecimento expressoes que 
          //tenha o valor desejado como conclusão, pra tentar descobrir seu valor logico
          if (dataOfKnowledgeBase != undefined && dataOfKnowledgeBase != null && dataOfKnowledgeBase.length >0) {
            dataOfKnowledgeBase.forEach(element2 => {//pra cada resulta chama logicMachine, função recursiva, 
              this.logicMachine(element2.premissa, element2.conclusao,element2.grau_certeza);
            });
          }
          var valueInFactsBase2 = this.factsBase[element];//apos procura na base de conhecimento verifica se valor foi atualizado na base de fatos
          if (valueInFactsBase2 == null) {//caso não seja possivel achar o valor na base de dados, perguntar ao usuario
            this.factsBase[element] = confirm(this.knowledgeBaseService.getSentecabySinal(element) + "? \n ok-> true \n cancelar -> false");
            this.factsBaseGrau[element]= 100;// toda resposta do usuario tem grau 100% de certeza
          }
          // })
        }
      }
    });
    //a partir daqui é quando todos  os valores da premissa ja foram encontrados
    //aqui é feito o calculo logico pra saber o valor da conclussão
    var i = 0;
    var grauCertezaPremissa = 0;
    while (premissa.length > 1 && i < 1000) {
      i++;
      premissa.forEach((element, key) => {
        if (this.isOperatorLogic(element)) {
          var value1 = premissa[key - 1];
          var value2 = premissa[key + 1];
          //console.info(value1 + " " + premissa[key] + " " + value2);
          if (!(typeof (value1) === "boolean")) {
            value1 = this.factsBase[premissa[key - 1]];
          }
          if (!(typeof (value2) === "boolean")) {
            value2 = this.factsBase[premissa[key + 1]];
          }
          //console.info(value1 + " " + premissa[key] + " " + value2);
          premissa[key - 1] = this.calcLogic(value1, value2, premissa[key]);
          this.calcGrau(value1,value2,premissa[key]);
          premissa.splice(key, 1);
          premissa.splice(key, 1);
        }
      });
    }
    if (!(typeof (premissa[0]) === "boolean")) {//caso a premissa saia como variavel, não boolean, pegar o valor da variavel na base de fatos
      premissa[0] = this.factsBase[premissa[0]];
    }
    this.factsBase[conclucao] = premissa[0];//atualiza a base de  fatos de acordo com resultado das operações da premissa
    
  }


  sendConclutions(candidates) {//envia conclusões verdadeiras para o usuario
    var conclutions = [];
    candidates.forEach(element => {
      conclutions.push({
        sinal: element.Conclusao,
        sentenca: this.knowledgeBaseService.getSentecabySinal(element.Conclusao),
        value: this.factsBase[element.Conclusao],
        grau_certeza:element.grau_certeza
      })
    });
    InferenceMachineService.emirtConclutions.emit(conclutions);
  }

  isVariableLogic(value) {
    return (value != "*" && value != "+");
  }
  isOperatorLogic(value) {
    return !this.isVariableLogic(value);
  }
  calcLogic(value1, value2, operator) {
    switch (operator) {
      case "*":
        return value1 && value2;
      case "+":
        return value1 || value2;
      default:
        break;
    }
  }
  httpPuro(sinal) {//função de requisição http sincrona, usada dentro da recurção pra não haver problemas com miss falsos
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://localhost/SEManutencao/getbyconclutions.php?sinal=" + sinal, false); // false for synchronous request
    xmlHttp.send(null);
    var text = xmlHttp.responseText;
    return JSON.parse(text);
  }
  calcGrau(value1,value2,operator){
    var grau1 = parseFloat(this.factsBaseGrau[value1])/100;
    var grau2 = parseFloat(this.factsBaseGrau[value2])/100;
    if(operator == "*"){
      return grau1*grau2*100;
    }
    else if(operator == "+"){
      return (grau1+grau2-grau1*grau2)*100;
    }
  }
}

