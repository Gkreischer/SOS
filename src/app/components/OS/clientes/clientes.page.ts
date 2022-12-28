import { Component } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Cliente } from 'src/app/shared/cliente';
import { ModalAdicionaComponent } from './modal-adiciona/modal-adiciona.component';
import { ModalEditComponent } from './modal-edit/modal-edit.component';
import { ModalInfoComponent } from './modal-info/modal-info.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage {

  cliente$: Observable<Cliente[]> = null;
  dadosCliente: Cliente[] = null;
  dadosClienteFiltrado: Cliente[] = null;
  subscription: Subscription;

  constructor(private crud: CrudService,
    private modalController: ModalController,
    private toastController: ToastController,
    private loadingService: LoadingService
  ) { }

  ionViewWillEnter() {
    this.loadingService.present().then(() => {
      this.listaClientes();
    })
      .finally(() => {
        this.loadingService.dismiss();
      })
  }

  listaClientes() {
    this.cliente$ = this.crud.obtemInformacao('/clientes/listaCliente.php');

    this.subscription = this.cliente$.subscribe((data) => {
      if (data) {
        this.dadosCliente = data;
        // TO PRESERVE ORIGINAL ARRAY ON SEARCH INPUT
        this.dadosClienteFiltrado = this.dadosCliente;
      }
    }, err => {
      this.exibeToast('danger', err);
    })
  }

  pesquisaCliente(event) {
    const clientePesquisado = event.target.value;
    if (clientePesquisado.length !== 0) {
      this.dadosClienteFiltrado = this.dadosCliente.filter((cliente) => {
        return (
          cliente.nome.toLowerCase().includes(clientePesquisado.toLowerCase()) ||
          (cliente.razao_social != '' && cliente.razao_social != null && cliente.razao_social.includes(clientePesquisado)) ||
          (cliente.cpf != '' && cliente.cpf != null && cliente.cpf.includes(clientePesquisado)) ||
          (cliente.cnpj != '' && cliente.cnpj != null && cliente.cnpj.includes(clientePesquisado))
        );
      })
    } else {
      this.dadosClienteFiltrado = [...this.dadosCliente];
    }
  }
  // TOAST
  async exibeToast(color: string, message: string) {

    const toast = await this.toastController.create({
      color: color,
      message: message,
      duration: 30000,
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

  // MODAL CADASTRO
  async exibeModalCadastro() {

    const modal = await this.modalController.create({
      component: ModalAdicionaComponent,
      backdropDismiss: false
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.listaClientes();
    }
  }

  // MODAL EDIT
  async exibeModalEdit(event) {

    const target = event.target || event.currentTarget || event.srcElement;
    const id = target.attributes.id.value;

    const clienteSelecionado = this.dadosCliente.find((cliente) => {
      return cliente.id === id;
    });

    const modal = await this.modalController.create({
      component: ModalEditComponent,
      componentProps: { cliente: clienteSelecionado },
      backdropDismiss: false
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.listaClientes();
    }
  }

  // MODAL INFO
  async exibeModalInfo(event) {

    const target = event.target || event.currentTarget || event.srcElement;
    const id = target.attributes.id.value;

    const clienteSelecionado = this.dadosCliente.find((cliente) => {
      return cliente.id === id;
    });

    const modal = await this.modalController.create({
      component: ModalInfoComponent,
      componentProps: { cliente: clienteSelecionado },
      backdropDismiss: false
    });

    await modal.present();
  }

}
