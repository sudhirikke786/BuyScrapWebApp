import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcamModule } from 'ngx-webcam';

import { ActionbarComponent } from './actionbar/actionbar.component';
import { CameraComponent } from './camera/camera.component';
import { FormsModule } from '@angular/forms';
import { PriceCalculatorComponent } from './price-calculator/price-calculator.component';
import { TooltipModule } from 'primeng/tooltip';
import { PrimengModule } from '../primeng/primeng.module';
import { FormErrorMessageComponent } from './form-error-message/form-error-message.component';
import { SignaturePadComponent } from './signature-pad/signature-pad.component';
import { ThumbFingerComponent } from './thumb-finger/thumb-finger.component';


@NgModule({
  declarations: [
    ActionbarComponent,
    CameraComponent,
    PriceCalculatorComponent,
    SignaturePadComponent,
    ThumbFingerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    WebcamModule,
    TooltipModule,
    PrimengModule,
    FormErrorMessageComponent,
   
  ],
  exports:[
    ActionbarComponent,
    CameraComponent,
    PriceCalculatorComponent,
    FormErrorMessageComponent,
    SignaturePadComponent,
    ThumbFingerComponent 
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CommonsharedModule { }
