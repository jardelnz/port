import { Component } from '@angular/core';
import { NavController, Platform, NavParams, AlertController, IonicPage } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { OsProvider } from '../../../providers/os/os';

@IonicPage()

@Component({
  selector: 'page-detalha-nunota',
  templateUrl: 'detalha-nunota.html',
})
export class DetalhaNunotaPage {

  public token: any;
  public usuario: any;
  public codusu: any;
  public nunota: any;
  public linhas: any;
  public nota: any;
  public estoqueDoTecnico: any;

  constructor(public nativeStorage: NativeStorage, public platform: Platform, public alertCtrl: AlertController,
    public navCtrl: NavController, public navParams: NavParams, public osProvider: OsProvider) {

    platform.ready().then(() => {

      this.nunota = this.navParams.get('nunota');

    });

    this.retornaUsuario();
  }

  ionViewDidEnter() {
    this.detalhaItens();
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


  detalhaItens() {
    this.osProvider.detalhaItens(this.token, this.nunota.NUNOTA)
      .then(data => {
        this.linhas = data;
      });
  };

  showSucesso(aviso) {
    const alert = this.alertCtrl.create({
      title: 'Recebimento concluído!',
      subTitle: aviso,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.setRoot("MeuestoquePage");
        }
      }]
    });
    alert.present();
  }

  showAlert(aviso) {
    const alert = this.alertCtrl.create({
      title: 'Alerta!',
      subTitle: aviso,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.setRoot("MeuestoquePage");
        }
      }]
    });
    alert.present();
  }

  showErro(aviso) {
    const alert = this.alertCtrl.create({
      title: 'Erro!',
      subTitle: aviso,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.setRoot("MeuestoquePage");
        }
      }]
    });
    alert.present();
  }

  receberItens() {
    const prompt = this.alertCtrl.create({
      title: 'Confirmar recebimento',
      message: 'Você confirma o recebimento dos itens da nota ' + this.nunota.NUNOTA + '?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
            console.log('Não')
            return true;
          }
        }, {
          text: 'Sim',
          handler: () => {
            this.osProvider.receberItens(this.token, this.nunota.ESTOQUETECNICO, this.nunota.NUNOTA, this.codusu)
              .then(
                resultado => {
                  let data = JSON.stringify(resultado);
                  console.log(resultado);
                  if (JSON.parse(data).status == 200) {
                    this.showSucesso(JSON.parse(data).mensagem);

                  }
                },
                erro => {
                  let data = JSON.stringify(erro);

                  if (JSON.parse(data).status == 400) {
                    this.showErro(JSON.parse(data).mensagem);
                  }
                })
            console.log('Sim')
            return true;
          }
        }

      ]
    });
    prompt.present();
  }


}
