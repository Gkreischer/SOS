import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { CategoriaMaterial } from 'src/app/shared/categoria_material';

@Component({
  selector: 'app-categoria-material',
  templateUrl: './categoria-material.component.html',
  styleUrls: ['./categoria-material.component.scss'],
})
export class CategoriaMaterialComponent implements OnInit, OnDestroy {

  formCategoriaMaterial: FormGroup;
  categoria: CategoriaMaterial = null;
  categorias$: Observable<CategoriaMaterial[]>;
  dadosCategoria: CategoriaMaterial[] = null;

  subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private crud: CrudService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.montaForm();
  }

  ionViewWillEnter() {
    this.listaCategorias();
  }

  montaForm() {
    this.formCategoriaMaterial = this.fb.group({
      categoria: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]]
    });
  }

  get formControls() {
    return this.formCategoriaMaterial.controls;
  }

  cadastra() {

    this.categoria = this.formCategoriaMaterial.value;

    this.exibeLoader().then(() => {
      this.crud.adicionaInformacao('/materiais/cadastraCategoria.php', this.categoria).subscribe((res) => {
        if (res) {
          this.exibeToast('success', 'Categoria cadastrada com sucesso.');
          this.listaCategorias()
          this.formCategoriaMaterial.reset();
          this.loadingController.dismiss();
        } else {
          this.exibeToast('danger', 'Não foi possível cadastrar a categoria');
          this.loadingController.dismiss();
        }
      }, err => {
        this.exibeToast('danger', err);
        this.loadingController.dismiss();
      })
    })
  }

  async exibeAlertEdit(event) {

    const target = event.target || event.currentTarget || event.srcElement;
    const idMaterial = target.attributes.id.value;

    const alert = await this.alertController.create({
      header: 'Insira o novo nome da categoria',
      id: idMaterial,
      inputs: [
        {
          name: 'nomeCategoria',
          placeholder: 'Nome da categoria'
        }
      ],
      buttons: 
      [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Atualizar',
          role: 'confirm',
          handler: (alertData) => {
            if(alertData.nomeCategoria.length != ''){
              this.atualiza(idMaterial, alertData.nomeCategoria);
            } else {
              window.alert('A categoria deve conter um nome válido');
              return;
            }
          }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onWillDismiss();

    if(role === 'confirm'){
      this.listaCategorias();
    }
  }

  atualiza(id: number, value: string) {
    this.crud.atualizaInformacao('/materiais/atualizaCategoria.php', {id, value}).subscribe((res) => {
      if (res) {
        this.exibeToast('success', 'Categoria atualizada com sucesso');
      } else {
        this.exibeToast('danger', 'Não foi possível atualizar a categoria');
      }
    }, err => {
      this.exibeToast('danger', err);
    })
  }

  fechaModalCategoriaMaterial() {
    this.modalController.dismiss(null, 'cancel');
  }

  listaCategorias() {
    this.exibeLoader().then(() => {
      this.categorias$ = this.crud.obtemInformacao('/materiais/listaCategoria.php');

      this.subscription = this.categorias$.subscribe((data) => {
        if (data) {
          this.dadosCategoria = data;
          this.loadingController.dismiss();
        } else {
          this.exibeToast('danger','Não foi possível exibir as categorias');
          this.loadingController.dismiss();

        }
      }, err => {
        this.exibeToast('danger', err);
        this.loadingController.dismiss();
      })
    })
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
