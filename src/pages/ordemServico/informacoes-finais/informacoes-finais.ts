import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, LoadingController, ToastController } from 'ionic-angular';
import { OsProvider } from '../../../providers/os/os';
import { AgendaLocalProvider } from '../../../providers/agenda-local/agenda-local';
import { NativeStorage } from '@ionic-native/native-storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/finally';

@IonicPage()
@Component({
  selector: 'page-informacoes-finais',
  templateUrl: 'informacoes-finais.html',
})

export class InformacoesFinaisPage {

  public os: any;
  public listagem: any;
  public token: any;
  public codusu: any;
  public numos: any;
  public numitem: any;
  public bloquear = false;
  public nomeCliente: any;
  public matricula: any;
  public email: any;
  public telefone: any;
  public controleBotao = false;
  public controleAtendimento = false;
  public controleFoto = false;
  public estoqueVolante: any;
  public offline: boolean;
  public produtosSelecionados: any;
  public atendimento: boolean;
  public photo: any;
  public controleCamera = false;
  public controleFotoOs = false;
  public subSistemas: any;
  public causas: any;
  public cau: any;
  public sub: any;

  public dataExecucao: String = new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });

  public horaInicial: String = new Date().toLocaleTimeString("pt-BR",
    { timeZone: "America/Sao_Paulo", hour: "numeric", minute: "numeric" });

  public horaFinal: String = new Date().toLocaleTimeString("pt-BR",
    { timeZone: "America/Sao_Paulo", hour: "numeric", minute: "numeric" });

  constructor(public navCtrl: NavController, public navParams: NavParams, public nativeStorage: NativeStorage,
    public alertCtrl: AlertController, public osProvider: OsProvider, public platform: Platform,
    public agendaLocal: AgendaLocalProvider, public _camera: Camera, public _loadingCtrl: LoadingController,
    private _toast: ToastController) {

    platform.ready().then(() => {

      this.os = this.navParams.get('os');
      this.listagem = this.navParams.get('listagem');
      this.atendimento = this.navParams.get('atendimento');

      this.produtosSelecionados = this.navParams.get('produtosSelecionados');

      if (this.os.statusEquip == 'F' || this.os.statusEquip == 'I') {
        this.controleBotao = true;
      } else {
        this.controleBotao = false;
      }

      if (this.atendimento == false || this.os.atendimento == false) {
        this.controleBotao = true;
        this.controleAtendimento = true;
        this.controleFoto = true;
      }

      if (this.os.CODSERV == '14') {
        this.bloquear = true;
      }

      this.retornaUsuario();
      this.numos = this.os.NUMOS;
      this.numitem = this.os.NUMITEM;

      if (navigator.onLine) {
        this.offline = false;
      } else {
        this.offline = true;
      }
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
      this.osProvider.enviarFoto(this.token, this.os, base64Image, this.os.NUMOS+"/"+this.os.NUMITEM+' depois')
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

  fotoOS() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this._camera.DestinationType.DATA_URL,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE,
    }

    let load = this._loadingCtrl.create({
      content: 'Salvando imagem na nuvem...'
    });

    this._camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      //this.os.fotoOs = base64Image;
      load.present();
      this.osProvider.enviarFoto(this.token, this.os, base64Image, this.os.NUMOS+"/"+this.os.NUMITEM+' OS')
        .then((resultado) => {

          let toast = this._toast.create({
            message: JSON.parse(JSON.stringify(resultado)).mensagem,
            duration: 3000,
            position: 'top'
          });
          load.dismiss();
          toast.present();
          this.controleFotoOs = true;

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

  validaEmail(email): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  validaTelefone(phone: string): boolean {
    const phoneRegex = /^\d{2}\d{8,9}$/;
    return phoneRegex.test(phone);
  }

  retornaUsuario() {
    return new Promise(resolve => {
      this.nativeStorage.getItem('usuario')
        .then(
          data => {
            this.token = JSON.parse(data).token;
            this.codusu = JSON.parse(data).codusu;
            this.estoqueVolante = JSON.parse(data).codlocal;
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

  mascara(login) {
    var er = /[^0-9.]/;
    er.lastIndex = 0;
    var campo = login;
    if (er.test(campo)) {
      campo.value = "";
    }
    console.log('Valor: ' + campo);
  }

  showSucesso(aviso) {
    this.navCtrl.setRoot("AgendaPage", { mensagem: aviso });
  }

  showAlert(aviso) {
    const alert = this.alertCtrl.create({
      title: 'Não foi possível concluir o atendimento!',
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

  ajustarCampo(campo) {
    if (campo == undefined) {
      campo = null
    }
    return campo;
  }

  concluirSemPendencia(cau, nomeCliente, matricula, email, telefone, solucao) {

    if (!this.controleFotoOs) {
      this.showAlert('É necessário tirar a foto da Ordem de serviço');
      return false;
    }

    if (!nomeCliente || !matricula || !telefone) {
      this.showAlert('Preencha o nome, telefone e matrícula/CPF do cliente!');
      return false;
    }

    if (!(this.validaEmail(email))) {
      this.showAlert('Informe um e-mail válido!');
      return false;
    }

    if (!(this.validaTelefone(telefone))) {
      this.showAlert('Informe um telefone válido!');
      return false;
    }

    if (this.os.salva == true && (!cau || cau == undefined)) {
      this.showAlert('Informe o(s) subsistema(s) e a(s) causa(s)!');
      return false;
    }

    if (solucao == '' || solucao == undefined) {
      this.showAlert('Informe a solução');
      return false;
    }

    this.os.AD_OTIMIZACAO_TONER = this.ajustarCampo(this.os.AD_OTIMIZACAO_TONER);
    this.os.AD_CONF_DUPLEX = this.ajustarCampo(this.os.AD_CONF_DUPLEX);
    this.os.AD_MOTIVO_CONF_DUPLEX = this.ajustarCampo(this.os.AD_MOTIVO_CONF_DUPLEX);
    this.os.AD_NOME_CONTATO = nomeCliente;
    this.os.AD_CPF_USU_VALIDADOR = matricula;
    this.os.AD_EMAIL_CONTATO = email;
    this.os.AD_TEL_CONTATO = telefone;
    this.os.SOLUCAO = solucao;

    if (this.os.salva == true) {
      this.os.SubCausas = cau;
    }

    if (this.offline == true && this.os.salva == false) {
      this.os.salva = true;
      this.os.status = status;

      this.alertCtrl.create({
        title: 'Erro na conexão',
        subTitle: 'Não foi possível estabelecer conexão com o servidor, verifique sua conexão e tente novamente.',
        buttons: [
          { text: 'OK' }
        ]
      }).present();

    } else {
      this.showConfirm('Concluir', 'Deseja fechar a OS sem pendência?', 9);
    }
  }

  concluirComPendencia(cau, nomeCliente, matricula, email, telefone, solucao) {

    if (!this.controleFotoOs) {
      this.showAlert('É necessário tirar a foto da Ordem de serviço');
      return false;
    }

    if ((nomeCliente == undefined || nomeCliente == '') || (matricula == undefined || matricula == '') || (telefone == undefined || telefone == '')) {
      this.showAlert('Preencha o nome, telefone e matrícula/CPF do cliente!');
      return false;
    }

    if (this.os.salva == true && (!cau || cau == undefined)) {
      this.showAlert('Informe o(s) subsistema(s) e a(s) causa(s)!');
      return false;
    }

    if (solucao == '') {
      this.showAlert('Informe a solução');
      return false;
    }

    this.os.AD_OTIMIZACAO_TONER = this.ajustarCampo(this.os.AD_OTIMIZACAO_TONER);
    this.os.AD_CONF_DUPLEX = this.ajustarCampo(this.os.AD_CONF_DUPLEX);
    this.os.AD_MOTIVO_CONF_DUPLEX = this.ajustarCampo(this.os.AD_MOTIVO_CONF_DUPLEX);
    this.os.AD_NOME_CONTATO = nomeCliente;
    this.os.AD_CPF_USU_VALIDADOR = matricula;
    this.os.AD_EMAIL_CONTATO = email;
    this.os.AD_TEL_CONTATO = telefone;
    this.os.SOLUCAO = solucao;

    if (this.os.salva == true) {
      this.os.SubCausas = cau;
    }

    if (this.offline == true && this.os.salva == false) {

      this.os.salva = true;
      this.os.status = status;
      this.agendaLocal.update(this.os, true)
        .then(() => {

          console.log(this.os.NUMOS + ' salva com sucesso.');
          this.alertCtrl.create({
            title: 'Informações cadastradas ',
            subTitle: 'As informações da ordem de serviço foram salvas no seu aparelho. Quando for possível envie os dados da OS para o Sankhya.',
            buttons: [
              { text: 'OK' }
            ]
          }).present();

          this.navCtrl.setRoot("AgendaPage");

        }).catch(() => {
          this.os.salva == false;
          console.log('Erro ao salvar os');
        })
    } else {
      this.showConfirm('Concluir', 'Deseja fechar a OS com pendência?', 10);
    }
  }

  atendimentNaoRealizado(nomeCliente, matricula, email, telefone, dataExecucao, horaInicial, horaFinal, solucao) {

    if ((nomeCliente == undefined || nomeCliente == '') || (matricula == undefined || matricula == '') || (telefone == undefined || telefone == '')) {
      this.showAlert('Preencha o nome, telefone e matrícula/CPF do cliente!');
      return false;
    }

    if (!solucao) {
      this.showAlert('Informe a solução');
      return false;
    }

    if (this.atendimento == false && (dataExecucao == undefined || horaInicial == undefined || horaFinal == undefined)) {
      this.showAlert('Preencha todas as informações de data e horário!');
      return false;
    }

    if (!this.os.horaInicial) {
      this.os.dataExecucao = dataExecucao;
      this.os.horaInicial = horaInicial;
      this.os.horaFinal = horaFinal;
    }

    this.os.AD_OTIMIZACAO_TONER = this.ajustarCampo(this.os.AD_OTIMIZACAO_TONER);
    this.os.AD_CONF_DUPLEX = this.ajustarCampo(this.os.AD_CONF_DUPLEX);
    this.os.AD_MOTIVO_CONF_DUPLEX = this.ajustarCampo(this.os.AD_MOTIVO_CONF_DUPLEX);
    this.os.AD_NOME_CONTATO = nomeCliente;
    this.os.AD_CPF_USU_VALIDADOR = matricula;
    this.os.AD_EMAIL_CONTATO = email;
    this.os.AD_TEL_CONTATO = telefone;
    this.os.SOLUCAO = solucao;

    if (this.offline == true && this.os.salva == false) {
      this.os.salva = true;
      this.os.status = 14;
      this.agendaLocal.update(this.os, false)
        .then(() => {
          console.log(this.os.NUMOS + ' salva com sucesso.');

          this.alertCtrl.create({
            title: 'Informações cadastradas ',
            subTitle: 'As informações da ordem de serviço foram salvas no seu aparelho. Quando for possível envie os dados da OS para o Sankhya.',
            buttons: [
              { text: 'OK' }
            ]
          }).present();
          this.navCtrl.setRoot("AgendaPage");
        }).catch(() => {
          this.os.salva == false;
          console.log('Erro ao salvar os');
        })
    } else {
      this.showConfirm('Concluir', 'Não foi possível realizar o atendimento?', 14);
    }
  }


  showConfirm(titulo, texto, status) {

    const prompt = this.alertCtrl.create({
      title: titulo,
      message: texto,
      buttons: [
        {
          text: 'Não',
          handler: () => {
            return true;
          }
        },
        {
          text: 'Sim',
          handler: () => {

            let loading = this._loadingCtrl.create({
              content: 'Cadastrando informações do atendimento...'
            });

            loading.present();

            if (status == 14) {
              this.os.fotoOs = '';

              this.osProvider.concluiOsParcial(this.token, this.os, status)
                .then((resultado) => {
                  loading.dismiss();
                  JSON.parse(JSON.stringify(resultado)).status == 200 ? this.showSucesso("Atendimento concluído") : "";
                  return true;
                })
                .catch((err) => {
                  loading.dismiss();
                  this.showAlert(err.error.mensagem);
                  return false;
                })


            } else {

              if (this.listagem) {

                this.osProvider.concluiOsTotal(this.token, this.os, status, this.listagem, this.codusu, this.estoqueVolante)
                  .then((resultado) => {

                    let data = JSON.stringify(resultado);

                    if (JSON.parse(data).status == 200) {
                      loading.dismiss();
                      this.showSucesso(JSON.parse(data).mensagem);
                    }

                    return true;

                  })
                  .catch((err) => {
                    loading.dismiss();
                    this.showAlert(err.error.mensagem);
                    return false;
                  })

              } else {
                this.os.fotoOs = '';

                this.osProvider.concluiOsParcial(this.token, this.os, status).then((resultado) => {

                  loading.dismiss();
                  JSON.parse(JSON.stringify(resultado)).status == 200 ? this.showSucesso("Atendimento concluído") : "";
                  return true;

                }).catch((err) => {
                  loading.dismiss();
                  this.showAlert(err.error.mensagem);
                  return false;
                })

              }
            }

          }

        }]
    });
    prompt.present();
  }

  /*
  ionViewDidLoad() {
    this.agendaLocal.select(this.os.NUMOS).then((dados) => {
      if (dados.fotoFinal) {
        this.controleCamera = true;
      }
    });
  }
  */

  ionViewDidEnter() {
    if (this.os.salva == true) {
      this.retornaSubsistemas();
    }
  }

}