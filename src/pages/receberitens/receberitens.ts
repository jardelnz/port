import { Component } from '@angular/core';
import { NavController, Platform, NavParams, IonicPage, AlertController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { OsProvider } from '../../providers/os/os';

@IonicPage()

@Component({
  selector: 'page-receberitens',
  templateUrl: 'receberitens.html',
})

export class ReceberitensPage {

  public token: any;
  public usuario: any;
  public codusu: any;
  public linhas: any
  public nunota: any;


  constructor(public nativeStorage: NativeStorage, public platform: Platform,
    public navCtrl: NavController, public navParams: NavParams,
    public osProvider: OsProvider, private alertCtrl: AlertController) {
    platform.ready().then(() => {

      this.nunota = this.navParams.get('linha');

    });

    this.retornaUsuario();
  }

  ionViewDidEnter() {
    this.retornaNunota();
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

  retornaNunota() {
    this.osProvider.retornaNunotas(this.token, this.codusu)
      .then(data => {
        this.linhas = data;
        if (data == '') {
          this.alertCtrl.create({
            title: 'Você não possui itens para receber!',
            subTitle: 'Se existe alguma divergência, entre em contato com a sua supervisão.',
            buttons: [
              { text: 'OK' }
            ]
          }).present();
          
          this.navCtrl.setRoot("EstoquePage");
        }
      });
  };

  detalharNota(nunota) {
    this.navCtrl.push("DetalhaNunotaPage", { nunota: nunota });
  }
}