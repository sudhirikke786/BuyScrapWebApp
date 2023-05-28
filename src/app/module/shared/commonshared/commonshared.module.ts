import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionbarComponent } from './actionbar/actionbar.component';



@NgModule({
  declarations: [
    ActionbarComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ActionbarComponent
  ]
})
export class CommonsharedModule { }
