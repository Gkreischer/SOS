import { Component, OnDestroy } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { LoadingService } from 'src/app/services/loading.service';
import { OrdemServico } from 'src/app/shared/ordemServico';
import { environment } from 'src/environments/environment';
import { ModalInfoComponent } from './modal-info/modal-info.component';

@Component({
  selector: 'app-ordem-finalizada',
  templateUrl: './ordem-finalizada.page.html',
  styleUrls: ['./ordem-finalizada.page.scss'],
})
export class OrdemFinalizadaPage implements OnDestroy {

  ordemServico$: Observable<OrdemServico[]> = null;
  dadosOrdemServico: OrdemServico[] = null;

  subscriptionOrdensServico: Subscription;

  constructor(
    private toastController: ToastController,
    private crud: CrudService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private loadingService: LoadingService
  ) { }

  ionViewWillEnter() {
    this.loadingService.present().then(() => {
      this.listaOrdemServicoFinalizada();
    }).finally(() => {
      this.loadingService.dismiss();
    })
  }

  listaOrdemServicoFinalizada() {
    this.ordemServico$ = this.crud.obtemInformacao('/ordemServico/listaOrdemServicoFinalizada.php');

    this.subscriptionOrdensServico = this.ordemServico$.subscribe((data) => {
      if (data) {
        this.dadosOrdemServico = data;
        console.log('ORDENS: ', this.dadosOrdemServico);
        
      } else {
        this.exibeToast('danger', 'Não foi possível exibir as ordens de serviço');
      }
    }, err => {
      this.exibeToast('danger', err);
    })
  }

  print(event): void {

    const target = event.target || event.srcElement || event.currentTarget;
    const id = target.attributes.id.value;

    const token = sessionStorage.getItem('token');
    const id_cliente = sessionStorage.getItem('id');

    window.open(`${environment.baseUrl}/impressao/comprovante_entrega_os.php?id=${id}&id_cliente=${id_cliente}&token=${token}`);
  }

  // MODAL EDIT
  async exibeModalInfo(event) {

    const target = event.target || event.currentTarget || event.srcElement;
    const id = target.attributes.id.value;

    let ordemServicoSelecionada = this.dadosOrdemServico.find((ordemServico) => {
      return ordemServico.id === id;
    });

    const modal = await this.modalController.create({
      component: ModalInfoComponent,
      componentProps: { ordemServico: ordemServicoSelecionada },
      backdropDismiss: false
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();

    if (role === 'cancel') {
      this.listaOrdemServicoFinalizada();
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
    this.subscriptionOrdensServico.unsubscribe();
  }

}
