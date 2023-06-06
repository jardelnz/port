import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Config } from '../../config/config'
import { LoadingController } from 'ionic-angular';


@Injectable()
export class UsuarioProvider {

  constructor(public http: Http, private httpcliente: HttpClient, public config: Config,
    public loadingCtrl: LoadingController) {


  }

  registraDispositivo(imei) {

    let loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });

    loading.present();

    return new Promise((resolve, reject) => {

      //let headers = new Headers({ 'Content-Type': 'application/json' ,'codigo':codigo});
      //let options = new RequestOptions({ headers: headers });
      //console.log(imei);

      this.http.get(this.config.urlApi() + "/usuario/autenticar/" + imei + "")
        .map(res => res.json()).finally(
          () => {
            loading.dismiss();
          }
        )
        .subscribe(
          data => {
            //console.log('Retorno do usuário: '+ data);
            resolve(data);
          },
          err => {
            reject(err);
          })
    });
  }

  validarDispositivo(imei) {

    let loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });

    loading.present();

    return new Promise((resolve, reject) => {

      //let headers = new Headers({ 'Content-Type': 'application/json' ,'codigo':codigo});
      //let options = new RequestOptions({ headers: headers });
      //console.log(imei);

      this.http.get(this.config.urlApi() + "/usuario/validar/" + imei + "&1.7.8")
        .map(res => res.json()).finally(
          () => {
            loading.dismiss();
          }
        )
        .subscribe(
          data => {
            //console.log('Retorno do usuário: '+ data);
            resolve(data);
          },
          err => {
            reject(err);
          })
    });
  }

  verificaVersao(): Promise<any> {
    let token = this.config.tokenA;
    const body = { "token": token };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.httpcliente.put(this.config.urlApi() + "/usuario/versao", body, httpOptions)
      .toPromise();
  }



}