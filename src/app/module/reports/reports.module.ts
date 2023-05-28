import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

import { ReportsDashboardComponent } from './reports-dashboard/reports-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: ReportsDashboardComponent
  }
]

@NgModule({
  declarations: [
    ReportsDashboardComponent
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
export class ReportsModule { }
