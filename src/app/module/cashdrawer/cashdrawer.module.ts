import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

import { CashdrawerDashboardComponent } from './cashdrawer-dashboard/cashdrawer-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: CashdrawerDashboardComponent
  }
]

@NgModule({
  declarations: [
    CashdrawerDashboardComponent
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
export class CashdrawerModule { }
