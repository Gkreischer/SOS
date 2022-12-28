import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipamentosPageRoutingModule } from './equipamentos-routing.module';

import { EquipamentosPage } from './equipamentos.page';
import { ModalAdicionaComponent } from './modal-adiciona/modal-adiciona.component';
import { ModalEditComponent } from './modal-edit/modal-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EquipamentosPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EquipamentosPage, ModalAdicionaComponent, ModalEditComponent]
})
export class EquipamentosPageModule {}
