import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperAdminHomedashboardComponent } from './super-admin-homedashboard/super-admin-homedashboard.component';
import { RouterModule } from '@angular/router';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { CommonsharedModule } from '../../shared/commonshared/commonshared.module';

const routes = [
    {
    path: '',
    component: SuperAdminHomedashboardComponent
    }
  ];




@NgModule({
  declarations: [
    SuperAdminHomedashboardComponent,
  ],
  imports: [
    CommonModule,
    PrimengModule,
    CommonsharedModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
