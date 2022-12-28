import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdemFinalizadaPage } from './ordem-finalizada.page';

const routes: Routes = [
  {
    path: '',
    component: OrdemFinalizadaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdemFinalizadaPageRoutingModule {}
