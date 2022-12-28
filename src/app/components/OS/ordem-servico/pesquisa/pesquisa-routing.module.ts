import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModalInfoComponent } from './modal-info/modal-info.component';

import { PesquisaPage } from './pesquisa.page';

const routes: Routes = [
  {
    path: '',
    component: PesquisaPage
  },
  {
    path: 'info/:id',
    component: ModalInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PesquisaPageRoutingModule {}
