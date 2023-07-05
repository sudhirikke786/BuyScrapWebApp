import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

import { MaterialsDashboardComponent } from './materials-dashboard/materials-dashboard.component';
import { MaterialsDetailsComponent } from './materials-details/materials-details.component';

export const routes: Routes = [
  {
    path: '',
    component: MaterialsDashboardComponent
  },
  {
    path:'detail/:materialId',
    component: MaterialsDetailsComponent
  }
]

@NgModule({
  declarations: [
    MaterialsDashboardComponent,
    MaterialsDetailsComponent
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
export class MaterialsModule { }
