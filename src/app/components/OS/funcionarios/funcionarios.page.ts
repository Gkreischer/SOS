import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { Funcionario } from 'src/app/shared/funcionario';
import { ModalAdicionaComponent } from './modal-adiciona/modal-adiciona.component';
import { ModalEditComponent } from './modal-edit/modal-edit.component';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.page.html',
  styleUrls: ['./funcionarios.page.scss'],
})
export class FuncionariosPage implements OnInit, OnDestroy {

  funcionarios$: Observable<Funcionario[]>;
  formCadastroFuncionario: FormGroup;
  funcionario: Funcionario;
  dadosFuncionarios: Funcionario[] = [];

  private subscription: Subscription;

  @ViewChild(IonModal) modal: IonModal;

  constructor(
    private crud: CrudService,
    public loadingController: LoadingController,
    public fb: FormBuilder,
    public toast: ToastController,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.listaFuncionarios();
  }

  listaFuncionarios() {

    // EXIBE OS FUNCIONARIOS, ATRIBUI AO OBSERVABLE, AO SUBSCRIPTION(PARA PODER MANIPULAR AS INFORMAÇÕES)
    // E CONTROLA A EXIBIÇAO DO LOADER E DO TOAST
    this.exibeLoader().then(() => {
      this.funcionarios$ = this.crud.obtemInformacao('/funcionarios/listaFuncionario.php');

      this.subscription = this.funcionarios$.subscribe((data) => {
        if (data) {
          this.dadosFuncionarios = data;
          this.loadingController.dismiss();

        }
      }, err => {
        this.exibeToast('danger', err);
        this.loadingController.dismiss();
      })
    })
  }

  // MODAL ADICIONA FUNCIONARIO
  async exibeModalCadastro() {

    const modal = await this.modalController.create({
      component: ModalAdicionaComponent,
      backdropDismiss: false
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.listaFuncionarios();
    }
  }

  // MODAL EDIT
  async exibeModalEdit(event) {

    const target = event.target || event.currentTarget || event.srcElement;
    const id = target.attributes.id.value;

    const funcionario = this.dadosFuncionarios.find((funcionario) => {
      return funcionario.id === id;
    })

    const modal = await this.modalController.create({
      component: ModalEditComponent,
      componentProps: { funcionario: funcionario },
      backdropDismiss: false
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.listaFuncionarios();
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
