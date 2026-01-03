import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';
import { TruckDashboardComponent } from './truck-dashboard/truck-dashboard.component';
import { TruckDetailsComponent } from './truck-details/truck-details.component';


export const routes: Routes = [
  {
    path: '',
    component: TruckDashboardComponent
  },
  {
    path:'detail',
    component: TruckDetailsComponent
  },
]


@NgModule({
  declarations: [
    TruckDashboardComponent,
    TruckDetailsComponent
  ],
  imports: [
    CommonModule,
        FormsModule,
        CommonsharedModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        PrimengModule
  ]
})
export class TruckModule { }
