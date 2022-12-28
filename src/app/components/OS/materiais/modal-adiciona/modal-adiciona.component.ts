import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { CrudService } from 'src/app/services/crud.service';
import { CategoriaMaterial } from 'src/app/shared/categoria_material';
import { Material } from 'src/app/shared/material';

@Component({
  selector: 'app-modal-adiciona',
  templateUrl: './modal-adiciona.component.html',
  styleUrls: ['./modal-adiciona.component.scss'],
})
export class ModalAdicionaComponent implements OnInit {

  formCadastroMaterial: FormGroup;
  dadosMaterial: Material;
  categoriasRecebidas: Array<CategoriaMaterial> = [];

  constructor(
    private modal: ModalController,
    private fb: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private crud: CrudService) { }

  ngOnInit() {
    this.montaForm();
  }

  ionViewWillEnter() {
    this.listaCategorias();
  }

  montaForm() {
    this.formCadastroMaterial = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      id_categoria: ['', [Validators.required]],
      descricao: '',
      valor: ['', [Validators.required]]
    });
  }

  listaCategorias() {
    this.exibeLoader().then(() => {
      this.crud.obtemInformacao('/materiais/listaCategoria.php').subscribe((categorias) => {
        if(categorias.length == 0){
          this.exibeAlert('Você deve cadastrar uma categoria primeiramente. Vá em configurações, "Categoria Materiais"').then(() => {
            this.modal.dismiss();
          });
        } else {
          this.categoriasRecebidas = categorias;
        }
      }, err => {
        console.error(err);
        this.exibeToast('danger', err);
      })
    })
      .finally(() => {
        this.fechaLoader();
      });
  }

  get formControls() {
    return this.formCadastroMaterial.controls;
  }

  fechaLoader() {
    return this.loadingController.dismiss();
  }

  fechaModal() {
    this.modal.dismiss(null, 'cancel');
  }

  cadastra() {
    this.dadosMaterial = this.formCadastroMaterial.value;

    this.exibeLoader().then(() => {
      this.crud.adicionaInformacao('/materiais/cadastraMaterial.php', this.dadosMaterial).subscribe((res) => {
        if(res) {
          this.exibeToast('success', 'Material cadastrado com sucesso');
          this.formCadastroMaterial.reset();
          this.modal.dismiss(null, 'confirm');
        } else {
          this.exibeToast('danger', 'Não foi possível cadastrar o material');
        }
      })
    })
    .finally(() => {
      this.fechaLoader();
    });
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

  // ALERT
  async exibeAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  // LOADER
  async exibeLoader() {
    const loader = await this.loadingController.create({
      message: 'Carregando...',
      translucent: true
    });
    await loader.present();
  }

}
