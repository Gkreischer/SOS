import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaOrdensServicoPageRoutingModule } from './lista-ordens-servico-routing.module';

import { ListaOrdensServicoPage } from './lista-ordens-servico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaOrdensServicoPageRoutingModule
  ],
  declarations: [ListaOrdensServicoPage]
})
export class ListaOrdensServicoPageModule {}
