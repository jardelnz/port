import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-info-suprimento',
  templateUrl: 'info-suprimento.html',
})
export class InfoSuprimentoPage {

  public pedido: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.pedido = this.navParams.get('pedido');

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad "InfoSuprimentoPage"');
  }

  finalizarEntrega() {
    this.navCtrl.push("ConcluirSuprimentoPage", { pedido: this.pedido });

  }

  entregaNaoRealizada() {
    this.navCtrl.push("ConcluirSuprimentoPage", { pedido: this.pedido, naoRealizada: true });
  }
}
