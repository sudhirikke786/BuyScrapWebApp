import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../shared/primeng/primeng.module';
import { TicketDashboardComponent } from './ticket-dashboard/ticket-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { RouterModule, Routes } from '@angular/router';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

export const routes: Routes = [
  {
    path:'',
    component:TicketDashboardComponent
  }
]

@NgModule({
  declarations: [
    TicketDashboardComponent
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
export class TicketsModule { }
