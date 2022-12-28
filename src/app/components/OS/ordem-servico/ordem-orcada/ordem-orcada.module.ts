import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdemOrcadaPageRoutingModule } from './ordem-orcada-routing.module';

import { OrdemOrcadaPage } from './ordem-orcada.page';
import { ModalEditComponent } from './modal-edit/modal-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdemOrcadaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [OrdemOrcadaPage, ModalEditComponent]
})
export class OrdemOrcadaPageModule {}
