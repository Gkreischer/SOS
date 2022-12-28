import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Cliente } from 'src/app/shared/cliente';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss'],
})
export class ModalInfoComponent implements OnInit {

  @Input('cliente') cliente: Cliente;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  fechaModal() {
    this.modalController.dismiss(null, 'cancel');
  }

}
