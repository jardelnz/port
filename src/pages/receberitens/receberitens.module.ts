import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceberitensPage } from './receberitens';

@NgModule({
  declarations: [
    ReceberitensPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceberitensPage),
  ],
  exports: [
    ReceberitensPage
  ]
})
export class ReceberitensPageModule {}
