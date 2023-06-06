import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-info-os',
  templateUrl: 'info-os.html',
})
export class InfoOsPage {

  public os: any;
  public offline : boolean;
  public atendimento: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public platform: Platform) {

    platform.ready().then(() => {

      this.os = this.navParams.get('os');
      this.offline = this.navParams.get('offline');

      //console.log('Valor do off: '+this.os.off);
      //console.log('Valor do offline: '+this.offline);
      //console.log('Valor do salva: '+this.os.salva);

    });

    //this.pegarLocalização();
  }

  /*pegarLocalização() {

    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp.coords.latitude);
      console.log(resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();

    watch.subscribe((data) => {
      console.log(data.coords.latitude);
      console.log(data.coords.longitude);
    });
  }
  */

  abrirAtenderOS() {
    this.navCtrl.push("InformacoesIniciaisPage", { os: this.os });
  }

  atendimentoNaoRealizado(){
    this.atendimento = false;
    this.navCtrl.push("InformacoesFinaisPage", { os: this.os, atendimento: this.atendimento });
  }

  abrirHistoricoOS() {
    this.navCtrl.push("HistoricoPage", { os: this.os });
  }

  criarRota() {
    this.navCtrl.push("CriarRotaPage", { os: this.os });
  }

  voltarParaAgenda(){
    this.navCtrl.setRoot("AgendaPage");
  }

}
