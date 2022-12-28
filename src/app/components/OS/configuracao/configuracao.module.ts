import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfiguracaoPageRoutingModule } from './configuracao-routing.module';

import { ConfiguracaoPage } from './configuracao.page';
import { CategoriaMaterialComponent } from './categoria-material/categoria-material.component';
import { CategoriaEquipamentoComponent } from './categoria-equipamento/categoria-equipamento.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfiguracaoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ConfiguracaoPage, CategoriaMaterialComponent, CategoriaEquipamentoComponent
  ]
})
export class ConfiguracaoPageModule {}
