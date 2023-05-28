import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteLayoutComponent } from './common/site-layout/site-layout.component';
import { OrganizationLoginComponent } from './organization-login/organization-login.component';
import { UserLoginComponent } from './user-login/user-login.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/organization-login', 
    pathMatch: 'full' 
  },
  { 
    path: 'organization-login', 
    component: OrganizationLoginComponent
  },
  { 
    path: ':orgName/user-login', 
    component: UserLoginComponent 
  },
  { 
      path: ':orgName',
      component: SiteLayoutComponent, 
      children: [
        { 
          path: '', 
          loadChildren:() => import('./module/tickets/tickets.module').then(m => m.TicketsModule),
          pathMatch: 'full'
        },
        { 
          path: 'home', 
          loadChildren:() => import('./module/tickets/tickets.module').then(m => m.TicketsModule)
        },
        {
          path:'sellers-buyers',
          loadChildren:() => import('./module/sellers/sellers.module').then(m => m.SellersModule)
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
