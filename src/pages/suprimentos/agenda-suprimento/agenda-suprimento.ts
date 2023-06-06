import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { OsProvider } from '../../../providers/os/os';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@IonicPage()
@Component({
  selector: 'page-agenda-suprimento',
  templateUrl: 'agenda-suprimento.html',
})

export class AgendaSuprimentoPage {

  public token: any;
  public usuario: any;
  public codusu: any;
  public agendaSuprimento: any;
  public offline: boolean;


  constructor(public nativeStorage: NativeStorage, private alertCtrl: AlertController,
    public navCtrl: NavController, public osProvider: OsProvider, private barcodeScanner: BarcodeScanner) {
    //this.retornaUsuario();
  }

  ionViewDidLoad() {
//Testar conexão do celular
if (navigator.onLine) {
  this.offline = false;
  //console.log('Estamos On-line! Valor do offline: ' + this.offline);
  this.retornaUsuario();
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

  retornaAgendaSuprimento(callback) {

    //return new Promise(function (resolve, reject) {
    this.osProvider.agendaSuprimento(this.token, this.codusu)
      .then(data => {

        if (data == '') {
          this.alertCtrl.create({
            title: 'Não encontramos pedidos de suprimentos para você.',
            subTitle: 'Se existe alguma divergência, entre em contato com a sua supervisão.',
            buttons: [
              { text: 'OK' }
            ]
          }).present();
        }
        this.agendaSuprimento = data;
        callback();
      });
    //})
  };

  buscarCodigoBarras(){
    


    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.retornaAgendaSuprimento(() => {

        var valor = barcodeData.text;
  
        //RETORNA SE ESTIVER VAZIO
        if (!valor) return;
  
        this.agendaSuprimento = this.agendaSuprimento.filter((resultado) => {
          return resultado.NUNOTA == valor;
        });
  
      })
     }).catch(err => {
         console.log('Error', err);
     });
  }

  retornaUsuario() {

    this.nativeStorage.getItem('usuario')
      .then(
        data => {

          this.token = JSON.parse(data).token;
          this.usuario = JSON.parse(data).nomeusu;
          this.codusu = JSON.parse(data).codusu;

          this.retornaAgendaSuprimento(() => { });
        },
        error => this.token = (error + ' - Chave não registrada!')
      );
  };

  abrirInfoPedido(pedido) {
    this.navCtrl.push("InfoSuprimentoPage", { pedido: pedido });
  }

  doRefresh(refresher): void {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      this.retornaAgendaSuprimento(() => { });
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }



  atualizaAgenda(searchbar) {
    // Reset items back to all of the items
    this.retornaAgendaSuprimento(() => {

      var valor = searchbar.srcElement.value;

      //RETORNA SE ESTIVER VAZIO
      if (!valor) return;

      this.agendaSuprimento = this.agendaSuprimento.filter((resultado) => {
        return resultado.NUNOTA == valor;
      });

    })

  }
}
