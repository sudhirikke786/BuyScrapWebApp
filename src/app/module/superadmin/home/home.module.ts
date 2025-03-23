import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperAdminHomedashboardComponent } from './super-admin-homedashboard/super-admin-homedashboard.component';
import { RouterModule } from '@angular/router';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { CommonsharedModule } from '../../shared/commonshared/commonshared.module';
import { SuperadminLocationManagmentComponent } from './superadmin-location-managment/superadmin-location-managment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuperadminUsermanagmentComponent } from './superadmin-usermanagment/superadmin-usermanagment.component';
const routes = [
    {
    path: '',
    component: SuperAdminHomedashboardComponent
    },
    {
      path: 'superadmin-loc',
      component: SuperadminLocationManagmentComponent
    },
    {
      path: 'superadmin-usermanagment',
      component: SuperadminUsermanagmentComponent
    }
  ];




@NgModule({
  declarations: [
    SuperAdminHomedashboardComponent,
    SuperadminLocationManagmentComponent,
    SuperadminUsermanagmentComponent,
  ],
  imports: [
    CommonModule,
    PrimengModule,
    CommonsharedModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
