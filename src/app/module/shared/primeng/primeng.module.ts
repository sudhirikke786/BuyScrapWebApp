import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';

import { OverlayModule } from 'primeng/overlay';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputTextModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    OverlayModule,
    DialogModule
  ],
  exports:[
    InputTextModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    OverlayModule,
    DialogModule,
    MultiSelectModule
  ]
})
export class PrimengModule { }
