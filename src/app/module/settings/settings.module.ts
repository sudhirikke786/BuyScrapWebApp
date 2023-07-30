import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';
import { SettingsDashboardComponent } from './settings-dashboard/settings-dashboard.component';
import { PrinterTypeComponent } from './printer-type/printer-type.component';
import { PrinterPriceComponent } from './printer-price/printer-price.component';
import { CashierSettingsComponent } from './cashier-settings/cashier-settings.component';
import { TicketSettingsComponent } from './ticket-settings/ticket-settings.component';
import { CameraSettingsComponent } from './camera-settings/camera-settings.component';
import { SystemPerfComponent } from './system-perf/system-perf.component';
import { MessageService } from 'primeng/api';



export const routes: Routes = [{
  path:'',
  component:SettingsDashboardComponent
}]


@NgModule({
  declarations: [
    SettingsDashboardComponent,
    PrinterTypeComponent,
    PrinterPriceComponent,
    CashierSettingsComponent,
    TicketSettingsComponent,
    CameraSettingsComponent,
    SystemPerfComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    RouterModule.forChild(routes),
    CommonsharedModule,
    FormsModule,
  
    ReactiveFormsModule,

  ],
  providers: [MessageService],
})
export class SettingsModule { }
