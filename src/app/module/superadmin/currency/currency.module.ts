import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperAdminCurrencyComponent } from './super-admin-currency/super-admin-currency.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../../shared/primeng/primeng.module';
export const routes: Routes = [
  {
    path: '',
    component: SuperAdminCurrencyComponent
  }]

@NgModule({
  declarations: [
    SuperAdminCurrencyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
     PrimengModule
  ]
})
export class CurrencyModule { }
