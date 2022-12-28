import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdemOrcadaPage } from './ordem-orcada.page';

const routes: Routes = [
  {
    path: '',
    component: OrdemOrcadaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdemOrcadaPageRoutingModule {}
