import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CrudService } from './services/crud.service';
import { Configuracao } from './shared/configuracao';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  public appPages = [
    //{ title: 'Login', url: '/login', icon: 'log-in' },
    { title: 'Ordem de Serviço', url: '/menu/ordemServico', icon: 'clipboard' },
    { title: 'Clientes', url: '/menu/clientes', icon: 'people' },
    { title: 'Materiais', url: '/menu/materiais', icon: 'hardware-chip' },
    { title: 'Funcionários', url: '/menu/funcionarios', icon: 'man' },
    { title: 'Configuração', url: '/menu/configuracao', icon: 'build' }
  ];

  dadosLoja: Configuracao = null;
  subscriptionDadosLoja: Subscription;

  constructor(
    private toastController: ToastController,
    private crud: CrudService
  ) { }

  ngOnInit(): void {
    this.listaDadosLoja();
    
  }
  
  listaDadosLoja() {
    this.subscriptionDadosLoja = this.crud.obtemInformacao('/configuracao/listaConfiguracao.php').subscribe((res) => {
      if (res) {
        this.dadosLoja = res[0];
      } else {
        this.exibeToast('danger', 'Não foi possível carregar os dados da configuração');
      }
    }, err => {
      this.exibeToast('danger', err);
    })
  }
  // TOAST
  async exibeToast(color: string, message: string) {

    const toast = await this.toastController.create({
      color: color,
      message: message,
      duration: 30000,
      buttons: [
        {
          icon: 'close',
          handler: () => {
            console.log('Toast fechado');
          }
        }
      ]
    });
    await toast.present();
  }

  ngOnDestroy(): void {
    this.subscriptionDadosLoja.unsubscribe();
  }

}