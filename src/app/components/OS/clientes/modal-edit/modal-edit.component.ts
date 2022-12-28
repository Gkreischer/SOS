import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { CrudService } from 'src/app/services/crud.service';
import { Cliente } from 'src/app/shared/cliente';

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.scss'],
})
export class ModalEditComponent implements OnInit {

  @Input('cliente') cliente: Cliente;
  formAtualizaCliente: FormGroup;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private crud: CrudService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.montaForm();
  }

  ionViewWillEnter() {
    this.formAtualizaCliente.patchValue(this.cliente);
  }

  montaForm() {
    this.formAtualizaCliente = this.fb.group({
      id: ['', Validators.required],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      cpf: '',
      razao_social: '',
      cnpj: '',
      telefone: '',
      celular: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      whatsapp: ['', [Validators.required]],
      email: '',
      endereco: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      obs: ''
    });
  }

  get formControls() {
    return this.formAtualizaCliente.controls;
  }

  atualiza() {
    this.cliente = this.formAtualizaCliente.value;

    console.log(this.cliente);

    this.exibeLoader().then(() => {
      this.crud.atualizaInformacao('/clientes/atualizaCliente.php', this.cliente).subscribe((res) => {
        if(res) {
          this.exibeToast('success', 'Cliente atualizado com sucesso');
          this.formAtualizaCliente.reset();
          this.loadingController.dismiss();
          this.modalController.dismiss(null, 'confirm');
        } else {
          this.exibeToast('danger', 'Não foi possível atualizar o cliente');
          this.loadingController.dismiss();
        }
      }, err => {
        this.exibeToast('danger', err);
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

  fechaModal() {
    this.modalController.dismiss(null, 'cancel');
  }

}
