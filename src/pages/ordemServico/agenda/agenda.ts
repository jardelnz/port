import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, AlertController, LoadingController, ToastController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { OsProvider } from '../../../providers/os/os';
import { AgendaLocalProvider } from '../../../providers/agenda-local/agenda-local';

@IonicPage()
@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html'
})

export class AgendaPage {

  public token: any;
  public usuario: any;
  public codusu: any;
  public agenda: any;
  public agendaFiltro: any;
  public agendaLocal: any;
  public EhLocal: boolean;
  public off = true;
  public arrayDeDados: any;
  public arrayDeSelecionadas: Agenda[] = [];
  public countPendentes: any;
  public offline: boolean;
  public filtroAtivo = false;
  public mensagem: string;

  ionViewDidEnter() {
    this.retornaUsuario();
    this.nativeStorage.getItem('usuario').then(
      data => {
        this.token = JSON.parse(data).token;
        if (navigator.onLine) {
          this.offline = false;
          this.retornaAgenda();
        }

        else {
          this.offline = true;

          this.alertCtrl.create({
            title: 'Sem conexão.',
            subTitle: 'Não foi possível estabelecer comunicação com o servidor, verifique sua conexão e tente novamente.',
            buttons: [
              { text: 'OK' }
            ]
          }).present();
          /*
          //console.log('Estamos Off-line! Valor do offline: ' + this.offline);
          this.agendaLocalProvider.getAll()
            .then((result) => {
              this.agendaLocal = result;
            });
            */
        }

      },
      error => {
        console.log(error + ' - Chave não registrada!');
        this.alertCtrl.create({
          title: 'IMEI não válido.',
          subTitle: 'Por favor, valide seu IMEI para utilizar o aplicativo.',
          buttons: [
            { text: 'OK' }
          ]
        }).present();
        this.navCtrl.setRoot("SobrePage");
      }
    );

  }
  //##Fim do DidEnter

  //##Constructor
  constructor(public nativeStorage: NativeStorage, public platform: Platform, public loadingCtrl: LoadingController,
    public navCtrl: NavController, public osProvider: OsProvider, public agendaLocalProvider: AgendaLocalProvider,
    private alertCtrl: AlertController, private toastCtrl: ToastController, public navParams: NavParams) {
    this.mensagem = this.navParams.get('mensagem');
    this.mensagem ? this.exibeMensagem(this.mensagem) : "";
    //this.retornaQuantidadePendentes();
  }
  //##Fim do Constructor

  /*
  retornaQuantidadePendentes() {
    this.agendaLocalProvider.getPendentes().then((dados) => {
      //console.log('Tamanho do array: ' + dados.length);
    })
  }
  */


  exibeMensagem(mensagem) {
    let toast = this.toastCtrl.create({
      message: mensagem,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }


  retornaAgenda() {
    this.osProvider.agendaTecnico(this.token, this.codusu)
      .then(data => {

        if (data == '' || data == undefined) {
          this.alertCtrl.create({
            title: 'Não encontramos agendamentos para você.',
            subTitle: 'Se existe alguma divergência, entre em contato com a sua supervisão.',
            buttons: [
              { text: 'OK' }
            ]
          }).present();

          // Verifica se tem os com status de salva = true localmente
        }
        this.agenda = data;
      })
  };

  atualizaAgenda(searchbar) {
    this.retornaAgendaFiltro(() => {
      var valor = searchbar.srcElement.value;
      if (!valor) return;
      this.agenda = this.agenda.filter((resultado) => {
        return resultado.SERIE == valor;
      });
    })

  };

  onInput(myInput) {


    if (myInput.target.value == '' || myInput.target.value == undefined) {
      this.filtroAtivo = false;
      this.agendaFiltro = 0;
    } else {

      this.filtroAtivo = true;

      var solid = parseInt(myInput.target.value);
      var arrayPesquisa: any = '';

      for (let os of this.agenda) {

        if (os.NUMOS == solid) {
          arrayPesquisa = os;
        }

      }

      if (arrayPesquisa == '') {
        this.agendaFiltro = 1;
      } else {
        this.agendaFiltro = arrayPesquisa;
      }

    }

  }

  retornaAgendaFiltro(callback) {
    this.osProvider.agendaTecnicoFiltro(this.token, this.codusu)
      .then(data => {
        this.agenda = data;
        callback();
      });
  };

  verificaOsLocal(numos) {
    this.agendaLocalProvider.select(numos).then((dados) => {
      if (dados) {
        this.EhLocal = true;
      }
    });
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

  abrirInfoOS(os, offline) {
    this.navCtrl.setRoot("InfoOsPage", { os: os, offline: offline });
  }


  doRefresh(refresher): void {
    //console.log('Begin async operation', refresher);
    setTimeout(() => {
      this.retornaUsuario();
      //console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

}

export class Os {
  salva: boolean;
}

export class Agenda { }