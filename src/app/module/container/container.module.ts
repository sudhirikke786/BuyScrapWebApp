import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';
import { ContainerDashboardComponent } from './container-dashboard/container-dashboard.component';
import { ContainerDetailsComponent } from './container-details/container-details.component';

export const routes: Routes = [
  {
    path: '',
    component: ContainerDashboardComponent
  },
  {
    path:'detail/:containerId',
    component: ContainerDetailsComponent
  },
]

@NgModule({
  declarations: [
    ContainerDashboardComponent,
    ContainerDetailsComponent
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
