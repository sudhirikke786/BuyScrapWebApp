import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

import { ShipoutDashboardComponent } from './shipout-dashboard/shipout-dashboard.component';
import { ShipoutDetailsComponent } from './shipout-details/shipout-details.component';


export const routes: Routes = [
  {
    path: '',
    component: ShipoutDashboardComponent
  },
  {
    path: 'details/:id',
    component: ShipoutDetailsComponent
  }
]

@NgModule({
  declarations: [
    ShipoutDashboardComponent,
    ShipoutDetailsComponent
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
export class ShipoutModule { }
