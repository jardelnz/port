import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, AlertController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { NativeStorage } from '@ionic-native/native-storage';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Config } from '../../config/config';


@IonicPage()
@Component({
  selector: 'page-sobre',
  templateUrl: 'sobre.html'
})

export class SobrePage {

  public token: any;
  public usuario: any;
  public codusu: any;
  public grupo: any;
  public loginForm: any;
  public estoqueVolante: any;
  public server: any;
  public informacoesAparelho: any;

  formgroup: FormGroup;
  imei: AbstractControl;
  //

  constructor(public nativeStorage: NativeStorage, public platform: Platform,
    public navCtrl: NavController, formBuilder: FormBuilder,
    public usuarioProvider: UsuarioProvider, public alertCtrl: AlertController,
    private diagnostic: Diagnostic, private config: Config
  ) {


    this.formgroup = formBuilder.group({
      imei: ['', Validators.required]
    });

    this.imei = this.formgroup.controls['imei'];
    //console.log(this.device.version);

    platform.ready().then(() => {
      this.server = this.config.server;
      this.retornaUsuario();
    });

    this.verificarAtualizacao();
  }

  verificarAtualizacao() {
    
    this.usuarioProvider.verificaVersao().then(response => {
      if(response !== this.config.versao){
        alert("Há uma nova versão do aplicativo disponível. Por favor, atualize para a versão mais recente.");
        window.open("market://details?id=br.com.dadyilha.app", "_system");
      }
    });
    
  }

  statusArmazenamento() {
    this.diagnostic.getPermissionAuthorizationStatus(this.diagnostic.permission.WRITE_EXTERNAL_STORAGE).then((status) => {
      console.log(`AuthorizationStatus`);
      console.log(status);
      if (status != this.diagnostic.permissionStatus.GRANTED) {
        this.diagnostic.requestRuntimePermission(this.diagnostic.permission.WRITE_EXTERNAL_STORAGE).then((data) => {
          console.log(`getExternalStorageAuthorizationStatus`);
          console.log(data);
        })
      } else {
        console.log("We have the permission");
      }
    }, (statusError) => {
      console.log(`statusError`);
      console.log(statusError);
    });
  }


  enviarForm() {

    if (!this.imei.value) return this.showAlert('Insira o IMEI!');

    this.usuarioProvider.validarDispositivo(this.imei.value)
      .then(data => {
        this.registraChave(data);
        //console.log(data);
      },
        err => {
          this.showErro('Não autorizado.');
        }
      );
  };

  registraChave(data) {

    //var resultado = JSON.parse(data);
    //console.log("T: "+data.token);
    this.nativeStorage.setItem('usuario', data)
      .then(
        () => this.retornaUsuario(),
        err => this.token = (err)
      );
  }

  retornaUsuario() {
    this.nativeStorage.getItem('usuario')
      .then(
        data => {
          this.token = 'Chave Registrada';
          this.usuario = JSON.parse(data).nomeusu;
          this.codusu = JSON.parse(data).codusu;
          this.estoqueVolante = JSON.parse(data).codlocal;
          this.grupo = JSON.parse(data).grupo;
          this.server;
        },
        error => this.token = (error + ' - Chave não registrada!')
      );
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

}
