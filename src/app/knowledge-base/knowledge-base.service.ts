import { Observable } from 'rxjs/Observable';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';



@Injectable()
export class KnowledgeBaseService {
  headers = new Headers();
  referencias = [];

 

  constructor(private http: Http) { 
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    
    this.getReferencias().subscribe(data=>{//pegar as referencias no banco de dados e deixa guardado pra consulta
      this.referencias = data.referencias;
    })
  }

  getCandidatesKnowledgeBase(symptom){//pegar as candidatas a resposta no banco de dados
    var URL = "http://localhost/SEManutencao/getbypremissas.php";
    return this.http.post(URL, "sinal="+symptom, {
      headers: this.headers
    }).map(res => { 
      if (res.json() != undefined) {
        return res.json()
      }
    });
  }
  getReferencias(){//pegar a tabela de referencia entre simbolo e significado
    var URL = "http://localhost/SEManutencao/getreferencias.php";
    return this.http.post(URL, "", {
      headers: this.headers
    }).map(res => { 
      if (res.json() != undefined) {
        return res.json()
      }
    });
  }

  getSentecabySinal(sinal){//retorna o significado do sinal referente a tabela de referencias
    var result = "Não encontrado";
   this.referencias.forEach(element => {
     if(element.Expressao == sinal){
       result =  element.Significado;
     }
   });
   if(result == "Não encontrado"){
     console.info("Não encontrado "+ sinal);
   }
   return result;
  }
  askVariableHowConclusion(value) {//Verifica se valor está entre a conclusão da expressão e retorna as que sim
    var URL = "http://localhost/SEManutencao/getbyconclutions.php";
    return this.http.post(URL, "sinal="+value, {
      headers: this.headers
    }).map(res => { 
      if (res.json() != undefined) {
        return res.json()
      }
    });
    
  }
  getPremissas(){
   return this.referencias;
  }


}
