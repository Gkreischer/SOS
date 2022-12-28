import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Material } from 'src/app/shared/material';
import { OrdemServico } from 'src/app/shared/ordemServico';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss'],
})
export class ModalInfoComponent implements OnInit, OnDestroy {

  @Input('ordemServico') ordemServico: OrdemServico = null;
  id_ordem_servico: number = null;
  dadosOrdemServico: OrdemServico = null;
  subscriptionOrdemServico: Subscription;

  materiais$: Observable<Material[]> = null;
  dadosMateriais: Material[] = null;

  subscriptionMateriais: Subscription;

  formEntregaOrdemServico: FormGroup;

  constructor(
    private loadingService: LoadingService,
    private crud: CrudService,
    private toastController: ToastController,
    private modalController: ModalController,
    private fb: FormBuilder,
    private alertController: AlertController
  ) { }

  ngOnInit(): void {
    this.id_ordem_servico = +this.ordemServico.id;
    this.montaForm();
  }

  ionViewWillEnter() {
    this.loadingService.present().then(() => {
      this.carregaOrdemServico();
      this.buscaMaterial();
    })
      .finally(() => {
        this.loadingService.dismiss();
      })
  }

  carregaOrdemServico() {
    this.subscriptionOrdemServico = this.crud.obtemInformacaoEspecifica('/ordemServico/buscaOrdemEspecifica.php', this.id_ordem_servico).subscribe((ordemServico) => {
      if (ordemServico) {
        this.dadosOrdemServico = ordemServico[0];
        this.formEntregaOrdemServico.patchValue(this.dadosOrdemServico);
        console.log(this.dadosOrdemServico);
      } else {
        this.exibeToast('danger', 'Ordem de serviço não pode ser carregada');
      }
    }, err => {
      this.exibeToast('danger', err);
    });
  }

  async buscaMaterial() {
    this.materiais$ = this.crud.obtemInformacaoEspecifica('/materialOs/buscaMaterial.php', this.id_ordem_servico);

    this.subscriptionMateriais = this.materiais$.subscribe((materiais) => {
      if (materiais.length > 0) {
        this.dadosMateriais = materiais;
        console.log(this.dadosMateriais);
      } else {
        this.exibeToast('warning', 'Sem materiais cadastrados nesse orçamento');
      }
    }, err => {
      this.exibeToast('danger', err);
    })
  }

  async montaForm() {
    this.formEntregaOrdemServico = this.fb.group({
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
      desconto: null,
    });
  }

  entrega() {
    this.exibeAlert('Você deseja entregar a ordem de serviço? ATENÇÃO: não será possível reverter').then((res) => {
      if (!res) {
        return;
      }
      this.formEntregaOrdemServico.get('entregue').patchValue(1);
      this.loadingService.present().then(() => {
        this.crud.atualizaInformacao('/ordemServico/entregaOrdemServico.php', {ordemServico: this.formEntregaOrdemServico.value, id: this.id_ordem_servico}).subscribe((res) => {
          console.log(res);
          this.exibeToast('success', 'Ordem foi entregue com sucesso');
        }, err => {
          this.exibeToast('danger', err);
        })
      })
        .finally(() => {
          this.loadingService.dismiss();
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
  }

}
