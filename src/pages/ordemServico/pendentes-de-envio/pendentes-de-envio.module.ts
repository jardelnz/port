import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PendentesDeEnvioPage } from './pendentes-de-envio';

@NgModule({
  declarations: [
    PendentesDeEnvioPage,
  ],
  imports: [
    IonicPageModule.forChild(PendentesDeEnvioPage),
  ],
})
export class PendentesDeEnvioPageModule {}
