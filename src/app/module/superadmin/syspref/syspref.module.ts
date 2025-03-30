import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SysprefComponent } from './syspref/syspref.component';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { CommonsharedModule } from '../../shared/commonshared/commonshared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
export const routes: Routes = [
  {
    path: '',
    component: SysprefComponent
  }
]

@NgModule({
  declarations: [SysprefComponent],
  imports: [
    CommonModule,
    PrimengModule,
    CommonsharedModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SysprefModule { }
