import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { SerieProvider } from '../../../providers/serie/serie';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component({
  selector: 'page-historico',
  templateUrl: 'historico.html'
})

export class HistoricoPage {

  public token: any;
  public historico: any;
  public loginForm: any;
  public os: any;
  public serie: any;
  public offline: boolean;

  ionViewDidEnter() {
    //Testar conexão do celular
    if (navigator.onLine) {
     this.offline = false;
     //console.log('Estamos On-line! Valor do offline: ' + this.offline);
     this.retornarHistorico();
   } else {
     this.offline = true;
     //console.log('Estamos Off-line! Valor do offline: ' + this.offline);
     this.alertCtrl.create({
       title: 'Erro de conexão.',
       subTitle: 'Não foi possível conectar ao servidor, verifique sua conexão e tente novamente mais tarde.',
       buttons: [
         { text: 'OK' }
       ]
     }).present();
     this.navCtrl.setRoot("SobrePage");
   }
   }
 

  constructor(public nativeStorage: NativeStorage, public navCtrl: NavController,
    public serieService: SerieProvider, public navParams: NavParams, private alertCtrl: AlertController) {

    this.nativeStorage.getItem('usuario').then(
      data => { this.token = JSON.parse(data).token },
      error => console.log(error + ' - Chave não registrada!')
    );

    //Retornar OS quando a chamada vem da tela info-os
    if (!(this.navParams.get('os') === undefined)) {
      
      this.serie = this.navParams.get('os').SERIE;
      console.log('Inicio do if: '+this.serie);
    } else {
      this.serie = '';
      console.log('Inicio do else: '+this.serie);
    }

  };

  retornarHistorico() {
    if(this.serie){
      
      this.serieService.historico(this.token, this.serie)
        .then(data => {
          this.historico = data;
        });
    }
    
  };
}