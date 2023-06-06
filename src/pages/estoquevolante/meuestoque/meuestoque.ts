import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, AlertController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { OsProvider } from '../../../providers/os/os';

@IonicPage()

@Component({
  selector: 'page-meuestoque',
  templateUrl: 'meuestoque.html',
})

export class MeuestoquePage {

  public token: any;
  public usuario: any;
  public codusu: any;
  public listagem: any;

  constructor(public nativeStorage: NativeStorage, public platform: Platform,
    public navCtrl: NavController, public osProvider: OsProvider, private alertCtrl: AlertController) {

    this.retornaUsuario();

  }

  ionViewDidEnter() {
    this.retornaEstoque();
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

  retornaEstoque() {
    this.osProvider.estoqueTecnico(this.token, this.codusu)
      .then(data => {
        this.listagem = data;
        if (data == '') {
          this.alertCtrl.create({
            title: 'Você não possui itens no estoque.',
            subTitle: 'Verifique na opção de receber itens para verificar se possui itens para receber.',
            buttons: [
              { text: 'OK' }
            ]
          }).present();

          this.navCtrl.setRoot("EstoquePage");
        }
      });
  };

}
