import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { OsProvider } from '../../../providers/os/os';
import { NativeStorage } from '@ionic-native/native-storage';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()

@Component({
  selector: 'page-concluir-suprimento',
  templateUrl: 'concluir-suprimento.html',
})

export class ConcluirSuprimentoPage {

  public pedido: any;

  public token: any;
  public codusu: any;
  public grupoUsuario: any;
  public nunota: any;
  public status: any;
  public dataExecucao: any;
  public hora: String = new Date().toLocaleTimeString("pt-BR",
    { timeZone: "America/Sao_Paulo", hour: "numeric", minute: "numeric" });
  public medpb: number;
  public medcor: number;
  public duplex: number;
  public responsavel: any;
  public matricula: any;
  public ocorrencia: any;
  public itensRecolhidos: any;
  public naoRealizada: boolean;
  public controleCamera = false;
  public fotoPedido: any;
  public contadores: any;
  public entregadores: any;
  public entregador: any;


  constructor(public nativeStorage: NativeStorage, public alertCtrl: AlertController,
    public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public _camera: Camera,
    public osProvider: OsProvider) {
    platform.ready().then(() => {
      this.pedido = this.navParams.get('pedido');
      this.naoRealizada = this.navParams.get('naoRealizada');
      this.nunota = this.pedido.NUNOTA;
    });
    this.retornaUsuario();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad "ConcluirSuprimentoPage"');
  }

  finalizarEntrega(status) {

    console.log('PB do Pedido: ' + this.pedido.AD_ULTCONTPB);
    console.log('Cor do Pedido: ' + this.pedido.AD_ULTCONTCOR);
    console.log('Duplex do pedido: ' + this.pedido.AD_ULTCONTDUPLEX);
    
    if (status == 'E') {
      let temContadores: boolean;
      temContadores = this.prepararContadores();
      if (temContadores == false) {

        return false;
      } else {
        if (this.verificarPreenchimento(true, true, true, true, true, true, true)) {
          this.showConfirm('Concluir', 'Deseja fechar o pedido?', status)
        }
      }

    } else if (status == 'C') {
      if (this.verificarPreenchimento(false, false, true, true, true, false, true)) {
        this.showConfirm('Concluir', 'Deseja fechar o pedido?', status)
      }
    }
  }

