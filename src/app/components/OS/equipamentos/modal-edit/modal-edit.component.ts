import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { CategoriaEquipamento } from 'src/app/shared/categoria_equipamento';
import { Equipamento } from 'src/app/shared/equipamento';

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.scss'],
})
export class ModalEditComponent implements OnInit, OnDestroy {

  @Input('equipamento') equipamento: Equipamento = null;
  formEditEquipamento: FormGroup;
  dadosEquipamento: Equipamento = null;

  categorias$: Observable<CategoriaEquipamento[]> = null;
  dadosCategorias: CategoriaEquipamento[] = null;

  subscription: Subscription;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private fb: FormBuilder,
    private crud: CrudService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.montaForm();
    this.formEditEquipamento.patchValue(this.equipamento);
    this.listaCategorias();
    console.log(this.equipamento);
  }

  montaForm() {
    this.formEditEquipamento = this.fb.group({
      id_cliente: [null, [Validators.required]],
      nome: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      id_categoria: [null, [Validators.required]],
      numero_serie: null,
      descricao: null
    });
  }

  listaCategorias() {
    this.exibeLoader().then(() => {
      this.categorias$ = this.crud.obtemInformacao('/equipamentos/listaCategoria.php');

      this.subscription = this.categorias$.subscribe((res) => {
        if (res) {
          this.dadosCategorias = res;
          console.log(this.dadosCategorias);
          this.loadingController.dismiss();
        } else {
          this.exibeToast('danger', 'Não foi possível carregar as categorias');
          this.loadingController.dismiss();
        }
      }, err => {
        this.exibeToast('danger', err);
      })
    })
  }

  atualiza() {

    this.exibeLoader().then(() => {
      this.dadosEquipamento = this.formEditEquipamento.value;

      this.crud.atualizaInformacao('/equipamentos/atualizaEquipamento.php', { id: this.equipamento.id, equipamento: this.dadosEquipamento }).subscribe((res) => {
        if (res) {
          this.exibeToast('success', 'Equipamento atualizado com sucesso.');
          this.modalController.dismiss(null, 'confirm');
          this.loadingController.dismiss();
        } else {
          this.loadingController.dismiss();
          return this.exibeToast('error', 'Não foi possível atualizar os dados do equipamento');
        }
      }, err => {
        console.error(err);
        this.loadingController.dismiss();
        this.exibeToast('error', err);
      })
    });
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

  fechaModal() {
    this.modalController.dismiss(null, 'cancel');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
