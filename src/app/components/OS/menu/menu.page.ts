import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController } from '@ionic/angular';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  public menus = [
    { title: 'Ordem de Serviço', description: 'Cadastre, altere e exclua ordens de serviço', url: 'ordemServico', icon: 'clipboard' },
    { title: 'Clientes', description: 'Cadastre, altere e exclua clientes', url: 'clientes', icon: 'people' },
    { title: 'Materiais', description: 'Cadastre, altere e exclua materiais', url: 'materiais', icon: 'hardware-chip' },
    { title: 'Funcionários', description: 'Cadastre, altere e exclua funcionários', url: 'funcionarios', icon: 'man' },
    { title: 'Configuração', description: 'Altere as configurações do sistema', url: 'configuracao', icon: 'build' },
    
  ];

  constructor(
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.menuCtrl.enable(true);
  }

}
