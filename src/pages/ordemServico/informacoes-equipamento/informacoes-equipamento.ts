import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { ModalController } from 'ionic-angular';
import { OsProvider } from '../../../providers/os/os';


@IonicPage()

@Component({
  selector: 'page-informacoes-equipamento',
  templateUrl: 'informacoes-equipamento.html',
})

export class InformacoesEquipamentoPage {

  public os: any;
  public token: any;
  public codusu: any;
  public numos: any;
  public numitem: any;
  public hideMe: boolean = true;
  public exibirConfigurarDuplex: boolean = false;
  public bloquear = false;
  public offline : boolean;
  public subSistemas: any;
  public causas: any;
  public cau: any;
  public sub: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public osProvider: OsProvider,
    public platform: Platform, public nativeStorage: NativeStorage, public alertCtrl: AlertController,
    public modalCtrl: ModalController) {

    this.retornaUsuario();

    platform.ready().then(() => {

      this.os = this.navParams.get('os');

      if (this.os.CODSERV == '14') {
        this.bloquear = true;
      }

      if (navigator.onLine) {
        this.offline = false;
      } else {
        this.offline = true;
      }

      this.retornaUsuario();
      this.numos = this.os.NUMOS;
      this.numitem = this.os.NUMITEM;

    });

  }

  ionViewDidEnter() { 
    this.retornaSubsistemas();
  }

  esconderJustificativa() {
    this.hideMe = true;
  }

  exibirJustificativa() {
    this.hideMe = false;
  }

  retornaUsuario() {
    return new Promise(resolve => {
      this.nativeStorage.getItem('usuario')
        .then(
          data => {
            this.token = JSON.parse(data).token;
            this.codusu = JSON.parse(data).codusu;
            return resolve(true);
          },
          error =>
            this.token = (error + ' - Chave não registrada!')
        )
    })
  };

  retornaSubsistemas() {
    return new Promise(resolve => {
      this.osProvider.retornaSubsistema(this.token)
        .then(
          data => {
            this.subSistemas = data;
            return resolve(true);
          },
          error =>
            console.log(error)
        )
    })
  }

  retornaCausas(subsistemas) {
    return new Promise(resolve => {
      this.osProvider.retornaCausas(this.token, subsistemas)
        .then(
          data => {
            this.causas = data;
            return resolve(true);
          },
          error =>
            console.log(error)
        )
    })
  }

  showAlert(aviso) {
    const alert = this.alertCtrl.create({
      title: 'Alerta!',
      subTitle: aviso,
      buttons: ['OK']
    });
    alert.present();
  }

  avancaCadastro(cau, statusEquip, preventiva, otimizarToner,
    configurarDuplex, justificarOtimizacaoToner, teveConsumo, solucao) {

      console.log('Preventiva: '+ preventiva);

      if(preventiva == undefined){
        preventiva = 'N';
      }
    
    if(this.offline == false && (cau == undefined || !cau)){
      this.showAlert('É necessário informar subsistema(s) e causa(s)!');
      return false;
    }

    if (statusEquip == undefined || otimizarToner == undefined || configurarDuplex == undefined
      || teveConsumo == undefined) {
      this.showAlert('Preencha todos os campos');
      return false;
    }

    if ((configurarDuplex == 'N' && justificarOtimizacaoToner == undefined) || (configurarDuplex == 'N' && justificarOtimizacaoToner == '')) {
      this.showAlert('Informe a justificativa para não configurar a impressão duplex.');
      return false;
    }

    if (solucao == '') {
      this.showAlert('Preencha todos os campos');
      return false;
    }

    if (teveConsumo == 'S') {

      //this.os.causas = causas;
      this.os.statusEquip = statusEquip;
      this.os.AD_CONSUMOESTOQUE = teveConsumo;
      this.os.AD_PREVENTIVA = preventiva;
      this.os.AD_OTIMIZACAO_TONER = otimizarToner;
      this.os.AD_CONF_DUPLEX = configurarDuplex;
      this.os.AD_MOTIVO_CONF_DUPLEX = justificarOtimizacaoToner;
      this.os.Subsistemas = this.sub;
      this.os.SubCausas = this.cau;

      if (this.offline == true) {
        this.navCtrl.push("InformacoesFinaisPage", {
          os: this.os
        });
      } else {
        this.navCtrl.push("InformacoesConsumoPage", {
          os: this.os
        });
      }

    } else {

      //this.os.causas = causas;
      this.os.statusEquip = statusEquip;
      this.os.AD_CONSUMOESTOQUE = teveConsumo;
      this.os.AD_PREVENTIVA = preventiva;
      this.os.AD_OTIMIZACAO_TONER = otimizarToner;
      this.os.AD_CONF_DUPLEX = configurarDuplex;
      this.os.AD_MOTIVO_CONF_DUPLEX = justificarOtimizacaoToner;
      this.os.Subsistemas = this.sub;
      this.os.SubCausas = this.cau;

      this.navCtrl.push("InformacoesFinaisPage", {
        os: this.os
      });

    }
  }
  
}