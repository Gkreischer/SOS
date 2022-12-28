import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'not-found',
    loadChildren: () => import('./components/not-found/not-found.module').then(m => m.NotFoundPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./components/OS/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./components/OS/menu/menu.module').then(m => m.MenuPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: '**',
    loadChildren: () => import('./components/not-found/not-found.module').then(m => m.NotFoundPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    ReactiveFormsModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
