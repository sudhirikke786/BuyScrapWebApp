import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputTextModule,
    TableModule,
    DropdownModule,
    ButtonModule
  ],
  exports:[
    InputTextModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    MultiSelectModule
  ]
})
export class PrimengModule { }
