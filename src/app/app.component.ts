import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';

import { AgendaLocalProvider } from '../providers/agenda-local/agenda-local';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = "SobrePage";
  public countPendentes: any;

  ionViewDidEnter() {
    this.agendaLocalProvider.getPendentes().then((dados) => {
      console.log('Pendentes: ' + dados.length);
      this.countPendentes = dados.length;
    })
  }

  pages: Array<{ title: string, component: any }>;
  showSplash = true;

  constructor(public nativeStorage: NativeStorage,
    public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, public agendaLocalProvider: AgendaLocalProvider) {


    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.pages = [
      { title: 'Agenda de Hoje', component: "AgendaPage" },
      { title: 'Pedentes de envio ', component: "PendentesDeEnvioPage" },
      { title: 'Agenda Futura', component: "AgendaFuturaPage" },
      { title: 'Pedidos de Suprimento', component: "AgendaSuprimentoPage" },
      { title: 'Histórico da Série', component: "HistoricoPage" },
      { title: 'Estoque', component: "EstoquePage" },
      { title: 'Sobre o Aplicativo', component: "SobrePage" }
    ];

  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

}