import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, AlertController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { OsProvider } from '../../../providers/os/os';


@IonicPage()
@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html'
})
export class AgendaFuturaPage {

  public token: any;
  public usuario: any;
  public codusu: any;
  public agenda: any;
  public offline: boolean;

  ionViewDidEnter() {
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

  constructor(public nativeStorage: NativeStorage, public platform: Platform,
    public navCtrl: NavController, public osProvider: OsProvider, private alertCtrl: AlertController) {

  }

  retornaAgenda() {
    this.osProvider.agendaFuturaTecnico(this.token, this.codusu)
      .then(data => {
        this.agenda = data;
        if (data == '') {
          this.alertCtrl.create({
            title: 'Não encontramos agendamentos para você.',
            buttons: [
              { text: 'OK' }
            ]
          }).present();

          //this.navCtrl.setRoot("AgendaPage");
        }
      });
  };

  retornaUsuario() {

    this.nativeStorage.getItem('usuario')
      .then(
        data => {

          this.token = JSON.parse(data).token;
          this.usuario = JSON.parse(data).nomeusu;
          this.codusu = JSON.parse(data).codusu;

          this.retornaAgenda();
        },
        error => this.token = (error + ' - Chave não registrada!')
      );
    //Validar Token
    if (this.token == '') {
      this.alertCtrl.create({
        title: 'IMEI não válido.',
        subTitle: 'Por favor, valide seu IMEI para utilizar o aplicativo.',
        buttons: [
          { text: 'OK' }
        ]
      }).present();

      this.navCtrl.setRoot("SobrePage");
    }
  };

  abrirInfoOS(os) {
    this.navCtrl.push("InfoOsPage", { os: os });
  }

  doRefresh(refresher): void {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      this.retornaAgenda();
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

}