  tiraFoto() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this._camera.DestinationType.DATA_URL,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE,
    }
    
    this._camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.fotoPedido = base64Image;
      this.controleCamera = true;
    }
    ), (err) => {
      this.showAlert('Não foi possível capturar a imagem, tente novamente mais tarde!');
      return false;
    }
  }

  prepararContadores() {

    if (this.medpb != undefined) {
      if (this.pedido.AD_ULTCONTPB > this.medpb) {
        this.showAlert('O medidor PB informado não pode ser menor que o medidor do equipamento!');
        return false;
      } else if (this.validaContador(this.medpb) == false) {
        this.showAlert('Preencha o contador apenas com números!');
        return false;
      } else {
        this.pedido.medpb = this.medpb;
      }
    }

    if (this.medcor != undefined) {
      if (this.pedido.AD_ULTCONTCOR > this.medcor) {
        this.showAlert('O medidor COR informado não pode ser menor que o medidor do equipamento!');
        return false;
      } if (this.validaContador(this.medcor) == false) {
        this.showAlert('Preencha o contador apenas com números!');
        return false;
      } else {
        this.pedido.medcor = this.medcor;
      }
    }

    if (this.duplex != undefined) {
      if (this.pedido.AD_ULTCONTDUPLEX > this.duplex) {
        this.showAlert('O medidor DUPLEX informado não pode ser menor que o medidor do equipamento!');
        return false;
      } else if (this.validaContador(this.duplex) == false) {
        this.showAlert('Preencha o contador apenas com números!');
        return false;
      } else {
        this.pedido.duplex = this.duplex;
        //this.osProvider.salvarContadores(this.token, this.pedido, this.dataExecucao, 'duplex');
      }
    }


  }

  enviarFoto(foto, descricao) {
    this.osProvider.enviarFoto(this.token, this.nunota, foto, descricao).then(() => {
      console.log('Imagem enviada com sucesso!');
    });
  }

  retornaEntregadores() {
    return new Promise(resolve => {
      this.osProvider.retornaEntregadores(this.token)
        .then(
          data => {
            this.entregadores = data;
            return resolve(true);
          },
          error =>
            console.log(error)
        )
    })
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


  verificarPreenchimento(a, b, c, d, e, f, g) {
  
    if (!this.dataExecucao && a) {
      this.showAlert('Preencha a data do atendimento.');
      return false;
    }

    if (!this.hora && b) {
      this.showAlert('Preencha a hora de entrega.');
      return false;
    }

    if (!this.responsavel && c) {
      this.showAlert('Preencha o campo responsável pelo recebimento.');
      return false;
    }

    if (!this.matricula && d) {
      this.showAlert('Preencha o campo CPF/matrícula do responsável.');
      return false;
    }

    if (!this.ocorrencia && e) {
      this.showAlert('Preencha a ocorrência responsável.');
      return false;
    }

    if (!this.fotoPedido && f) {
      this.showAlert('Por favor, capture a imagem do equipamento depois do atendimento!');
      return false;
    }

    if(this.grupoUsuario == 7 && !this.entregador){
      this.showAlert('Por favor, informe o entregador!');
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
            this.grupoUsuario = JSON.parse(data).grupo;
            console.log('Grupo do usuário: ' + this.grupoUsuario);
            if(this.grupoUsuario == 7){
              this.retornaEntregadores();
            }
            return resolve(true);
          },
          error =>
            this.token = (error + ' - Chave não registrada!')

        )
    })
  };

  showSucesso(aviso) {
    const alert = this.alertCtrl.create({
      title: 'Entrega concluída',
      subTitle: aviso,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            //this.navCtrl.push("AgendaPage");
            this.navCtrl.setRoot("AgendaSuprimentoPage");
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

    const prompt = this.alertCtrl.create({
      title: titulo,
      message: texto,
      buttons: [
        {
          text: 'Não',
          handler: () => {
            console.log('Não');
            return true;
          }
        }, {
          text: 'Sim',
          handler: () => {
            console.log('Sim');

            if (this.itensRecolhidos) {
              this.ocorrencia += '\n\n Itens recolhidos: ' + this.itensRecolhidos;
              console.log(this.ocorrencia);
            }

            //this.enviarFoto(this.fotoPedido, 'Foto do pedido nº: ' + this.nunota);

            this.osProvider.enviarFotoPedido(this.token, this.nunota, this.fotoPedido, 'Foto do pedido nº: ' + this.nunota).then(() => {


              if (this.pedido.duplex || this.pedido.medpb || this.pedido.medcor) {
                let dataFormatada = this.dataExecucao + ' ' + this.hora;
                this.osProvider.salvarContadores(this.token, this.pedido, dataFormatada).then((data) => {
                  console.log('Contadores cadastrados com sucesso! ' + data);
                  this.fechaPedido(status);
                }).catch((err) => {
                  console.log(err);
                  this.showAlert('Não foi possível salvar os contadores!');
                  return false;
                });
              } else {
                this.fechaPedido(status);
              }
            });

          }
        }
      ]
    });
    prompt.present();
  }


  fechaPedido(status) {

    if(this.grupoUsuario == 7){
      this.osProvider.atualizaPedidoEntregador(this.token, this.nunota, status, this.dataExecucao,
        this.hora, this.responsavel, this.matricula, this.ocorrencia, this.entregador)
        .then(
          resultado => {
            let data = JSON.stringify(resultado);
  
            if (JSON.parse(data).status == 200) {
              this.showSucesso(JSON.parse(data).mensagem);
              this.navCtrl.popAll();
            }
          },
          erro => {
            let data = JSON.stringify(erro);
  
            if (JSON.parse(data).status == 400) {
              this.showErro(JSON.parse(data).mensagem);
            }
          })
    } else {

      this.osProvider.atualizaPedidoNew(this.token, this.nunota, status, this.dataExecucao,
        this.hora, this.responsavel, this.matricula, this.ocorrencia)
        .then(
          resultado => {
            let data = JSON.stringify(resultado);
  
            if (JSON.parse(data).status == 200) {
              this.showSucesso(JSON.parse(data).mensagem);
              this.navCtrl.popAll();
            }
          },
          erro => {
            let data = JSON.stringify(erro);
  
            if (JSON.parse(data).status == 400) {
              this.showErro(JSON.parse(data).mensagem);
            }
          })
    }

  }


}