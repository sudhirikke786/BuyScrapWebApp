import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

import { TicketDashboardComponent } from './ticket-dashboard/ticket-dashboard.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';

export const routes: Routes = [
  {
    path:'',
    component:TicketDashboardComponent
  },
  {
    path:'detail/:ticketId',
    component:TicketDetailComponent
  }
]

@NgModule({
  declarations: [
    TicketDashboardComponent,
    TicketDetailComponent
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
