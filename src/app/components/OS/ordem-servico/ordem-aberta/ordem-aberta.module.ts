import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdemAbertaPageRoutingModule } from './ordem-aberta-routing.module';

import { OrdemAbertaPage } from './ordem-aberta.page';
import { ModalEditComponent } from './modal-edit/modal-edit.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdemAbertaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [OrdemAbertaPage, ModalEditComponent]
})
export class OrdemAbertaPageModule {}
