import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { CategoriaEquipamento } from 'src/app/shared/categoria_equipamento';

@Component({
  selector: 'app-categoria-equipamento',
  templateUrl: './categoria-equipamento.component.html',
  styleUrls: ['./categoria-equipamento.component.scss'],
})
export class CategoriaEquipamentoComponent implements OnInit {

  formCategoriaEquipamento: FormGroup;
  categoriaEquipamento: CategoriaEquipamento = null;
  categorias$: Observable<CategoriaEquipamento[]>;
  dadosCategoria: CategoriaEquipamento[] = null;

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
    this.formCategoriaEquipamento = this.fb.group({
      categoria: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]]
    });
  }

  get formControls() {
    return this.formCategoriaEquipamento.controls;
  }

  cadastra() {
    this.categoriaEquipamento = this.formCategoriaEquipamento.value;

    this.exibeLoader().then(() => {
      this.crud.adicionaInformacao('/equipamentos/cadastraCategoria.php', this.categoriaEquipamento).subscribe((res) => {
        if (res) {
          this.exibeToast('success', 'Categoria cadastrada com sucesso.');
          this.formCategoriaEquipamento.reset();          
          this.listaCategorias();
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
            if(alertData.nomeCategoria != 0){
              this.atualiza(idMaterial, alertData.nomeCategoria);
            } else {
              window.alert('A categoria deve conter um nome válido');
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
    this.crud.atualizaInformacao('/equipamentos/atualizaCategoria.php', {id, value}).subscribe((res) => {
      if (res) {
        this.exibeToast('success', 'Categoria atualizada com sucesso');
      } else {
        this.exibeToast('danger', 'Não foi possível atualizar a categoria');
      }
    }, err => {
      this.exibeToast('danger', err);
    })
  }

  deleta(id: number) {
    this.exibeLoader().then((res) => {
      this.crud.deletaInformacao('/equipamentos/deletaCategoria.php', id).subscribe((res) => {
        if(res) {
          this.exibeToast('success', 'Categoria deletada com sucesso');
        } else {
          this.exibeToast('danger', 'Não foi possível deletar a categoria');
        }
        this.loadingController.dismiss();
        this.listaCategorias();
      }, err => {
        this.exibeToast('danger', err);
        this.loadingController.dismiss();
      })
    })

  }

  fechaModalCategoriaMaterial() {
    this.modalController.dismiss(null, 'cancel');
  }

  listaCategorias() {
    this.exibeLoader().then(() => {
      this.categorias$ = this.crud.obtemInformacao('/equipamentos/listaCategoria.php');

      this.subscription = this.categorias$.subscribe((data) => {
        if (data) {
          this.dadosCategoria = data;
        }
      }, err => {
        this.exibeToast('danger', err);
      })
    })
      .finally(() => {
        this.loadingController.dismiss();
      })
  }

  // ALERT
  async exibeAlert(mensagem: string) {

    const alert = await this.alertController.create({
      message: mensagem,
      buttons: [
        {
          text: 'Não',
          role: 'cancel'
        },
        {
          text: 'Sim',
          role: 'confirm'
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onWillDismiss();

    if (role === 'confirm') {
      return true;
    } else {
      return false;
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
