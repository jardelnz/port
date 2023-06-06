import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams, AlertController,
  Platform, ActionSheetController, ModalController
} from 'ionic-angular';
import { OsProvider } from '../../../providers/os/os';
import { NativeStorage } from '@ionic-native/native-storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@IonicPage()

@Component({
  selector: 'page-concluir-os',
  templateUrl: 'concluir-os.html',
})

export class ConcluirOsPage {

  public os: any;
  public token: any;
  public codusu: any;
  public numos: any;
  public numitem: any;
  public dataExecucao: String = new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });

  public horaInicial: String = new Date().toLocaleTimeString("pt-BR",
    { timeZone: "America/Sao_Paulo", hour: "numeric", minute: "numeric" });

  public horaFinal: String = new Date().toLocaleTimeString("pt-BR",
    { timeZone: "America/Sao_Paulo", hour: "numeric", minute: "numeric" });

  public enderecoCorreto: any;
  public novoEndereco: any;
  public causas: any;
  public medpb: any;
  public medcor: any;
  public statusEquip: any;
  public preventiva: any;
  public consumoestoque: any;
  public solucao: any;
  public otimizarToner: any;
  public configurarDuplex: any;
  public justificarOtimizacaoToner: any;
  public duplex: any;
  public nomeCliente: any;
  public matricula: any;
  public email: any;
  public telefone: any;
  public hideMe: boolean = true;
  public novoEnd: boolean = true;
  public exibirConfigurarDuplex: boolean = false;
  public controleBotao = false;
  public bloquear = false;
  public listagem: any;


  constructor(public nativeStorage: NativeStorage, public alertCtrl: AlertController,
    public navCtrl: NavController, public navParams: NavParams, public platform: Platform,
    public osProvider: OsProvider, public geolocation: Geolocation, public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController) {

    platform.ready().then(() => {

      this.os = this.navParams.get('os');

      if (this.os.CODSERV == '14') {
        this.bloquear = true;
      }

      if (this.os.AD_COMPAPEL == 'N') {
        this.exibirConfigurarDuplex = true;
      }
      //this.retornaUsuario();

      this.numos = this.os.NUMOS;
      this.numitem = this.os.NUMITEM;

    });

  }
