import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalhaNunotaPage } from './detalha-nunota';

@NgModule({
  declarations: [
    DetalhaNunotaPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalhaNunotaPage),
  ],
  exports: [
    DetalhaNunotaPage
  ]
})
export class DetalhaNunotaPageModule {}
