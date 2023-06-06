import { Component } from '@angular/core';
import { IonicPage, NavController, 
  NavParams, Platform, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AgendaLocalProvider } from '../../../providers/agenda-local/agenda-local';
import { OsProvider } from '../../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-informacoes-iniciais',
  templateUrl: 'informacoes-iniciais.html',
})

export class InformacoesIniciaisPage {

  public os: any;
  public token: any;
  public codusu: any;
  public numos: any;
  public numitem: any;
  public enderecoCorreto: any;
  public novoEndereco: any;
  public photo: any;
  public medpb: any;
  public controleCamera = false;

  public horaInicial: String = new Date().toLocaleTimeString("pt-BR",
    { timeZone: "America/Sao_Paulo", hour: "numeric", minute: "numeric" });

  public horaFinal: String = new Date().toLocaleTimeString("pt-BR",
    { timeZone: "America/Sao_Paulo", hour: "numeric", minute: "numeric" });

  public controleBotao = false;
  public novoEnd: boolean = true;
  public bloquear = false;

  constructor(public navCtrl: NavController, public _camera: Camera,
    public navParams: NavParams, public platform: Platform, private osProvider: OsProvider,
    public nativeStorage: NativeStorage, public agendaLocal: AgendaLocalProvider,
    public alertCtrl: AlertController, private _loadingCtrl: LoadingController, private _toast: ToastController) {

    platform.ready().then(() => {
      this.os = this.navParams.get('os');

      if (this.os.CODSERV == '14') {
        this.bloquear = true;
      }

      this.retornaUsuario();
      this.numos = this.os.NUMOS;
      this.numitem = this.os.NUMITEM;
    });
  }

  tiraFoto() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this._camera.DestinationType.DATA_URL,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE
    }

    let load = this._loadingCtrl.create({
      content: 'Salvando imagem na nuvem...'
    });

    this._camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      load.present();
      this.osProvider.enviarFoto(this.token, this.os, base64Image, this.os.NUMOS+"/"+this.os.NUMITEM+' antes')
        .then((resultado) => {

          let toast = this._toast.create({
            message: JSON.parse(JSON.stringify(resultado)).mensagem,
            duration: 3000,
            position: 'top'
          });
          load.dismiss();
          toast.present();
          this.controleCamera = true;

        }).catch(err => {
          load.dismiss();
          let toast = this._toast.create({
            message: err,
            duration: 3000,
            position: 'top'
          });

          toast.present();
        })
    }

    ), (err) => {
      this.showAlert('Não foi possível capturar a imagem, tente novamente mais tarde.');
      return false;
    }

  };

  esconderNovoEndereco() {
    this.novoEnd = true;
  }

  exibirNovoEndereco() {
    this.novoEnd = false;
  }

  showAlert(aviso) {
    const alert = this.alertCtrl.create({
      title: 'Alerta!',
      subTitle: aviso,
      buttons: ['OK']
    });
    alert.present();
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

  ajustarCampo(campo) {
    if (campo == undefined) {
      campo = '';
    }
    return campo;
  }

  validaContador(contador) {
    if (contador == undefined || contador == '') {
      console.log('Contador para validação: ' + contador);
    } else {
      var regra = /^[0-9]+$/;
      if (contador.match(regra)) {
        return true;
      } else {
        return false;
      }
    }
  }

  avancaCadastro(dataExecucao, horaInicial, horaFinal, medpb, medcor, duplex, enderecoCorreto, novoEndereco, departamento, complemento) {

      console.log('Contador da OS ->');
      console.log('PB: '    + this.os.AD_ULTCONTPB);
      console.log('Cor: '   + this.os.AD_ULTCONTCOR);
      console.log('Duplex ' + this.os.AD_ULTCONTDUPLEX);
      console.log('Total: ' + this.os.AD_ULTCONTTOTAL);

      console.log('Contador do App ->');
      console.log('PB: '      + medpb);
      console.log('Cor: '     + medcor);
      console.log('Duplex: '  + duplex);
    

    if (medpb < 0 || medcor < 0 || duplex < 0) {
      this.showAlert('O medidor não pode ser negativo.');
      return false;
    }

    if (this.os.AD_ULTCONTPB != '') {
      if (medpb == '' || medpb == undefined) {
        this.showAlert('O medidor PB não pode ser vazio.');
        return false;
      }
    }

    if (this.validaContador(medpb) == false) {
      this.showAlert('Preencha o contador apenas com números!');
      return false;
    }

    if (this.validaContador(medcor) == false) {
      this.showAlert('Preencha o contador apenas com números!');
      return false;
    }

    if (this.validaContador(duplex) == false) {
      this.showAlert('Preencha o contador apenas com números!');
      return false;
    }

    if (this.os.AD_ULTCONTCOR != '') {
      if (medcor == '' || medcor == undefined) {
        this.showAlert('O medidor COR não pode ser vazio.');
        return false;
      }
    }

    if (this.os.AD_ULTCONTDUPLEX != '') {
      if (duplex == '' || duplex == undefined) {
        this.showAlert('O medidor Duplex não pode ser vazio.');
        return false;
      }
    }

    if (enderecoCorreto == undefined) {
      this.showAlert('Informe se o equipamento está com o endereço correto.');
      return false;
    } else {
      if (enderecoCorreto == 'S') {

        if (!dataExecucao || !horaInicial || !horaFinal) {
          this.showAlert('Preencha todos os campos');
          return false;
        } else {

          this.os.dataExecucao = dataExecucao;
          this.os.horaInicial = horaInicial;
          this.os.horaFinal = horaFinal;
          this.os.AD_ULTCONTPB = medpb;
          this.os.AD_ULTCONTCOR = medcor;
          this.os.AD_ULTCONTDUPLEX = duplex;
          
          this.navCtrl.push("InformacoesEquipamentoPage", {
            os: this.os,
          });
        }

      } else {

        if (!dataExecucao || !horaInicial || !horaFinal || !novoEndereco || !departamento) {
          this.showAlert('Preencha todos os campos');
          return false;
        } else {
          departamento = this.ajustarCampo(departamento);
          complemento = this.ajustarCampo(complemento);
          this.os.dataExecucao = dataExecucao;
          this.os.horaInicial = horaInicial;
          this.os.horaFinal = horaFinal;
          this.os.AD_ULTCONTPB = medpb;
          this.os.AD_ULTCONTCOR = medcor;
          this.os.AD_ULTCONTDUPLEX = duplex;
          this.os.novoEndereco = novoEndereco + " - Departamento: " + departamento + " - Complemento: " + complemento;
          this.navCtrl.push("InformacoesEquipamentoPage", {
            os: this.os,
          });
        }

      }
    }
  }

  /*
  ionViewDidLoad() {
    this.agendaLocal.select(this.os.NUMOS).then((dados) => {
      if (dados.fotoInicial) {
        this.controleCamera = true;
      }
    });
   }
   */

}