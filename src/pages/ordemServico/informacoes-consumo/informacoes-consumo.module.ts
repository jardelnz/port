import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InformacoesConsumoPage } from './informacoes-consumo';

@NgModule({
  declarations: [
    InformacoesConsumoPage,
  ],
  imports: [
    IonicPageModule.forChild(InformacoesConsumoPage),
  ],
})
export class InformacoesConsumoPageModule {}