/*
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

          //this.navCtrl.push("EstoquePage");
        }
      });
  };

  esconderJustificativa() {
    this.hideMe = true;
  }

  exibirJustificativa() {
    this.hideMe = false;
  }

  esconderNovoEndereco() {
    this.novoEnd = true;
  }

  exibirNovoEndereco() {
    this.novoEnd = false;
  }


  desabilitarBotao(statusEquip) {
    if (statusEquip == 'F' || statusEquip == 'I') {
      this.controleBotao = true;
    } else {
      this.controleBotao = false;
    }
  }

  concluirSemPendencia() {
    if (this.verificarPreenchimento(true, true, true, true, true, true, true, true, true)) {
      this.showConfirm('Concluir', 'Deseja fechar a OS sem pendência?', 9)
    };
  }

  concluirComPendencia() {
    if (this.verificarPreenchimento(true, true, true, true, true, true, true, true, true)) {
      this.showConfirm('Concluir', 'Deseja fechar a OS com pendência?', 10)
    };
  }

  atendimentNaoRealizado() {
    if (this.verificarPreenchimento(true, true, true, false, false, false, false, true, false)) {
      this.showConfirm('Concluir', 'Não foi possível realizar o atendimento?', 14)
    };
  }

  verificarPreenchimento(a, b, c, d, e, f, g, h, i) {

    if (this.horaInicial > this.horaFinal) {
      this.showErro('Hora Inicial está maior que a hora final.');
    }

    if (this.enderecoCorreto == 'N' && !this.novoEndereco) {
      this.showErro('Por favor, preencha o novo endereço.');
      return false;
    }

    if (!this.nomeCliente || !this.matricula || !this.email || !this.telefone) {
      this.showAlert('Preencha todos os campos de contato do cliente.');
      return false;
    }

    if (!this.dataExecucao && a) {
      this.showAlert('Preencha a data do atendimento.');
      return false;
    }
    if (!this.horaInicial && b) {
      this.showAlert('Preencha a hora inicial.');
      return false;
    }
    if (!this.horaFinal && c) {
      this.showAlert('Preencha a hora final.');
      return false;
    }
    if (!this.causas && d) {
      this.showAlert('Selecione ao menos uma motivo do atendimento.');
      return false;
    }

    if (this.os.AD_ULTCONTPB && this.medpb < this.os.AD_ULTCONTPB && e) {
      this.showAlert('O medidor PB não pode ser menor que o último medidor registrado.')
      return false
    }

    if (this.os.AD_ULTCONTCOR && this.medcor < this.os.AD_ULTCONTCOR && f) {
      this.showAlert('O medidor COR não pode ser menor que o último medidor registrado.')
      return false
    }

    if (this.os.AD_ULTCONTDUPLEX && this.duplex < this.os.AD_ULTCONTDUPLEX && i) {
      this.showAlert('O medidor Duplex não pode ser menor que o último medidor registrado.')
      return false
    }

    if (!this.statusEquip && g) {
      this.showAlert('Selecione o status do equipamento.');
      return false;
    }

    if (!this.otimizarToner && i) {
      this.showErro('Você não informou se realizou a otimização do toner.');
      return false;
    }

    if (this.exibirConfigurarDuplex == false && !this.configurarDuplex && i) {
      this.showErro('Você não informou se realizou a configuração duplex.');
      return false;
    }

    if (this.exibirConfigurarDuplex == false && this.configurarDuplex == 'N' && !this.justificarOtimizacaoToner && i) {
      this.showErro('Você não informou a justificativa.');
      return false;
    }

    if (!this.solucao && h) {
      this.showAlert('Descreva o atendimento.');
      return false;
    }

    return true;
  }

  retornaUsuario() {

    return new Promise(resolve => {

      this.nativeStorage.getItem('usuario')
        .then(
          data => {

            this.token = JSON.parse(data).token;
            this.codusu = JSON.parse(data).codusu;
            this.retornaEstoque();
            return resolve(true);
          },
          error =>
            this.token = (error + ' - Chave não registrada!')

        )
    })
  };

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Escolha uma opção',
      buttons: [
        {
          text: 'Concluir atendimento sem pendência',
          role: 'destructive',
          cssClass: '.btnActionSheet',
          handler: () => {
            console.log('Destructive clicked');
            //this.concluirSemPendencia()
          }
        }, {
          text: 'Concluir atendimento com pendência',
          handler: () => {
            console.log('Archive clicked');
          }
        }, {
          text: 'Não foi possível realizar o atendimento',
          //role: 'cancelr',
          handler: () => {
            console.log('Cancel clicked');
          }
        }, {
          text: 'Cancelar',
          // role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  showSucesso(aviso) {
    const alert = this.alertCtrl.create({
      title: 'Atendimento concluído!',
      subTitle: aviso,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            //this.navCtrl.push("AgendaPage");
            this.navCtrl.setRoot("AgendaPage");
          }
        }
      ]
    });
    alert.present();
  }

  showAlert(aviso) {
    const alert = this.alertCtrl.create({
      title: 'Alerta!',
      subTitle: aviso,
      buttons: ['OK']
    });
    alert.present();
  }

  showErro(aviso) {
    const alert = this.alertCtrl.create({
      title: 'Erro!',
      subTitle: aviso,
      buttons: ['OK']
    });
    alert.present();
  }


  showConfirm(titulo, texto, status) {
    if(this.consumoestoque) {
      this.solucao = 'Consumo de estoque: '+this.consumoestoque+" - \n Descrição do atendimento: "+this.solucao;
    }
    const prompt = this.alertCtrl.create({
      title: titulo,
      message: texto,
      buttons: [
        {
          text: 'Não',
          handler: () => {
            //console.log('Não')
            return true;
          }
        }, {
          text: 'Sim',
          handler: () => {
            this.osProvider.atualizaOS(this.token, this.numos, this.numitem, status,
              this.dataExecucao, this.horaInicial, this.horaFinal,
              this.causas, this.medpb, this.medcor, this.duplex, this.nomeCliente, this.matricula, this.email, this.telefone,
              this.statusEquip, this.preventiva, this.consumoestoque, this.solucao, this.otimizarToner,
              this.configurarDuplex, this.justificarOtimizacaoToner, this.novoEndereco)
              .then(
                resultado => {
                  let data = JSON.stringify(resultado);
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
            //console.log('Sim')
            return true;
          }
        }

      ]
    });
    prompt.present();
  }
*/
}