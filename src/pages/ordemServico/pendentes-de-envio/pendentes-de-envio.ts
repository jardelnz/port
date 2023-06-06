import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AgendaLocalProvider } from '../../../providers/agenda-local/agenda-local';


@IonicPage()
@Component({
  selector: 'page-pendentes-de-envio',
  templateUrl: 'pendentes-de-envio.html',
})

export class PendentesDeEnvioPage {
  public agendaLocal: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public agendaLocalProvider: AgendaLocalProvider, private alertCtrl: AlertController) { }


  ionViewDidEnter() {
    if (navigator.onLine) {
      this.agendaLocalProvider.getPendentes()
      .then((result) => {
        this.agendaLocal = result;
      });
    } else {
      this.alertCtrl.create({
        title: 'Estamos off-line.',
        subTitle: 'O seu aparelho não está conectado a internet, por isso, não é possível enviar as informações da OS para o servidor.',
        buttons: [
          { text: 'OK' }
        ]
      }).present();
      this.navCtrl.setRoot("AgendaPage");
    }
    
  }

  abrirInfoOS(os) {
    if (os.AD_CONSUMOESTOQUE == 'S') {
      this.navCtrl.push("InformacoesConsumoPage", { os });
    } else {
      this.navCtrl.push("InformacoesFinaisPage", { os })
    }
  }

}