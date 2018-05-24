import { KnowledgeBaseService } from './knowledge-base/knowledge-base.service';
import { InferenceMachineService } from './inference-machine/inference-machine.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';

import { InterfaceUserComponent } from './interface-user/interface-user.component';
import { HttpModule } from '@angular/http';


@NgModule({
  declarations: [
    AppComponent,
    InterfaceUserComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [InferenceMachineService,KnowledgeBaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
