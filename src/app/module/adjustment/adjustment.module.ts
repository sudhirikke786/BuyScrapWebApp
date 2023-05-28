import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

import { AdjustmentDashboardComponent } from './adjustment-dashboard/adjustment-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: AdjustmentDashboardComponent
  }
]

@NgModule({
  declarations: [
    AdjustmentDashboardComponent
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
export class AdjustmentModule { }
