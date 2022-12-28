import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { CrudService } from 'src/app/services/crud.service';
import { Funcionario } from 'src/app/shared/funcionario';

@Component({
  selector: 'app-modal-adiciona',
  templateUrl: './modal-adiciona.component.html',
  styleUrls: ['./modal-adiciona.component.scss'],
})
export class ModalAdicionaComponent implements OnInit {

  formCadastroFuncionario: FormGroup;
  funcionario: Funcionario;

  constructor(
    private crud: CrudService,
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modal: ModalController,
    private alertController: AlertController
    ) { }

  ngOnInit() {
    this.montaForm();
   }

  public montaForm() {
    this.formCadastroFuncionario = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(70)]],
      telefone: '',
      celular: ['', [Validators.required, Validators.minLength(11)]],
      cargo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      nivel: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get formControls() {
    return this.formCadastroFuncionario.controls;
  }

  public cadastra() {
    this.funcionario = this.formCadastroFuncionario.value;

    this.exibeLoader().then(() => {
      this.crud.adicionaInformacao('/funcionarios/cadastraFuncionario.php', this.funcionario).subscribe(() => {
        this.exibeToast('success', 'Funcionário cadastro com sucesso');
        this.formCadastroFuncionario.reset();
        this.modal.dismiss(null, 'confirm');
      }, err => {
        console.error(err);
        this.exibeToast('danger', err);

      })
    })
      .finally(() => {
        this.loadingController.dismiss();
      });
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
