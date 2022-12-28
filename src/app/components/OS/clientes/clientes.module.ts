import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientesPageRoutingModule } from './clientes-routing.module';

import { ClientesPage } from './clientes.page';
import { ModalAdicionaComponent } from './modal-adiciona/modal-adiciona.component';
import { ModalInfoComponent } from './modal-info/modal-info.component';
import { ModalEditComponent } from './modal-edit/modal-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ClientesPage, ModalAdicionaComponent, ModalInfoComponent, ModalEditComponent]
})
export class ClientesPageModule {}
