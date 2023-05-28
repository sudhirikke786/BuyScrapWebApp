import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellersBuyersDashboardComponent } from './sellers-buyers-dashboard/sellers-buyers-dashboard.component';
import { SellersBuyersDetailsComponent } from './sellers-buyers-details/sellers-buyers-details.component';
import { PrimengModule } from '../shared/primeng/primeng.module';


import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'',
    component:SellersBuyersDashboardComponent
  }
]


@NgModule({
  declarations: [
    SellersBuyersDashboardComponent,
    SellersBuyersDetailsComponent
  ],
  imports: [
    CommonModule,
    PrimengModule
  ]
})
export class SellersModule { }
