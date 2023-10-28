import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

import { SellersBuyersDashboardComponent } from './sellers-buyers-dashboard/sellers-buyers-dashboard.component';
import { SellersBuyersDetailsComponent } from './sellers-buyers-details/sellers-buyers-details.component';
import { AddSellersComponent } from './add-sellers/add-sellers.component';
import { RoleGuard } from 'src/app/core/guard/role.guard';


export const routes: Routes = [
  {
    path: '',
    component: SellersBuyersDashboardComponent,
   
  },
  {
    path:'add-seller',
    component:AddSellersComponent
  },
  {
    path:'edit-seller/:sellerId',
    component:AddSellersComponent
  },
  {
    path:'view-seller/:sellerId',
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
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SellersModule { }
