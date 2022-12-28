import { Component } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { LoadingService } from 'src/app/services/loading.service';
import { OrdemServico } from 'src/app/shared/ordemServico';
import { environment } from 'src/environments/environment';
import { ModalEditComponent } from './modal-edit/modal-edit.component';

@Component({
  selector: 'app-ordem-orcada',
  templateUrl: './ordem-orcada.page.html',
  styleUrls: ['./ordem-orcada.page.scss'],
})
export class OrdemOrcadaPage {

  ordemServico$: Observable<OrdemServico[]> = null;
  dadosOrdemServico: OrdemServico[] = [];
  subscription: Subscription;

  constructor(
    private crud: CrudService,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController,
    private loadingService: LoadingService
  ) { }

  ionViewWillEnter() {
    this.loadingService.present().then(() => {
      this.listaOrdemServicoOrcada();
    })
    .finally(() => {
      this.loadingService.dismiss();
    })
  }

  listaOrdemServicoOrcada() {
    this.ordemServico$ = this.crud.obtemInformacao('/ordemServico/listaOrdemServicoOrcada.php');

    this.subscription = this.ordemServico$.subscribe((data) => {
      if (data) {
        this.dadosOrdemServico = data;
        console.log(this.dadosOrdemServico);
      } else {
        this.exibeToast('danger', 'Não foi possível exibir as ordens de serviços orçadas');
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

    window.open(`${environment.baseUrl}/impressao/orcamento_os.php?id=${id}&id_cliente=${id_cliente}&token=${token}`);
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

    if (role === 'confirm') {
      this.listaOrdemServicoOrcada();
    }
  }

  // ALERT
  async exibeAlert(mensagem: string) {

    const alert = await this.alertController.create({
      message: mensagem,
      buttons: [
        {
          text: 'Não',
          role: 'cancel'
        },
        {
          text: 'Sim',
          role: 'confirm'
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onWillDismiss();

    if (role === 'confirm') {
      return true;
    } else {
      return false;
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
