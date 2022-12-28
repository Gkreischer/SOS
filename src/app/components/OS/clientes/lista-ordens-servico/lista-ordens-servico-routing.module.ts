import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaOrdensServicoPage } from './lista-ordens-servico.page';

const routes: Routes = [
  {
    path: '',
    component: ListaOrdensServicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaOrdensServicoPageRoutingModule {}
