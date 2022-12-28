import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { CategoriaEquipamento } from 'src/app/shared/categoria_equipamento';
import { Cliente } from 'src/app/shared/cliente';
import { Equipamento } from 'src/app/shared/equipamento';

@Component({
  selector: 'app-modal-adiciona',
  templateUrl: './modal-adiciona.component.html',
  styleUrls: ['./modal-adiciona.component.scss'],
})
export class ModalAdicionaComponent implements OnInit, OnDestroy {

  @Input('idClienteSelecionado') idClienteSelecionado: Cliente = null;
  dadosCliente: Cliente = null;
  subscription: Subscription;

  formCadastroEquipamento: FormGroup;
  equipamento: Equipamento = null;
  categorias$: Observable<CategoriaEquipamento[]> = null;
  dadosCategorias: CategoriaEquipamento[] = null;
  
  constructor(
    private modal: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private crud: CrudService,
    private fb: FormBuilder,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.montaForm();
  }

  ionViewWillEnter() {
    this.carregaDadosClienteSelecionado();
  }

  carregaDadosClienteSelecionado() {
    this.exibeLoader().then(() => {
      if(this.idClienteSelecionado){
        this.subscription = this.crud.obtemInformacaoEspecifica('/clientes/listaClienteEspecifico.php', +this.idClienteSelecionado).subscribe((res) => {
          if(res){
            this.dadosCliente = res[0];
            this.loadingController.dismiss();
            this.listaCategorias();
          }
        }, err => {
          this.exibeToast('danger', err);
          this.loadingController.dismiss();
        })
      }
    })
  } 

  listaCategorias() {
    this.exibeLoader().then(() => {
      this.categorias$ = this.crud.obtemInformacao('/equipamentos/listaCategoria.php');

      this.subscription = this.categorias$.subscribe((res) => {
        if(res.length == 0) {
          this.loadingController.dismiss();
          this.exibeAlert('Você deve cadastrar uma categoria de equipamentos primeiro. Vá em configurações, "Categoria Equipamentos"');
          this.modal.dismiss();
          return;  
        } 
        this.dadosCategorias = res;
        console.log(this.dadosCategorias);
        this.loadingController.dismiss();
      }, err => {
        this.exibeToast('danger', err);
      })
    })
  }

  cadastra() {
    this.equipamento = this.formCadastroEquipamento.value;

    this.subscription = this.crud.adicionaInformacao('/equipamentos/cadastraEquipamento.php', this.equipamento).subscribe((res) => {
      if(res) {
        this.exibeToast('success', 'Equipamento cadastrado com sucesso');
        this.modal.dismiss(null, 'confirm');
      } else {
        this.exibeToast('danger', 'Não foi possível cadastrar seu equipamento');
      }
    }, err => {
      this.exibeToast('danger', err);
    })
  }

  montaForm() {
    this.formCadastroEquipamento = this.fb.group({
      id_cliente: [this.idClienteSelecionado, [Validators.required]],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      id_categoria: ['', [Validators.required]],
      numero_serie: '',
      descricao: ''
    });
  }

  get formControls() {
    return this.formCadastroEquipamento.controls;
  }

  fechaModal() {
    this.modal.dismiss(null, 'cancel');
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

   // ALERT
   async exibeAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
