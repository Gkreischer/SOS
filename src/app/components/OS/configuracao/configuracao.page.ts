import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { CrudService } from 'src/app/services/crud.service';
import { Configuracao } from 'src/app/shared/configuracao';
import { environment } from 'src/environments/environment';
import { CategoriaEquipamentoComponent } from './categoria-equipamento/categoria-equipamento.component';
import { CategoriaMaterialComponent } from './categoria-material/categoria-material.component';

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.page.html',
  styleUrls: ['./configuracao.page.scss'],
})
export class ConfiguracaoPage implements OnInit {

  formAtualizaConfiguracao: FormGroup;
  dadosFormConfiguracao: Configuracao = null;
  dadosConfiguracao: Configuracao = null;

  urlUpload: string = `${environment.baseUrl}/images/logo`;
  arquivo: File = null;

  constructor(
    private crud: CrudService,
    private fb: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.montaForm();
  }

  ionViewWillEnter() {
    this.exibeDadosLoja();
  }

  async exibeDadosLoja() {
    this.crud.obtemInformacao('/configuracao/listaConfiguracao.php').subscribe((res) => {
      if (res && this.formAtualizaConfiguracao) {
        this.dadosConfiguracao = res[0];
        console.log(this.dadosConfiguracao);
        this.formAtualizaConfiguracao.patchValue(res[0]);
      } else {
        this.exibeToast('danger', 'Não foi possível receber os dados da loja');
      }
    }, err => {
      this.exibeToast('danger', err);
    })
  }

  montaForm() {
    this.formAtualizaConfiguracao = this.fb.group({
      razao_social: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      nome_fantasia: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      cnpj: [null, [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
      telefone: [null, [Validators.minLength(10), Validators.maxLength(10)]],
      celular: [null, [Validators.minLength(11), Validators.maxLength(11)]],
      email: [null, [Validators.email]],
      whatsapp: null,
      caminho_logo: null,
      endereco: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      bairro: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      cidade: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      estado: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      cep: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      texto_comprovante_os: [null, [Validators.required, Validators.maxLength(800)]]
    });
  }

  get formControls() {
    return this.formAtualizaConfiguracao.controls;
  }

  atualiza() {
    this.dadosFormConfiguracao = this.formAtualizaConfiguracao.value;

    this.exibeLoader().then(() => {
      this.crud.atualizaInformacao('/configuracao/atualizaConfiguracao.php', this.dadosFormConfiguracao).subscribe((res) => {
        if (res) {
          this.exibeToast('success', 'Configuração atualizada com sucesso');
          this.loadingController.dismiss();
        } else {
          this.exibeToast('danger', 'Não foi possível atualizar a configuração');
          this.loadingController.dismiss();
        }
      }, err => {
        console.error(err);
        this.exibeToast('danger', err);
        this.loadingController.dismiss();
      })
    })
  }

  uploadLogo(event) {

    this.arquivo = event.target.files[0];

    if (this.arquivo) {
      let formData = new FormData();

      formData.append("logo", this.arquivo, this.arquivo.name);

      this.exibeLoader().then(() => {
        this.crud.upload('/upload/uploadLogo.php', formData).subscribe((res) => {
          if (res) {
            console.log(res);
            this.exibeToast('success', 'Logo atualizada com sucesso');
            this.loadingController.dismiss();
            this.exibeDadosLoja();
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

  // CATEGORIA MATERIAIS

  // MODAL ADICIONA/EDITA/DELETA MATERIAL
  async exibeModalCadastroCategoriaMaterial() {

    const modal = await this.modalController.create({
      component: CategoriaMaterialComponent,
      backdropDismiss: false
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();

  }

  // CATEGORIA EQUIPAMENTOS

  // MODAL ADICIONA/EDITA/DELETA MATERIAL
  async exibeModalCadastroCategoriaEquipamento() {

    const modal = await this.modalController.create({
      component: CategoriaEquipamentoComponent,
      backdropDismiss: false
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();

  }

}
