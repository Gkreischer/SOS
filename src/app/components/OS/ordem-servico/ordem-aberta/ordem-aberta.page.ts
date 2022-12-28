import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { LoadingService } from 'src/app/services/loading.service';
import { OrdemServico } from 'src/app/shared/ordemServico';
import { environment } from 'src/environments/environment';
import { ModalEditComponent } from './modal-edit/modal-edit.component';


@Component({
  selector: 'app-ordem-aberta',
  templateUrl: './ordem-aberta.page.html',
  styleUrls: ['./ordem-aberta.page.scss'],
})
export class OrdemAbertaPage implements OnDestroy {

  ordemServico$: Observable<OrdemServico[]> = null;
  dadosOrdemServico: OrdemServico[] = [];
  subscription: Subscription;

  constructor(
    private crud: CrudService,
    private modalController: ModalController,
    private toastController: ToastController,
    private loadingService: LoadingService
  ) { }

  ionViewWillEnter() {
    this.loadingService.present().then(() => {
      this.listaOrdemServicoAberta();
    })
    .finally(() => {
      this.loadingService.dismiss();
    })
  }

  listaOrdemServicoAberta() {
    this.ordemServico$ = this.crud.obtemInformacao('/ordemServico/listaOrdemServicoAberta.php');

      this.subscription = this.ordemServico$.subscribe((data) => {
        if (data) {
          this.dadosOrdemServico = data;
        } else {
          this.exibeToast('danger', 'Não foi possível exibir as ordens de serviço aberta');
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

    window.open(`${environment.baseUrl}/impressao/comprovante_entrada_os.php?id=${id}&id_cliente=${id_cliente}&token=${token}`);
  }

  // MODAL EDIT
  async exibeModalEdit(event) {

    const target = event.target || event.currentTarget || event.srcElement;
    const id = target.attributes.id.value;

    const ordemServicoSelecionada = this.dadosOrdemServico.find((ordemServico) => {
      return ordemServico.id === id;
    })

    const modal = await this.modalController.create({
      component: ModalEditComponent,
      componentProps: { ordemServico: ordemServicoSelecionada },
      backdropDismiss: false
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();

    if (role === 'confirm' || role === 'cancel') {
      this.listaOrdemServicoAberta();
    }
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
    this.subscription.unsubscribe();
  }
}
