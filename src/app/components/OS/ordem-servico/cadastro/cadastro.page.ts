import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { Cliente } from 'src/app/shared/cliente';
import { Equipamento } from 'src/app/shared/equipamento';
import { Funcionario } from 'src/app/shared/funcionario';
import { OrdemServico } from 'src/app/shared/ordemServico';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit, OnDestroy {

  clientes$: Observable<Cliente[]> = null;
  subscriptionClientes: Subscription;
  dadosClientes: Cliente[] = null;

  equipamentosCliente$: Observable<Equipamento[]> = null;
  subscriptionEquipamentos: Subscription;
  dadosEquipamentos: Equipamento[] = null;

  atendentes$: Observable<Funcionario[]> = null;
  subscriptionAtendentes: Subscription;
  dadosAtendentes: Funcionario[] = null;

  formCadastroOrdemServico: FormGroup;
  ordemServico: OrdemServico;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private crud: CrudService,
    private router: Router
  ) { }

  ngOnInit() {
    this.montaForm();
  }

  ionViewWillEnter() {
    this.listaClientes();
  }

  montaForm() {
    this.formCadastroOrdemServico = this.fb.group({
      id_cliente: ['', [Validators.required]],
      id_equipamento: ['', [Validators.required]],
      id_atendente: ['', [Validators.required]],
      id_tecnico_diagnostico: null,
      id_tecnico_execucao: null,
      aceito: null,
      orcado: 0,
      finalizado: null,
      entregue: null,
      problema_relatado: ['', [Validators.required]],
      problema_diagnosticado: null,
      servico_executado: null,
      obs: null,
      obs_tecnico: null,
      total_servico: null,
      total_material: null,
      total_os: null,
      desconto: null
    });
  }

  get formControls() {
    return this.formCadastroOrdemServico.controls;
  }

  listaClientes() {

    this.exibeLoader().then(() => {
      this.clientes$ = this.crud.obtemInformacao('/clientes/listaCliente.php');
      
      this.subscriptionClientes = this.clientes$.subscribe((clientes) => {
        if (clientes) {
          this.dadosClientes = clientes;
          console.log(this.dadosClientes);
        } else {
          this.exibeToast('danger', 'Não foi possível carregar os clientes');
        }
        this.loadingController.dismiss();
      }, err => {
        this.exibeToast('danger', err);
        this.loadingController.dismiss();
      });

    })
  }

  listaFuncionarios() {

    this.exibeLoader().then(() => {
      this.clientes$ = this.crud.obtemInformacao('/funcionarios/listaFuncionario.php');
      
      this.subscriptionAtendentes = this.atendentes$.subscribe((atendentes) => {
        if (atendentes) {
          this.dadosAtendentes = atendentes;
        } else {
          this.exibeToast('danger', 'Não foi possível carregar os atendentes');
        }
        this.loadingController.dismiss();
      }, err => {
        this.exibeToast('danger', err);
        this.loadingController.dismiss();
      });

    })
  }

  carregaEquipamentoCliente() {
    let id_cliente = this.formCadastroOrdemServico.controls['id_cliente'].value;

    if (id_cliente !== '') {
      this.exibeLoader().then(() => {

        this.equipamentosCliente$ = this.crud.obtemInformacaoEspecifica('/equipamentos/listaEquipamentosCliente.php', id_cliente);

        this.subscriptionEquipamentos = this.equipamentosCliente$.subscribe((equipamentos) => {
          this.dadosEquipamentos = equipamentos;
          this.loadingController.dismiss();
          console.log(this.dadosEquipamentos);
          if (this.dadosEquipamentos.length === 0) {
            this.exibeToast('warning', 'Não foram encontrados equipamentos para esse cliente');
          }
        }, err => {
          this.exibeToast('danger', err);
          this.loadingController.dismiss();
        })
      })
    }
  }

  exibeCamposParaCadastro() {
    let id_equipamento = this.formCadastroOrdemServico.controls['id_cliente'].value;

    if (id_equipamento !== '') {
      this.exibeLoader().then(() => {

        this.atendentes$ = this.crud.obtemInformacao('/funcionarios/listaFuncionario.php');

        this.subscriptionAtendentes = this.atendentes$.subscribe((atendentes) => {
          this.dadosAtendentes = atendentes;
          this.loadingController.dismiss();
          if (this.dadosAtendentes.length === 0) {
            this.exibeToast('warning', 'Você precisa cadastrar um funcionário, pelo menos. Vá em funcionários.');
          }
        }, err => {
          this.exibeToast('danger', err);
          this.loadingController.dismiss();
        })
      })
    }
  }

  cadastra() {
    this.ordemServico = this.formCadastroOrdemServico.value;

    this.exibeLoader().then(() => {
      this.crud.adicionaInformacao('/ordemServico/cadastraOrdemServico.php', this.ordemServico).subscribe((res) => {
        if(res) {
          this.exibeToast('success', 'Ordem de serviço cadastrada com sucesso');
          this.loadingController.dismiss();
          this.router.navigateByUrl('/menu/ordemServico/ordensAbertas');
        }
      }, err => {
        this.exibeToast('danger', err);
        this.loadingController.dismiss();
      })
    })
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

  ngOnDestroy(): void {
    this.subscriptionClientes.unsubscribe();
    if (this.subscriptionEquipamentos) {
      this.subscriptionEquipamentos.unsubscribe();
    }
  }

}
