import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Material } from 'src/app/shared/material';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss'],
})
export class ModalInfoComponent implements OnInit {

  @Input('material') material: Material = null;

  constructor(private modal: ModalController) { }

  ngOnInit() {
  }

  fechaModal() {
    this.modal.dismiss(null, 'cancel');
  }

}
