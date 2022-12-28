import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MateriaisPageRoutingModule } from './materiais-routing.module';

import { MateriaisPage } from './materiais.page';
import { ModalEditComponent } from './modal-edit/modal-edit.component';
import { ModalAdicionaComponent } from './modal-adiciona/modal-adiciona.component';
import { ModalInfoComponent } from './modal-info/modal-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MateriaisPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MateriaisPage, ModalEditComponent, ModalAdicionaComponent, ModalInfoComponent]
})
export class MateriaisPageModule {}
