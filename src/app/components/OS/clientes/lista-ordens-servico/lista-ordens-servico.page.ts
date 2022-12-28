import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { OrdemServico } from 'src/app/shared/ordemServico';

@Component({
  selector: 'app-lista-ordens-servico',
  templateUrl: './lista-ordens-servico.page.html',
  styleUrls: ['./lista-ordens-servico.page.scss'],
})
export class ListaOrdensServicoPage implements OnInit, OnDestroy {

  idClienteSubscription: Subscription;
  idCliente: number = null;

  ordensServico$: Observable<OrdemServico[]>;
  dadosOrdensServico: OrdemServico[] = null;
  dadosOrdensServicoFiltrado: OrdemServico[] = null;

  subscriptionOrdemServico: Subscription;

  constructor(
    private route: ActivatedRoute,
    private crud: CrudService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.idClienteSubscription = this.route.params.subscribe((res) => {
      this.idCliente = res['id'];
    })
  }

  ionViewWillEnter() {
    this.consultaOrdensServico();
  }

  consultaOrdensServico() {
    if (this.idCliente) {
      this.exibeLoader().then(() => {
        this.ordensServico$ = this.crud.obtemInformacaoEspecifica('/clientes/listaOrdensServicoCliente.php', this.idCliente);

        this.subscriptionOrdemServico = this.ordensServico$.subscribe((ordensServico) => {
          if (ordensServico) {
            this.dadosOrdensServico = ordensServico;
            this.dadosOrdensServicoFiltrado = ordensServico;
            console.log('ORDENS DE SERVICO DO CLIENTE', ordensServico);
            console.log(this.dadosOrdensServico.length);
            this.loadingController.dismiss();
          } else {
            this.loadingController.dismiss();
            this.exibeToast('danger', 'Não foi possível exibir as ordens de serviço do cliente');
          }
        })
      })
    }
  }

  async pesquisaEquipamentoCategoria(event) {
    const valor_inserido = event.target.value;
    if (valor_inserido.length !== 0) {
      this.dadosOrdensServicoFiltrado = this.dadosOrdensServico.filter((ordemServico) => {
        return (
          ordemServico.equipamento.toLowerCase().includes(valor_inserido.toLowerCase()) ||
          ordemServico.categoria.toLowerCase().includes(valor_inserido.toLowerCase())
        );
      });
    } else {
      this.dadosOrdensServicoFiltrado = [...this.dadosOrdensServico];
    }
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
    this.idClienteSubscription.unsubscribe();
    this.subscriptionOrdemServico.unsubscribe();
  }

}
