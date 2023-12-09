import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';

import { OverlayModule } from 'primeng/overlay';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { ContextMenuModule } from 'primeng/contextmenu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SkeletonModule } from 'primeng/skeleton';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputTextModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    OverlayModule,
    DialogModule,
    ToastModule,
    TooltipModule,
    SkeletonModule,
    PaginatorModule,
    ConfirmDialogModule
  ],
  exports:[
    InputTextModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    OverlayModule,
    DialogModule,
    OverlayPanelModule,
    MultiSelectModule,
    ToastModule,
    TooltipModule,
    PaginatorModule,
    SkeletonModule,
    ContextMenuModule,
    ConfirmDialogModule
  ]
})
export class PrimengModule { }
