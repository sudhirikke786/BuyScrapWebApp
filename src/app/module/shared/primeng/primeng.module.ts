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
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SidebarModule } from 'primeng/sidebar';

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
    ConfirmDialogModule,
    CheckboxModule,
    InputSwitchModule,
    SidebarModule
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
    ConfirmDialogModule,
    CheckboxModule,
    InputSwitchModule,
    SidebarModule
  ]
})
export class PrimengModule { }
