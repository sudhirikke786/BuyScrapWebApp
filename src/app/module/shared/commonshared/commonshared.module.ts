import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcamModule } from 'ngx-webcam';

import { ActionbarComponent } from './actionbar/actionbar.component';
import { CameraComponent } from './camera/camera.component';



@NgModule({
  declarations: [
    ActionbarComponent,
    CameraComponent
  ],
  imports: [
    CommonModule,
    WebcamModule
  ],
  exports:[
    ActionbarComponent,
    CameraComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CommonsharedModule { }
