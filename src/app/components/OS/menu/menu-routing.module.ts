import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
  },
  {
    path: 'clientes',
    loadChildren: () => import('./../clientes/clientes.module').then( m => m.ClientesPageModule)
  },
  {
    path: 'equipamentos',
    loadChildren: () => import('./../equipamentos/equipamentos.module').then( m => m.EquipamentosPageModule),
    children: [
      {
        path: ':id',
        loadChildren: () => import('./../equipamentos/equipamentos.module').then( m => m.EquipamentosPageModule),
      }
    ]
  },
  {
    path: 'funcionarios',
    loadChildren: () => import('./../funcionarios/funcionarios.module').then( m => m.FuncionariosPageModule)
  },
  {
    path: 'materiais',
    loadChildren: () => import('./../materiais/materiais.module').then( m => m.MateriaisPageModule)
  },
  {
    path: 'configuracao',
    loadChildren: () => import('./../configuracao/configuracao.module').then( m => m.ConfiguracaoPageModule)
  },
  {
    path: 'ordemServico',
    loadChildren: () => import('./../ordem-servico/ordem-servico.module').then( m => m.OrdemServicoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
