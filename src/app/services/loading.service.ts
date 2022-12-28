import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading = false;
  loaderCounter = 0;
  loading: HTMLIonLoadingElement;

  constructor(public loadingController: LoadingController) { }

  async present() {
    this.loaderCounter = this.loaderCounter + 1;

    if (this.loaderCounter === 1) {
      this.isLoading = true;
      this.loading = await this.loadingController.create({
        message: 'Carregando...'
      });
      await this.loading.present();
    }
  }

  async dismiss() {
    this.loaderCounter = this.loaderCounter - 1;
    if (this.loaderCounter === 0) {
      this.isLoading = false;
      await this.loading.dismiss();
    }
  }
}
