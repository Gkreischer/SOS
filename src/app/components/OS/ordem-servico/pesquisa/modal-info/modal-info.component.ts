import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { Material } from 'src/app/shared/material';
import { OrdemServico } from 'src/app/shared/ordemServico';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss'],
})
export class ModalInfoComponent implements OnInit, OnDestroy {

  @Input('ordemServico') ordemServico: OrdemServico = null;

  id_ordemServico: number = null;
  subscriptionOrdemServico: Subscription;

  dadosOrdemServico: OrdemServico = null;

  materiais$: Observable<Material[]> = null;
  dadosMateriais: Material[] = null;

  subscriptionMateriais: Subscription = null;

  constructor(
    private crud: CrudService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.id_ordemServico = this.ordemServico.id;
    console.log(this.id_ordemServico);

  }

  ionViewWillEnter() {
    this.buscaOrdem();
  }

  buscaOrdem() {
    this.exibeLoader().then(() => {
      this.subscriptionOrdemServico = this.crud.obtemInformacaoEspecifica('/ordemServico/buscaOrdemEspecifica.php', this.id_ordemServico).subscribe((ordemServico) => {
        if (ordemServico) {
          this.dadosOrdemServico = ordemServico[0];
          console.log(this.dadosOrdemServico);
          this.loadingController.dismiss();

          this.buscaMaterial();
        } else {
          this.exibeToast('danger', 'Não foi possível exibir a ordem de serviço');
          this.loadingController.dismiss();
        }
      }, err => {
        this.exibeToast('danger', err);
        this.loadingController.dismiss();
      })
    })
  }

  async buscaMaterial() {
    this.exibeLoader().then(() => {

      this.materiais$ = this.crud.obtemInformacaoEspecifica('/materialOs/buscaMaterial.php', this.id_ordemServico);

      this.subscriptionMateriais = this.materiais$.subscribe((materiais) => {
        if (materiais.length > 0) {
          this.dadosMateriais = materiais;
          console.log(this.dadosMateriais);
          this.loadingController.dismiss();
        } else {
          this.loadingController.dismiss();
          this.exibeToast('warning', 'Sem materiais cadastrados nesse orçamento');
        }
      }, err => {
        this.exibeToast('danger', err);
        this.loadingController.dismiss();
      })
    });
  }

  fechaModal() {
    this.modalController.dismiss(null, 'cancel');
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
    this.subscriptionOrdemServico.unsubscribe();
  }

}
