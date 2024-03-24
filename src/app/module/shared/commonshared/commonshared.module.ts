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
import { PenSignatureComponent } from './pen-signature/pen-signature.component';
import { PageLoaderComponent } from '../page-loader/page-loader.component';
import { MaterialCalculatorComponent } from './material-calculator/material-calculator.component';
import { PlanUpgradeComponent } from './plan-upgrade/plan-upgrade.component';

@NgModule({
  declarations: [
    ActionbarComponent,
    CameraComponent,
    PriceCalculatorComponent,
    SignaturePadComponent,
    ThumbFingerComponent,
    PenSignatureComponent,
    PageLoaderComponent,
    MaterialCalculatorComponent,
    PlanUpgradeComponent
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
    ThumbFingerComponent,
    PenSignatureComponent,
    PageLoaderComponent,
    MaterialCalculatorComponent,
    PlanUpgradeComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CommonsharedModule { }
