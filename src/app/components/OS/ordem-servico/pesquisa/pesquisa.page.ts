import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { OrdemServico } from 'src/app/shared/ordemServico';
import { ModalInfoComponent } from './modal-info/modal-info.component';

@Component({
  selector: 'app-pesquisa',
  templateUrl: './pesquisa.page.html',
  styleUrls: ['./pesquisa.page.scss'],
})
export class PesquisaPage implements OnInit, OnDestroy {

  idOrdemServico: number;

  ordemServico$: Observable<OrdemServico[]> = null;
  dadosOrdemServico: OrdemServico[] = null;

  dadosOrdemServicoFiltrado: OrdemServico[] = null;

  subscriptionOrdemServico: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private crud: CrudService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((res) => {
      this.idOrdemServico = +res['id'];
    })
  }

  ionViewWillEnter() {
    this.listaOrdemServico();
  }

  async listaOrdemServico() {
    
    this.exibeLoader().then(() => {
      this.ordemServico$ = this.crud.obtemInformacao('/ordemServico/listaOrdemServico.php');

      this.subscriptionOrdemServico = this.ordemServico$.subscribe((ordens) => {
        if(ordens){
          this.dadosOrdemServico = ordens;
          console.log(this.dadosOrdemServico);
          this.loadingController.dismiss();
        } else {
          this.exibeToast('danger', 'Não foi possível exibir as ordens de serviços');
          this.loadingController.dismiss();
        }
      }, err => {
        this.exibeToast('danger', err);
        this.loadingController.dismiss();
      })
    });
    
  }

  async pesquisaOrdemServico(event) {
    const valor_inserido = event.target.value;
    if (valor_inserido.length !== 0) {
      this.dadosOrdemServicoFiltrado = this.dadosOrdemServico.filter((ordemServico) => {
        return (
          ordemServico.id.toString().includes(valor_inserido.toLowerCase()) ||
          ordemServico.nome.toLowerCase().includes(valor_inserido.toLowerCase())
        );
      });
    } else {
      this.dadosOrdemServicoFiltrado = null;
    }
  }

  // MODAL INFO
  async exibeModalInfo(event) {

    const target = event.target || event.currentTarget || event.srcElement;
    const id = target.attributes.id.value;

    const ordemServicoSelecionada = this.dadosOrdemServico.find((ordemServico) => {
      return ordemServico.id === id;
    })

    const modal = await this.modalController.create({
      component: ModalInfoComponent,
      componentProps: { ordemServico: ordemServicoSelecionada },
      backdropDismiss: false
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();

    if (role === 'confirm' || role === 'cancel') {
      this.listaOrdemServico();
    }
  }


  // LOADER
  async exibeLoader() {
    const loader = await this.loadingController.create({
      message: 'Carregando...',
      translucent: true
    });
    await loader.present();
  }

  // TOAST
  async exibeToast(color: string, message: string) {

    const toast = await this.toastController.create({
      color: color,
      message: message,
      duration: 15000,
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
    this.subscriptionOrdemServico.unsubscribe();
  }

}
