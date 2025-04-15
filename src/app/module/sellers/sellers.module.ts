import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng/primeng.module';
import { CommonsharedModule } from '../shared/commonshared/commonshared.module';

import { SellersBuyersDashboardComponent } from './sellers-buyers-dashboard/sellers-buyers-dashboard.component';
import { SellersBuyersDetailsComponent } from './sellers-buyers-details/sellers-buyers-details.component';
import { AddSellersComponent } from './add-sellers/add-sellers.component';
import { RoleGuard } from 'src/app/core/guard/role.guard';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CheckplanGuard } from 'src/app/core/guard/checkplan.guard';
import { SellerLayoutComponent } from './seller-layout/seller-layout.component';
import { SellerGridComponent } from './seller-grid/seller-grid.component';


export const routes: Routes = [
  {
    path: '',
    component: SellerLayoutComponent, 
    children: [
      {
        path: '',
        component: SellersBuyersDashboardComponent, 
      },
      {
        path: 'grid',
        component: SellerGridComponent, 
      }
    ]
  },
  {
    path:'add-seller',
    component:AddSellersComponent,
    canActivate: [CheckplanGuard],
    
  },
  {
    path:'edit-seller/:sellerId',
    component:AddSellersComponent,
    canActivate: [CheckplanGuard],
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
    AddSellersComponent,
    SellerLayoutComponent,
    SellerGridComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CommonsharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxExtendedPdfViewerModule,
    PrimengModule
  ],
  providers: [DatePipe],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SellersModule { }
