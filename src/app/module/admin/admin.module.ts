import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../shared/primeng/primeng.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';



@NgModule({
  declarations: [
    AdminDashboardComponent
  ],
  imports: [
    CommonModule,
    PrimengModule
  ]
})
export class AdminModule { }
