import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { Funcionario } from 'src/app/shared/funcionario';
import { Material } from 'src/app/shared/material';
import { OrdemServico } from 'src/app/shared/ordemServico';

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.scss'],
})
export class ModalEditComponent implements OnInit {

  @Input('ordemServico') ordemServico: OrdemServico = null;

  formAtualizaOrdemServico: FormGroup;
  dadosOrdemServico: OrdemServico
  id_ordemServico: number;

  materiais$: Observable<Material[]> = null;
  dadosMateriais: Material[] = null;

  funcionarios$: Observable<Funcionario[]> = null;
  dadosFuncionarios: Funcionario[] = null;

  subscriptionOrdemServico: Subscription;
  subscriptionMateriais: Subscription;
  subscriptionFuncionarios: Subscription;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private crud: CrudService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.id_ordemServico = this.ordemServico.id;
    this.montaForm();
  }

  ionViewWillEnter() {
    this.buscaOrdem();
    this.listaFuncionarios();
  }

  async buscaOrdem() {
    this.exibeLoader().then(() => {
      this.subscriptionOrdemServico = this.crud.obtemInformacaoEspecifica('/ordemServico/buscaOrdemEspecifica.php', this.id_ordemServico).subscribe((ordemServico) => {
        if (ordemServico) {

          this.dadosOrdemServico = ordemServico[0];
          console.log(this.dadosOrdemServico);

          this.formAtualizaOrdemServico.patchValue(this.dadosOrdemServico);

          // MONTA FORM SOMENTE APOS TER OS DADOS DA ORDEM
          this.loadingController.dismiss();
          this.buscaMaterial();

        } else {
          this.exibeToast('danger', 'Não foi possível exibir a ordem de serviço');
          this.loadingController.dismiss();
        }
      }, err => {
        this.exibeToast('danger', err);
        this.loadingController.dismiss();
      })
    })
  }

  async buscaMaterial() {
    this.exibeLoader().then(() => {

      this.materiais$ = this.crud.obtemInformacaoEspecifica('/materialOs/buscaMaterial.php', this.id_ordemServico);

      this.subscriptionMateriais = this.materiais$.subscribe((materiais) => {
        if (materiais.length > 0) {
          this.dadosMateriais = materiais;
          console.log(this.dadosMateriais);
          this.insereMateriaisForm(materiais);
          this.loadingController.dismiss();
        } else {
          this.loadingController.dismiss();
          this.exibeToast('warning', 'Sem materiais cadastrados nesse orçamento');
        }
      }, err => {
        this.exibeToast('danger', err);
        this.loadingController.dismiss();
      })
    });
  }

  insereMateriaisForm(materiais: Material[]) {
    materiais.forEach(material => {
      const criaMaterialForm = this.fb.group({
        id_material: '',
        nome: '',
        valor: '',
        quantidade: ''
      });

      criaMaterialForm.patchValue(material);
      this.materiaisForm.push(criaMaterialForm);
    });
  }

  async listaFuncionarios() {
    this.funcionarios$ = this.crud.obtemInformacao('/funcionarios/listaFuncionario.php');

    this.subscriptionFuncionarios = this.funcionarios$.subscribe((funcionarios) => {
      if (funcionarios) {
        this.dadosFuncionarios = funcionarios;
      } else {
        if (funcionarios.length == 0) {
          this.exibeAlert('Você deve cadastrar funcionários primeiramente');
          this.modalController.dismiss(null, 'cancel');
        } else {
          this.exibeToast('danger', 'Não foi possível carregar os funcionários');
        }
      }
    }, err => {
      this.exibeToast('danger', err);
    })
  }

  async montaForm() {
    this.formAtualizaOrdemServico = this.fb.group({
      id_cliente: [null, [Validators.required]],
      id_equipamento: [null, [Validators.required]],
      id_atendente: [null, [Validators.required]],
      id_tecnico_diagnostico: null,
      id_tecnico_execucao: null,
      aceito: [null, [Validators.required]],
      orcado: null,
      finalizado: null,
      entregue: null,
      problema_relatado: null,
      problema_diagnosticado: [null, [Validators.minLength(2)]],
      servico_executado: [null, [Validators.minLength(2)]],
      obs: null,
      obs_tecnico: null,
      total_servico: [null, [Validators.required]],
      total_material: null,
      total_os: null,
      desconto: 0,
      materiais: this.fb.array([])
    });
  }

  get materiaisForm() {
    return this.formAtualizaOrdemServico.get('materiais') as FormArray;
  }

  get valorTotalMaterial() {
    return this.formAtualizaOrdemServico.get('total_material').value;
  }

  get valorTotalOrdemServico() {
    return this.formAtualizaOrdemServico.get('total_os').value;
  }

  get formControls() {
    return this.formAtualizaOrdemServico.controls;
  }

  atualiza() {

    this.exibeLoader().then(() => {

      this.crud.atualizaInformacao('/ordemServico/atualizaOrdemServico.php', { id: this.id_ordemServico, ordemServico: this.formAtualizaOrdemServico.value }).subscribe((res) => {
        if (res) {
          console.log(res);
          this.loadingController.dismiss();
          this.exibeToast('success', 'Ordem de serviço atualizada com sucesso');
        } else {
          this.loadingController.dismiss();
          this.exibeToast('danger', 'Não foi possível atualizar a ordem de serviço');
        }
      }, err => {
        this.exibeToast('danger', err);
        this.loadingController.dismiss();
      })
    });
  }

  finaliza() {

    this.exibeAlert('Você deseja finalizar a ordem? Aviso: Não será possível reverter').then((res) => {
      if (res) {
        this.exibeLoader().then(() => {

          this.formAtualizaOrdemServico.get('finalizado').patchValue(1);

          this.crud.atualizaInformacao('/ordemServico/atualizaOrdemServico.php', { id: this.id_ordemServico, ordemServico: this.formAtualizaOrdemServico.value }).subscribe((res) => {
            if (res) {
              console.log(res);
              this.loadingController.dismiss();
              this.exibeToast('success', 'Ordem de serviço finalizada com sucesso');
              this.modalController.dismiss(null, 'confirm');
            } else {
              this.loadingController.dismiss();
              this.exibeToast('danger', 'Não foi possível atualizar a ordem de serviço');
            }
          }, err => {
            this.exibeToast('danger', err);
            this.loadingController.dismiss();
          })
        });
      } else {
        return;
      }
    })
  }

  fechaModal() {
    this.modalController.dismiss(null, 'cancel');
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

  ngOnDestroy(): void {
    this.subscriptionMateriais.unsubscribe();
    this.subscriptionOrdemServico.unsubscribe();
    this.subscriptionFuncionarios.unsubscribe();
  }

}