import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperadminFeedbackComponent } from './superadmin-feedback/superadmin-feedback.component';
import { Routes, RouterModule } from '@angular/router';
import { PrimengModule } from '../../shared/primeng/primeng.module';
import { CommonsharedModule } from '../../shared/commonshared/commonshared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const routes: Routes = [
  {
    path: '',
    component: SuperadminFeedbackComponent
  }
]

@NgModule({
  declarations: [
    SuperadminFeedbackComponent
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
export class FeedbackModule { }
