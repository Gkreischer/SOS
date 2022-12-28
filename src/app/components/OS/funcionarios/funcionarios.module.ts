import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FuncionariosPageRoutingModule } from './funcionarios-routing.module';

import { FuncionariosPage } from './funcionarios.page';
import { ModalEditComponent } from './modal-edit/modal-edit.component';
import { ModalAdicionaComponent } from './modal-adiciona/modal-adiciona.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FuncionariosPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [FuncionariosPage, ModalEditComponent, ModalAdicionaComponent]
})
export class FuncionariosPageModule {}
