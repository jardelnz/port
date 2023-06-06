import { Component } from '@angular/core';
import { IonicPage,NavController, NavParams, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { SerieProvider } from '../../../providers/serie/serie';
import { NativeStorage } from '@ionic-native/native-storage';
/* import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx'; */

@IonicPage()
@Component({
  selector: 'page-monitoramento',
  templateUrl: 'monitoramento.html'
})
export class MonitoramentoPage {

  public token: any;
  public monitoramento: any;
  public equipamento: any;
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
    public serieService: SerieProvider, public navParams: NavParams, private alertCtrl: AlertController
   /*  public barcodeScanner: BarcodeScanner */) {

    this.nativeStorage.getItem('usuario').then(
      data => { this.token = JSON.parse(data).token },
      error => console.log(error + ' - Chave não registrada!')
    );

    //Retornar OS quando a chamada vem da tela info-os
    if (!(this.navParams.get('os') === undefined)) {
      this.serie = this.navParams.get('os').SERIE;
    } else {
      this.serie = '';
    }

  };

  retornarHistorico() {

    this.serieService.statusMonitoramento(this.token, this.serie)
      .then(data => {

        this.monitoramento = data;
        this.monitoramento = this.monitoramento.mensagem;
        this.monitoramento = this.monitoramento.filter(obj => {
          return (obj.CounterTypeName === 'General' )
        })
        this.equipamento = this.monitoramento[0]
        /* console.log(this.equipamento) */
      });
  };
}
