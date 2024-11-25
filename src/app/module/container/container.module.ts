import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';
import { ContainerDashboardComponent } from './container-dashboard/container-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: ContainerDashboardComponent
  }
]

@NgModule({
  declarations: [
    ContainerDashboardComponent
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
export class ContainerModule { }
