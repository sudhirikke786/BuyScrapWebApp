import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path:'',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  
]


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,

    RouterModule.forChild(routes)
  ]
})
export class SuperadminModule { }
