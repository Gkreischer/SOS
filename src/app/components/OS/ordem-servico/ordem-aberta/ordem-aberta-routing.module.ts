import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdemAbertaPage } from './ordem-aberta.page';

const routes: Routes = [
  {
    path: '',
    component: OrdemAbertaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdemAbertaPageRoutingModule {}
