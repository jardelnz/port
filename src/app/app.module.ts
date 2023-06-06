import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';
import { Diagnostic } from '@ionic-native/diagnostic';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

import { Config } from '../config/config';
import { UsuarioProvider, SerieProvider, OsProvider, AgendaLocalProvider } from '../providers/providers';

import { MyApp } from './app.component';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HttpModule,
    NgxDatatableModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Geolocation,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    NativeStorage,
    UsuarioProvider,
    SerieProvider,
    OsProvider,
    Config,
    Diagnostic,
    AgendaLocalProvider,
    Camera,
    BarcodeScanner
  ]
})

export class AppModule { }
