import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, AlertController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { OsProvider } from '../../../providers/os/os';

@IonicPage()

@Component({
  selector: 'page-estoque',
  templateUrl: 'estoque.html',
})

export class EstoquePage {

  public token: any;
  public usuario: any;
  public codusu: any;
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

    this.retornaUsuario();
  }

  ionViewDidLoad() {
    
  }

  retornaUsuario() {

    this.nativeStorage.getItem('usuario')
      .then(
        data => {

          this.token = JSON.parse(data).token;
          this.usuario = JSON.parse(data).nomeusu;
          this.codusu = JSON.parse(data).codusu;
        },
        error => this.token = (error + ' - Chave não registrada!')
      );
  };

  meuEstoque() {
    this.navCtrl.push("MeuestoquePage", {});
  }

  exibirNunotas() {
    this.navCtrl.push("ReceberitensPage", {});
  }

  meuExtrato(){
    this.navCtrl.push("ExtratoPage", {});
  }

}
