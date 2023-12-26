import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

import { RegradeDashboardComponent } from './regrade-dashboard/regrade-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: RegradeDashboardComponent
  }
]

@NgModule({
  declarations: [
    RegradeDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CommonsharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PrimengModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class RegradeModule { }
