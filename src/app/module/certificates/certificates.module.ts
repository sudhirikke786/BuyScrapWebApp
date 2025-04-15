import { NgModule,NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { CertificatesDashboardComponent } from './certificates-dashboard/certificates-dashboard.component';
import { CertificateLayoutComponent } from './certificate-layout/certificate-layout.component';
import { CertificateGridComponent } from './certificate-grid/certificate-grid.component';

export const routes: Routes = [
  {
    path: '',
    component: CertificateLayoutComponent, 
    children: [
      {
        path: '',
        component: CertificatesDashboardComponent
      },
      {
        path: 'grid',
        component: CertificateGridComponent, 
      }
    ]
  }
]

@NgModule({
  declarations: [
    CertificatesDashboardComponent,
    CertificateLayoutComponent,
    CertificateGridComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CommonsharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxExtendedPdfViewerModule,
    PrimengModule,
    
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class CertificatesModule { }
