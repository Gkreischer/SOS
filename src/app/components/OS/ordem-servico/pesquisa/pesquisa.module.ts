import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PesquisaPageRoutingModule } from './pesquisa-routing.module';

import { PesquisaPage } from './pesquisa.page';
import { ModalInfoComponent } from './modal-info/modal-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PesquisaPageRoutingModule
  ],
  declarations: [PesquisaPage, ModalInfoComponent]
})
export class PesquisaPageModule {}
