import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

import { SellersBuyersDashboardComponent } from './sellers-buyers-dashboard/sellers-buyers-dashboard.component';
import { SellersBuyersDetailsComponent } from './sellers-buyers-details/sellers-buyers-details.component';


export const routes: Routes = [
  {
    path: '',
    component: SellersBuyersDashboardComponent
  }
]


@NgModule({
  declarations: [
    SellersBuyersDashboardComponent,
    SellersBuyersDetailsComponent
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
export class SellersModule { }
