import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../module/shared/primeng/primeng.module';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonsharedModule } from '../../module/shared/commonshared/commonshared.module';
import { DocumentBuilderComponent } from './document-builder/document-builder.component';

export const routes: Routes = [{
  path: '',
  component: DocumentBuilderComponent
}
]


@NgModule({
  declarations: [
    DocumentBuilderComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    CommonsharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class MyAccountModule { }

export class CheckPrintingTemplatesModule { }
