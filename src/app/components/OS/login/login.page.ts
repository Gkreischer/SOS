import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController, NavController, ToastController } from '@ionic/angular';
import { CrudService } from 'src/app/services/crud.service';
import { Configuracao } from 'src/app/shared/configuracao';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  dadosLoja: Configuracao = null;
  formLogin: FormGroup = null;

  constructor(
    private menuController: MenuController,
    private loadingController: LoadingController,
    private crud: CrudService,
    private toastController: ToastController,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.menuController.enable(false);
    this.montaForm();
  }

  async login() {
    this.exibeLoader().then(() => {
      this.crud.adicionaInformacao('/login/login.php', this.formLogin.value).subscribe((res) => {
        if(res) {
          console.log(res);
          this.loadingController.dismiss();
          this.router.navigateByUrl("/menu");
          sessionStorage.setItem('id', res[0]);
          sessionStorage.setItem('token', res[1]);
          sessionStorage.setItem('nivel', res[2]);
        } else {
          this.exibeToast('warning', 'Não foi possível logar. Verifique seus dados.');
          this.loadingController.dismiss();
        }
      }, err => {
        console.error(err);
        this.exibeToast('danger', err);
        this.loadingController.dismiss();
      });
    })
  }

  montaForm() {
    this.formLogin = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      senha: [null, [Validators.required, Validators.minLength(8)]]
    });
  }

  get formControls() {
    return this.formLogin.controls;
  }

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
}
