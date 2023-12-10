import { NgModule,NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

import { CertificatesDashboardComponent } from './certificates-dashboard/certificates-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: CertificatesDashboardComponent
  }
]

@NgModule({
  declarations: [
    CertificatesDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CommonsharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PrimengModule,
    
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class CertificatesModule { }
