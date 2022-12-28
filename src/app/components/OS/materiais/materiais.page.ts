import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Material } from 'src/app/shared/material';
import { ModalAdicionaComponent } from './modal-adiciona/modal-adiciona.component';
import { ModalEditComponent } from './modal-edit/modal-edit.component';
import { ModalInfoComponent } from './modal-info/modal-info.component';

@Component({
  selector: 'app-materiais',
  templateUrl: './materiais.page.html',
  styleUrls: ['./materiais.page.scss'],
})
export class MateriaisPage implements OnInit, OnDestroy {

  formCadastroMaterial: FormGroup;
  materiais$: Observable<Material[]>;
  dadosMateriais: Material[] = [];
  dadosMateriaisFiltrado: Material[] = null;
  subscription: Subscription;

  constructor(private loadingService: LoadingService,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController,
    private crud: CrudService) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.loadingService.present().then(() => {
      this.listaMateriais();
    })
    .finally(() => {
      this.loadingService.dismiss();
    })
  }

  listaMateriais() {
    this.materiais$ = this.crud.obtemInformacao('/materiais/listaMaterial.php');

    this.subscription = this.materiais$.subscribe((data) => {
      if (data) {
        this.dadosMateriais = data;
        // TO PRESERVE DEFAULT ARRAY IN USE OF SEARCH INPUT
        this.dadosMateriaisFiltrado = this.dadosMateriais;
      }
    }, err => {
      this.exibeToast('danger', err);
    })

  }

  pesquisaMaterial(event) {
    const materialPesquisado = event.target.value;
    if (materialPesquisado.length !== 0) {
      this.dadosMateriaisFiltrado = this.dadosMateriais.filter((material) => {
        return (
          material.nome.toLowerCase().includes(materialPesquisado.toLowerCase())
        );
      })
    } else {
      this.dadosMateriaisFiltrado = [...this.dadosMateriais];
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

  // MODAL INFO
  async exibeModalInfo(event) {

    const target = event.target || event.currentTarget || event.srcElement;
    const id = target.attributes.id.value;

    let materialSelecionado = this.dadosMateriais.find((material) => {
      return material.id === id;
    });

    const modal = await this.modalController.create({
      component: ModalInfoComponent,
      componentProps: { material: materialSelecionado },
      backdropDismiss: false
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();


  }

  // MODAL EDIT
  async exibeModalEdit(event) {

    const target = event.target || event.currentTarget || event.srcElement;
    const id = target.attributes.id.value;

    let materialSelecionado = this.dadosMateriais.find((material) => {
      return material.id === id;
    });

    const modal = await this.modalController.create({
      component: ModalEditComponent,
      componentProps: { material: materialSelecionado },
      backdropDismiss: false
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();

    if (role === 'cancel' || role === 'confirm') {
      this.listaMateriais();
    }
  }

  // MODAL ADICIONA MATERIAL
  async exibeModalCadastro() {

    const modal = await this.modalController.create({
      component: ModalAdicionaComponent,
      backdropDismiss: false
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();

    if (role === 'cancel' || role === 'confirm') {
      this.listaMateriais();
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
