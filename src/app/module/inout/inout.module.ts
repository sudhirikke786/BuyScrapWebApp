import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

import { InoutDashboardComponent } from './inout-dashboard/inout-dashboard.component';
import { InoutDetailsComponent } from './inout-details/inout-details.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { InoutLayoutComponent } from './inout-layout/inout-layout.component';
import { InoutGridComponent } from './inout-grid/inout-grid.component';


export const routes: Routes = [
  // {
  //   path: '',
  //   component: InoutDashboardComponent
  // },
  {    
    path:'',
    component:InoutDashboardComponent
  },
  {
    path:'detail/:inoutId/:action',
    component: InoutDetailsComponent
  }
]

@NgModule({
  declarations: [
    InoutDashboardComponent,
    InoutDetailsComponent,
    InoutLayoutComponent,
    InoutGridComponent
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
