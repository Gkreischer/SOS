import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { CrudService } from 'src/app/services/crud.service';
import { CategoriaMaterial } from 'src/app/shared/categoria_material';
import { Material } from 'src/app/shared/material';

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.scss'],
})
export class ModalEditComponent implements OnInit {

  @Input('material') material: Material;

  formAtualizaMaterial: FormGroup;
  dadosMaterial: Material;
  categoriasRecebidas: Array<CategoriaMaterial> = [];

  arquivo: File = null;

  constructor(private modal: ModalController,
    private fb: FormBuilder,
    private crud: CrudService,
    private toastController: ToastController,
    private loadingController: LoadingController) { }

  ngOnInit() {
    this.montaForm();
  }

  ionViewWillEnter() {
    this.listaCategorias();
    this.formAtualizaMaterial.patchValue(this.material);
  }

  fecharModal() {
    this.modal.dismiss(null, 'cancel');
  }

  montaForm() {
    this.formAtualizaMaterial = this.fb.group({
      id: this.material.id,
      nome: ['', [Validators.required, Validators.minLength(2)]],
      id_categoria: ['', [Validators.required]],
      descricao: '',
      valor: ['', [Validators.required]],
      caminho_imagem: null
    });
  }

  get formControls() {
    return this.formAtualizaMaterial.controls;
  }

  get caminho_imagem() {
    return this.formAtualizaMaterial.get('caminho_imagem').value;
  }

  uploadImagem(event) {

    this.arquivo = event.target.files[0];

    if (this.arquivo) {
      let formData = new FormData();

      formData.append("material", this.arquivo, this.arquivo.name);
      formData.append("id_material", this.material.id.toString());

      this.exibeLoader().then(() => {
        this.crud.upload('/upload/uploadMaterial.php', formData).subscribe((res) => {
          if (res) {
            console.log(res);
            this.exibeToast('success', 'Imagem do produto atualizada com sucesso');
            this.formAtualizaMaterial.get('caminho_imagem').patchValue(res['caminho_imagem']);
            this.loadingController.dismiss();
          } else {
            this.exibeToast('error', res);
            this.loadingController.dismiss();
          }
        }, err => {
          this.exibeToast('danger', err);
          this.loadingController.dismiss();
        })
      })
    }
  }


  atualizaMaterial() {

    this.exibeLoader().then(() => {
      this.dadosMaterial = this.formAtualizaMaterial.value;

      this.crud.atualizaInformacao('/materiais/atualizaMaterial.php', this.dadosMaterial).subscribe((res) => {
        console.log(res);
        if (res) {
          this.exibeToast('success', 'Material atualizado com sucesso');
          this.modal.dismiss(null, 'confirm');
        } else {
          this.exibeToast('danger', 'Não foi possível atualizar o produto.');
        }
      }, err => {
        console.error(err);
        this.exibeToast('danger', err);
      })
    })
      .finally(() => {
        this.fechaLoader();
      })
  }

  listaCategorias() {
    this.exibeLoader().then(() => {
      this.crud.obtemInformacao('/materiais/listaCategoria.php').subscribe((categorias) => {
        this.categoriasRecebidas = categorias;
        console.log(this.categoriasRecebidas);
      }, err => {
        console.error(err);
        this.exibeToast('danger', err);
      })
    })
      .finally(() => {
        this.fechaLoader();
      });
  }

  fechaLoader() {
    this.loadingController.dismiss();
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

  // LOADER
  async exibeLoader() {
    const loader = await this.loadingController.create({
      message: 'Carregando...',
      translucent: true
    });
    await loader.present();
  }

  fechaModal() {
    this.modal.dismiss(null, 'cancel');
  }

}
