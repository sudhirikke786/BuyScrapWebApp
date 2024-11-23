import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardChartsComponent } from './dashboard-charts/dashboard-charts.component';
import { RouterModule, Routes } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';
import { LinechartComponent } from './linechart/linechart.component';
import { NgChartsModule } from 'ng2-charts';
import { BarchartComponent } from './barchart/barchart.component';
import { CardsComponent } from './cards/cards.component';
import { SellerscountComponent } from './sellerscount/sellerscount.component';
import { PiechartComponent } from './piechart/piechart.component';
import { ModalComponent } from './modal/modal.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardChartsComponent
  }
]

@NgModule({
  declarations: [
    DashboardChartsComponent,
    LinechartComponent,
    BarchartComponent,
    CardsComponent,
    SellerscountComponent,
    PiechartComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PrimengModule,
    FormsModule,
    CommonsharedModule,
    ReactiveFormsModule,
    NgChartsModule
  ]
})
export class DashboardModule { }
