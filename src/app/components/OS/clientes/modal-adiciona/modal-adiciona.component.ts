import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { CrudService } from 'src/app/services/crud.service';
import { Cliente } from 'src/app/shared/cliente';

@Component({
  selector: 'app-modal-adiciona',
  templateUrl: './modal-adiciona.component.html',
  styleUrls: ['./modal-adiciona.component.scss'],
})
export class ModalAdicionaComponent implements OnInit {

  tipoCliente: string = null;
  formCadastroCliente: FormGroup;
  cliente: Cliente;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private crud: CrudService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.montaForm();
  }

  montaForm() {

    this.formCadastroCliente = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      cpf: [null, [Validators.minLength(11), Validators.maxLength(11)]],
      razao_social: [null, [Validators.minLength(2), Validators.maxLength(70)]],
      cnpj: [null, [Validators.minLength(14), Validators.maxLength(14)]],
      telefone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      celular: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      whatsapp: ['', [Validators.required]],
      email: ['', [Validators.email]],
      endereco: '',
      bairro: '',
      cidade: '',
      estado: ['', [Validators.minLength(2), Validators.maxLength(2)]],
      cep: ['', [Validators.minLength(8), Validators.maxLength(8)]],
      obs: ''
    })

  }

  get formControls() {
    return this.formCadastroCliente.controls;
  }

  public transformaInputMaiusculo(control: string) {
    return this.formCadastroCliente.get(control).value.toUpperCase();
  }

  public cadastra() {

    this.transformaInputMaiusculo('estado');

    this.cliente = this.formCadastroCliente.value;

    this.exibeLoader().then(() => {
      this.crud.adicionaInformacao('/clientes/cadastraCliente.php', this.cliente).subscribe(() => {
        this.exibeToast('success', 'Cliente cadastrado com sucesso');
        this.formCadastroCliente.reset();
        this.loadingController.dismiss();
        this.modalController.dismiss(null, 'confirm');
      }, err => {
        console.error(err);
        this.exibeToast('danger', err);
        this.loadingController.dismiss();
      })
    })
  }

  segmentChanged(ev: any) {
    this.tipoCliente = ev.detail.value;
    console.log(this.tipoCliente);
  }

  fechaModal() {
    this.modalController.dismiss(null, 'cancel');
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
}
