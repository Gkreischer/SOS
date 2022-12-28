import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MateriaisPage } from './materiais.page';

const routes: Routes = [
  {
    path: '',
    component: MateriaisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MateriaisPageRoutingModule {}
