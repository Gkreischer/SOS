import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { CrudService } from 'src/app/services/crud.service';
import { Funcionario } from 'src/app/shared/funcionario';

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.scss'],
})
export class ModalEditComponent implements OnInit {

  @Input('funcionario') funcionario: Funcionario;

  formAtualizaFuncionario: FormGroup;
  dadosFuncionario: Funcionario;

  imagem_funcionario: File = null;

  constructor(
    private modal: ModalController,
    private fb: FormBuilder,
    private crud: CrudService,
    private toastController: ToastController,
    private loadingController: LoadingController) { }

  ngOnInit() {
    this.montaForm();
  }

  ionViewWillEnter() {
    this.formAtualizaFuncionario.patchValue(this.funcionario);

  }

  fechaModal() {
    this.modal.dismiss(null, 'cancel');
  }

  atualizaFuncionario() {

    this.dadosFuncionario = this.formAtualizaFuncionario.value;

    this.crud.atualizaInformacao('/funcionarios/atualizaFuncionario.php', this.dadosFuncionario).subscribe((res) => {
      if (res) {
        this.exibeToast('success', 'Funcionário atualizado com sucesso.');
        this.modal.dismiss(null, 'confirm');
        this.loadingController.dismiss();
      } else {
        this.loadingController.dismiss();
        this.exibeToast('error', 'Não foi possível atualizar os dados do funcionário');
      }
    }, err => {
      console.error(err);
      this.loadingController.dismiss();
      this.exibeToast('error', err);
    })

  }

  montaForm() {
    this.formAtualizaFuncionario = this.fb.group({
      id: this.funcionario.id,
      nome: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      cpf: [null, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      email: [null, [Validators.required, Validators.email, Validators.maxLength(70)]],
      telefone: null,
      celular: [null, [Validators.required, Validators.minLength(11)]],
      cargo: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      nivel: [null, Validators.required],
      senha: [null, [Validators.required, Validators.minLength(8)]],
      caminho_imagem: null
    });
  }

  get caminho_imagem() {
    return this.formAtualizaFuncionario.get('caminho_imagem').value;
  }

  uploadImagem(event) {

    this.imagem_funcionario = event.target.files[0];

    if (this.imagem_funcionario) {
      let formData = new FormData();

      formData.append("imagem", this.imagem_funcionario, this.imagem_funcionario.name);
      formData.append("id_funcionario", this.funcionario.id.toString());

      this.exibeLoader().then(() => {
        this.crud.upload('/upload/uploadImagemFuncionario.php', formData).subscribe((res) => {
          if (res) {
            console.log(res);
            this.exibeToast('success', 'Logo atualizada com sucesso');
            this.formAtualizaFuncionario.get('caminho_imagem').patchValue(res['caminho_imagem']);
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

  get formControls() {
    return this.formAtualizaFuncionario.controls;
  }

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

}
