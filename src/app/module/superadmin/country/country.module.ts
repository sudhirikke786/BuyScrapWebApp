import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperAdminCountryComponent } from './super-admin-country/super-admin-country.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { CommonsharedModule } from '../../shared/commonshared/commonshared.module';
import { SuperAdminStateComponent } from './super-admin-state/super-admin-state.component';
import { SuperAdminCityComponent } from './super-admin-city/super-admin-city.component';

export const routes: Routes = [
  {
    path: '',
    component: SuperAdminCountryComponent
  },
  {
    path:'superadmin-state',
    component:SuperAdminStateComponent
  },
  {
    path:'superadmin-city',
    component:SuperAdminCityComponent
  }
]

@NgModule({
  declarations: [
    SuperAdminCountryComponent,
    SuperAdminStateComponent,
    SuperAdminCityComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    CommonsharedModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CountryModule { }
