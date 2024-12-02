import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

import { InoutDashboardComponent } from './inout-dashboard/inout-dashboard.component';
import { InoutDetailsComponent } from './inout-details/inout-details.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';


export const routes: Routes = [
  {
    path: '',
    component: InoutDashboardComponent
  },
  {
    path:'detail/:inoutId/:action',
    component: InoutDetailsComponent
  }
]

@NgModule({
  declarations: [
    InoutDashboardComponent,
    InoutDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CommonsharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxExtendedPdfViewerModule,
    PrimengModule
  ],
  providers: [DatePipe],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class InoutModule { }
