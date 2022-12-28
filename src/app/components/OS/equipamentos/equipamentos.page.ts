import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { Equipamento } from 'src/app/shared/equipamento';
import { ModalAdicionaComponent } from './modal-adiciona/modal-adiciona.component';
import { ModalEditComponent } from './modal-edit/modal-edit.component';

@Component({
  selector: 'app-equipamentos',
  templateUrl: './equipamentos.page.html',
  styleUrls: ['./equipamentos.page.scss'],
})
export class EquipamentosPage implements OnInit, OnDestroy {

  id_cliente: number;
  equipamentos$: Observable<Equipamento[]> = null;
  dadosEquipamentos: Equipamento[] = null;

  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private crud: CrudService,
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id_cliente = +params.get('id');
    });
  }

  ionViewWillEnter() {
    this.listaEquipamentos();
  }

  listaEquipamentos() {
    this.exibeLoader().then(() => {
      if(this.id_cliente){
        this.equipamentos$ = this.crud.obtemInformacaoEspecifica('/equipamentos/listaEquipamentosCliente.php', this.id_cliente);
  
        this.subscription = this.equipamentos$.subscribe((res) => {
          if(res) {
            this.dadosEquipamentos = res;
            this.loadingController.dismiss();
          } else {
            this.exibeToast('danger', 'Não foi possível exibir os equipamentos do cliente');
            this.loadingController.dismiss();
          }
        })
      }
    })
  }

  public exibeAlertDeleta(event) {

    const target = event.target || event.currentTarget || event.srcElement;
    const id = target.attributes.id.value;

    this.exibeAlert('Você deseja realmente deletar esse equipamento?').then((res) => {
      if (res) {
        this.deleta(+id);
      } else {
        return;
      }
    }).catch((err) => {
      console.error(err);
    })

  }

  public deleta(id: number) {

    this.crud.deletaInformacao('/equipamentos/deletaEquipamento.php', id).subscribe((res) => {

      if (res) {
        this.listaEquipamentos();
        this.exibeToast('success', 'Funcionario deletado com sucesso');
        console.log(res);
      } else {
        this.exibeToast('danger', 'Não foi possível deletar o funcionário');
      }
    }, err => {
      console.error(err);
      this.exibeToast('danger', err);
    })
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

   // MODAL ADICIONA EQUIPAMENTO
   async exibeModalCadastro(event) {

    const target = event.target || event.srcElement || event.currentTarget;
    const idCliente = target.attributes.id.value;

    const modal = await this.modalController.create({
      component: ModalAdicionaComponent,
      componentProps: { idClienteSelecionado: idCliente},
      backdropDismiss: false
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.listaEquipamentos();
    }
  }

  // MODAL EDIT
  async exibeModalEdit(event) {

    const target = event.target || event.currentTarget || event.srcElement;
    const id = target.attributes.id.value;

    const equipamentoSelecionado = this.dadosEquipamentos.find((equipamento) => {
      return equipamento.id === id;
    });

    equipamentoSelecionado['id_cliente'] = +this.id_cliente;

    const modal = await this.modalController.create({
      component: ModalEditComponent,
      componentProps: { equipamento: equipamentoSelecionado },
      backdropDismiss: false
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.listaEquipamentos();
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
    this.subscription.unsubscribe();
  }

}
