import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Funcionario } from 'src/app/shared/funcionario';
import { Material } from 'src/app/shared/material';
import { OrdemServico } from 'src/app/shared/ordemServico';

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.scss'],
})
export class ModalEditComponent implements OnInit, OnDestroy {

  @Input('ordemServico') ordemServico: OrdemServico = null;

  formAtualizaOrdemServico: FormGroup;
  dadosOrdemServico: OrdemServico
  id_ordemServico: number;
  materialPresente: boolean = false;
  total_material: number = 0;

  funcionarios$: Observable<Funcionario[]> = null;
  dadosFuncionarios: Funcionario[] = null;

  materiais$: Observable<Material[]> = null;
  dadosMateriais: Material[] = null;

  subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private crud: CrudService,
    private loadingService: LoadingService,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.id_ordemServico = this.ordemServico.id;
  }

  ionViewWillEnter() {
    this.loadingService.present().then(() => {
      this.buscaOrdem();
      this.listaFuncionarios();
      this.listaMateriais();
    })
    .finally(() => {
      this.loadingService.dismiss();
    })
  }

  buscaOrdem() {
    this.subscription = this.crud.obtemInformacaoEspecifica('/ordemServico/buscaOrdemEspecifica.php', this.id_ordemServico).subscribe((ordemServico) => {
      if (ordemServico) {
        this.dadosOrdemServico = ordemServico[0];
        this.buscaMaterial();
        // MONTA FORM SOMENTE APOS TER OS DADOS DA ORDEM
        this.montaForm();
      } else {
        this.exibeToast('danger', 'Não foi possível exibir a ordem de serviço');
      }
    }, err => {
      this.exibeToast('danger', err);
    })
  }

  buscaMaterial() {
    this.subscription = this.crud.obtemInformacaoEspecifica('/materialOs/buscaMaterial.php', this.id_ordemServico).subscribe((materiais) => {
      if (materiais.length > 0) {
        this.insereMateriaisForm(materiais);
      }
    }, err => {
      this.exibeToast('danger', err);
    })
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

  listaFuncionarios() {
    this.funcionarios$ = this.crud.obtemInformacao('/funcionarios/listaFuncionario.php');

    this.funcionarios$.subscribe((funcionarios) => {
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

  listaMateriais() {

    this.materiais$ = this.crud.obtemInformacao('/materiais/listaMaterial.php');
    this.materiais$.subscribe((materiais) => {
      if (materiais) {
        this.dadosMateriais = materiais;
      } else {
        this.exibeToast('danger', 'Não foi possível carregar a lista de materiais');
      }
    }, err => {
      this.exibeToast('danger', err);
    });
  }

  async montaForm() {
    this.formAtualizaOrdemServico = this.fb.group({
      id_cliente: ['', [Validators.required]],
      id_equipamento: ['', [Validators.required]],
      id_atendente: ['', [Validators.required]],
      id_tecnico_diagnostico: null,
      id_tecnico_execucao: null,
      aceito: null,
      orcado: null,
      finalizado: null,
      entregue: null,
      problema_relatado: '',
      problema_diagnosticado: ['', [Validators.required, Validators.minLength(2)]],
      servico_executado: null,
      obs: '',
      obs_tecnico: null,
      total_servico: [0, [Validators.required]],
      total_material: 0,
      total_os: 0,
      desconto: [0, [Validators.required]],
      materiais: this.fb.array([])
    });

    this.formAtualizaOrdemServico.patchValue(this.dadosOrdemServico);
  }

  get formControls() {
    return this.formAtualizaOrdemServico.controls;
  }

  get materiaisForm() {
    return this.formAtualizaOrdemServico.get('materiais') as FormArray;
  }

  get calculaValorTotalMaterial() {
    const arrayMateriais = this.formAtualizaOrdemServico.get('materiais').value;
    let valor_total = 0;
    arrayMateriais.forEach(element => {
      valor_total += parseFloat(element.valor) * parseInt(element.quantidade);
    });
    return valor_total;
  }

  get calculaValorTotalOrdemServico() {
    let valor_servico = this.formAtualizaOrdemServico.get('total_servico').value;
    let valor_material = this.calculaValorTotalMaterial;

    let desconto = this.formAtualizaOrdemServico.get('desconto').value;

    let valor_total = (parseFloat(valor_servico) + valor_material) - parseFloat(desconto);
    return valor_total;
  }

  deletaMaterialListagem(i) {
    this.materiaisForm.removeAt(i);
  }

  atualiza() {

    this.formAtualizaOrdemServico.get('orcado').patchValue(0);
    this.formAtualizaOrdemServico.get('total_os').patchValue(this.calculaValorTotalOrdemServico);
    this.formAtualizaOrdemServico.get('total_material').patchValue(this.calculaValorTotalMaterial);

    this.crud.atualizaInformacao('/ordemServico/atualizaOrdemServico.php', { id: this.id_ordemServico, ordemServico: this.formAtualizaOrdemServico.value }).subscribe((res) => {
      if (res) {
        console.log(res);
        this.exibeToast('success', 'Ordem de serviço atualizada com sucesso');
      } else {
        this.exibeToast('danger', 'Não foi possível atualizar a ordem de serviço');
      }
    }, err => {
      this.exibeToast('danger', err);
    })
  }

  finaliza() {

    this.exibeAlert('Deseja finalizar? Não será possível editar o orçamento.').then((res) => {
      if (res) {
        this.formAtualizaOrdemServico.get('orcado').patchValue(1);
        this.formAtualizaOrdemServico.get('total_os').patchValue(this.calculaValorTotalOrdemServico);
        this.formAtualizaOrdemServico.get('total_material').patchValue(this.calculaValorTotalMaterial);

        this.crud.atualizaInformacao('/ordemServico/atualizaOrdemServico.php', { id: this.id_ordemServico, ordemServico: this.formAtualizaOrdemServico.value }).subscribe((res) => {
          if (res) {
            this.exibeToast('success', 'Ordem de serviço finalizada com sucesso');
            this.modalController.dismiss(null, 'confirm');
          } else {
            this.exibeToast('danger', 'Não foi possível atualizar a ordem de serviço');
          }
        }, err => {
          this.exibeToast('danger', err);
        })
      } else {
        return;
      }
    })

  }

  adicionaMaterial(event) {

    const id_material = +event.target.value;

    const materialSelecionado = this.dadosMateriais.find((material) => {
      return material.id == id_material;
    })

    const materialForm = this.fb.group({
      id_material: materialSelecionado.id,
      nome: materialSelecionado.nome,
      valor: materialSelecionado.valor,
      quantidade: 1
    });

    this.materiaisForm.push(materialForm);

  }

  permiteAdicaoMaterial(event) {
    this.materialPresente = !this.materialPresente;
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
    this.subscription.unsubscribe();
  }
}