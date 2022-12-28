import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdemServicoPage } from './ordem-servico.page';

const routes: Routes = [
  {
    path: '',
    component: OrdemServicoPage,
    children: [
      {
        path: 'ordensAbertas',
        children: [
          {
            path: '',
            loadChildren: () => import('../../OS/ordem-servico/ordem-aberta/ordem-aberta.module').then(m => m.OrdemAbertaPageModule)
          }
        ]
      },
      {
        path: 'ordensOrcadas',
        children: [
          {
            path: '',
            loadChildren: () => import('../../OS/ordem-servico/ordem-orcada/ordem-orcada.module').then(m => m.OrdemOrcadaPageModule)
          }
        ]
      },
      {
        path: 'pesquisa',
        children: [
          {
            path: '',
            loadChildren: () => import('../../OS/ordem-servico/pesquisa/pesquisa.module').then(m => m.PesquisaPageModule)
          }
        ]
      },
      {
        path: 'ordensFinalizadas',
        children: [
          {
            path: '',
            loadChildren: () => import('../../OS/ordem-servico/ordem-finalizada/ordem-finalizada.module').then( m => m.OrdemFinalizadaPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/menu/ordemServico/ordensAbertas',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'cadastro',
    loadChildren: () => import('../../OS/ordem-servico/cadastro/cadastro.module').then(m => m.CadastroPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdemServicoPageRoutingModule { }
