import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, ActionSheetController } from 'ionic-angular';
import { OsProvider } from '../../../providers/os/os';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component({
  selector: 'page-criar-rota',
  templateUrl: 'criar-rota.html',
})


export class CriarRotaPage {

  public os: any;

  public token: any;
  public codusu: any;
  public numos: any;
  public numitem: any;
  public options: any;
  public enderecos: any;

  ionViewDidEnter() {

    //if (!this.os.AD_LAT || !this.os.AD_LONG) {
    this.retornaRota();
    //}


  }

  constructor(public alertCtrl: AlertController, public nativeStorage: NativeStorage,
    public navCtrl: NavController, public navParams: NavParams, 
    public platform: Platform, public osProvider: OsProvider, 
    public actionSheetCtrl: ActionSheetController) {

    platform.ready().then(() => {

      this.os = this.navParams.get('os');
      this.numos = this.os.NUMOS;
      this.numitem = this.os.NUMITEM;
      //this.os.MAPA = this.getMapa();

      //this.enderecos.push(this.osProvider.criarRota(this.token, 'Rua José Figueiredo, 38'));
      /*this.enderecos = this.osProvider.criarRota(this.token, this.os.ENDMAQUINA)
        .then(data => {
          this.enderecos = data;
          console.log('Endereço :' + this.os.ENDMAQUINA);
          console.log('Dados :' + data);
        });
        */


    });

    this.retornaUsuario();
  }

  retornaRota() {
    this.osProvider.criarRota(this.token, this.os.ENDGPS).then(
      data => {
        //console.log('1'+JSON.stringify(data.toString())[0]);
        //console.log('2'+JSON.parse(data.toString()));
        //console.log('3'+JSON.parse(data.toString())[0].latitude);
        //console.log('4'+data[0]);
        //console.log('5'+data[0].latitude);
        this.enderecos = data;
        console.log(this.enderecos);
        
      });
  };

  getMapa(latitude, longitude) {
    //return 'https://maps.googleapis.com/maps/api/staticmap?zoom=15&size=400x400&markers=color:red|' + this.os.ENDGPS + '&key=AIzaSyBEptInBETeJWSKwgVe0Bl7Fo8__dFX53s'
    return 'https://maps.googleapis.com/maps/api/staticmap?zoom=15&size=400x400&markers=color:red|'+latitude+','+longitude+'&key=AIzaSyBEptInBETeJWSKwgVe0Bl7Fo8__dFX53s'
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

  acessarRota(lat, long) {
    window.open("https://www.google.com/maps?q=" + lat + "," + long, "_blank");
  }

  googleMaps(endereco){
    window.open("https://www.google.com/maps?q="+endereco+"_blank");
  }

  acessarRotaW() {
    //window.open("https://waze.com/ul?ll" + lat + "," + long, "_blank");
    window.open('https://waze.com/ul?ll=45.6906304,-120.810983&z=10');
  }

}