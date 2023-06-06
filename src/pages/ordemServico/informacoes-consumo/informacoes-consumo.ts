import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { OsProvider } from '../../../providers/os/os';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component({
  selector: 'page-informacoes-consumo',
  templateUrl: 'informacoes-consumo.html',
})

export class InformacoesConsumoPage {

  public token: any;
  public os: any;
  public codusu: any;
  public numos: any;
  public numitem: any;
  public usuario: any;
  public selecao: any;
  public listagem: any;
  public item: any;
  public lista: any;
  public bloquear = false;
  public estoqueVolante: any;

  constructor(public nativeStorage: NativeStorage, public navCtrl: NavController, public navParams: NavParams,
    public osProvider: OsProvider, public platform: Platform, private alertCtrl: AlertController) {
    this.retornaUsuario();

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
          this.estoqueVolante = JSON.parse(data).codlocal;
        },
        error => this.token = (error + ' - Chave não registrada!')
      );
  };

  retornaEstoque() {
    if (navigator.onLine) {
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
          }
        });
    } else {
      this.alertCtrl.create({
        title: 'Erro ao carregar estoque.',
        subTitle: 'Não foi possível carregar seu estoque, verifique sua conexão e tente novamente.',
        buttons: [
          { text: 'OK' }
        ]
      }).present();
    }
  };

  retornaDadosProduto(codprod) {
    this.osProvider.retornaDadosProduto(this.token, this.codusu, codprod)
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
        }
      });
  }

  showAlert(aviso) {
    const alert = this.alertCtrl.create({
      title: 'Alerta!',
      subTitle: aviso,
      buttons: ['OK']
    });
    alert.present();
  }

  avancaCadastro(listagem) {

    var erroQuantidade = 0;
    var erroZero = 0;
    var erroProdutoSelecionado = 0;
    var produtosSelecionados = 0;
    var erroSelecao = 0;

    for (let produto of listagem) {
      if (produto.selecionado == true) {
        if (produto.quantidade > produto.TOTAL) {
          erroQuantidade += 1;
        } else if (produto.quantidade == 0 || produto.quantidade == undefined || produto.quantidade < 0) {
          erroZero += 1;
        } else {
          produtosSelecionados += 1;
        }
      }
      else if (produto.selecionado == undefined || produto.selecionado == false) {
        if (produto.quantidade > 0) {
          erroSelecao += 1;
        }
        erroProdutoSelecionado += 1;
      }
    }

    if (erroQuantidade != 0) {
      this.alertCtrl.create({
        title: 'Confira a quantidade.',
        subTitle: 'A quantidade informada é maior que a quantidade em estoque!',
        buttons: [
          { text: 'OK' }
        ]
      }).present();
    } else if (erroZero != 0) {
      this.alertCtrl.create({
        title: 'Quantidade inválida.',
        subTitle: 'A quantidade consumida não pode ser vazia, igual a 0 ou menor que 0.',
        buttons: [
          { text: 'OK' }
        ]
      }).present();
    } else if (erroSelecao != 0) {
      this.alertCtrl.create({
        title: 'Selecione o produto.',
        subTitle: 'Você informou a quantidade, porém, não selecionou o produto.',
        buttons: [
          { text: 'OK' }
        ]
      }).present();
    } else if (erroProdutoSelecionado == listagem.length) {
      this.alertCtrl.create({
        title: 'Selecione um produto.',
        subTitle: 'Selecione os produtos utilizados para o atendimento da OS.',
        buttons: [
          { text: 'OK' }
        ]
      }).present();
    } else {

      /*
      console.log('Empresa: '+ this.os.CODEMP);
      console.log('Cliente: '+ this.os.CODPARC);
      console.log('OS: '+ this.os.NUMOS);
      console.log('Num item: '+ this.os.NUMITEM);
      console.log('Usuário: '+ this.codusu);
      console.log('Estoque do tec.: '+ this.estoqueVolante);
      

      for (let o of listagem) {
        console.log('Produto: ' + o.DESCRPROD + '- Seleção: ' + o.selecionado + ' - Quantidade: ' + o.quantidade);
      }
      */
     
      this.showConfirm('Confirmação de uso ', listagem, produtosSelecionados);

    }
  }

  showConfirm(titulo, listagem, produtosSelecionados) {

    var texto = '';

    for (let o of listagem) {
      if (o.selecionado == true) {
        texto += '<b>' + o.DESCRPROD + ' - ' + o.quantidade + '</b><br><br>';
      }
    }

    const prompt = this.alertCtrl.create({
      title: titulo,
      message: 'Confirma a utilização do(s) produto(s)? <br><br>' + texto,
      buttons: [
        {
          text: 'Não',
          handler: () => {
            return true;
          }
        }, {
          text: 'Sim',
          handler: () => {
            this.navCtrl.push("InformacoesFinaisPage", {
              os: this.os, listagem, produtosSelecionados
            });

          }
        }

      ]
    });
    prompt.present();
  }
}