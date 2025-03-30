import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialManagementComponent } from './credential-management/credential-management.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
export const routes: Routes = [
  {
    path: '',
    component: CredentialManagementComponent
  }
]


@NgModule({
  declarations: [
    CredentialManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes) ,
    FormsModule
  ]
})
export class CredentialModule { }
