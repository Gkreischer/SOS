import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdemFinalizadaPageRoutingModule } from './ordem-finalizada-routing.module';

import { OrdemFinalizadaPage } from './ordem-finalizada.page';
import { ModalInfoComponent } from './modal-info/modal-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdemFinalizadaPageRoutingModule
  ],
  declarations: [OrdemFinalizadaPage, ModalInfoComponent]
})
export class OrdemFinalizadaPageModule {}
