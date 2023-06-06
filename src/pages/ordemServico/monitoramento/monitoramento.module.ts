import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MonitoramentoPage } from './monitoramento';

@NgModule({
  declarations: [
    MonitoramentoPage,
  ],
  imports: [
    IonicPageModule.forChild(MonitoramentoPage),
  ],
})
export class MonitoramentoPageModule {}