import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class AgendaLocalProvider {

  constructor(private storage: Storage, public loadingCtrl: LoadingController) { }

  public insert(os) {
    os.salva = false;
    os.off = true;
    let key = os.NUMOS;
    return this.storage.set(key, os);
  }

  public update(os, atendimento) {
    //let promise = this.storage.set(os.NUMOS, os);
    //return Observable.fromPromise(promise);
    os.atendimento = atendimento;
    return this.storage.set(os.NUMOS, os);
  }

  public remove(os) {
    return this.storage.remove(os.NUMOS);
  }

  public select(chave) {
    return this.storage.get(chave);
  }

  public getAll() {

    let oss: agendaLocal[] = [];

    let loading = this.loadingCtrl.create({
      spinner: null,
      content: 'Carregando agenda...'
    });

  
      loading.present();
    

    return this.storage.forEach((value: Os, key: string, iterationNumber: Number) => {
      let os = new agendaLocal();
      if (value.salva == false) {
        os.key = key;
        os.os = value;
        oss.push(os);
        //console.log(oss);
      }

    })
      .then(() => {
        loading.dismiss();
        return Promise.resolve(oss);
      })
      .catch((error) => {
        loading.dismiss();
        return Promise.reject(error);
      });
  }

  public getPendentes() {

    let oss: agendaLocal[] = [];

    let loading = this.loadingCtrl.create({
      spinner: null,
      content: "Configurando parâmetros locais..."
    });

      loading.present();
    

    return this.storage.forEach((value: Os, key: string, iterationNumber: Number) => {
      let os = new agendaLocal();
      if (value.salva == true) {
        os.key = key;
        os.os = value;
        oss.push(os);
      }

    })
      .then(() => {
        loading.dismiss();
        return Promise.resolve(oss);
      })
      .catch((error) => {
        loading.dismiss();
        return Promise.reject(error);
      });
  }

}

export class Os {
  salva: boolean;
}

export class agendaLocal {
  key: string;
  os: Os;
}