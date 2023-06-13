import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

import { SellersBuyersDashboardComponent } from './sellers-buyers-dashboard/sellers-buyers-dashboard.component';
import { SellersBuyersDetailsComponent } from './sellers-buyers-details/sellers-buyers-details.component';
import { AddSellersComponent } from './add-sellers/add-sellers.component';


export const routes: Routes = [
  {
    path: '',
    component: SellersBuyersDashboardComponent
  },
  {
    path:'add-sellers',
    component:AddSellersComponent
  },
  {
    path:'view-sellers/:id',
    component:SellersBuyersDetailsComponent
  }
]


@NgModule({
  declarations: [
    SellersBuyersDashboardComponent,
    SellersBuyersDetailsComponent,
    AddSellersComponent
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
