import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams } from 'ionic-angular';
import { OsProvider } from '../../../providers/os/os';
import { NativeStorage } from '@ionic-native/native-storage';


@IonicPage()
@Component({
  selector: 'page-extrato',
  templateUrl: 'extrato.html',
})
export class ExtratoPage {


  public token: any;
  public usuario: any;
  public codusu: any;
  public listagem: any;


  constructor(public nativeStorage: NativeStorage, public platform: Platform, 
    public navCtrl: NavController, public navParams: NavParams,
    public osProvider: OsProvider) {
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
          this.retornaMovimentacoes();
        },
        error => this.token = (error + ' - Chave não registrada!')
      );
  };

  retornaMovimentacoes() {
    this.osProvider.extrato(this.token, this.codusu)
      .then(data => {
        this.listagem = data;
      });
  };

}
