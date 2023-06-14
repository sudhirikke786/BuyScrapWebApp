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
        },
        {
          path:'ship-out',
          loadChildren:() => import('./module/shipout/shipout.module').then(m => m.ShipoutModule)
        },
        {
          path:'materials',
          loadChildren:() => import('./module/materials/materials.module').then(m => m.MaterialsModule)
        },
        {
          path:'adjustment',
          loadChildren:() => import('./module/adjustment/adjustment.module').then(m => m.AdjustmentModule)
        },
        {
          path:'regrade',
          loadChildren:() => import('./module/regrade/regrade.module').then(m => m.RegradeModule)
        },
        {
          path:'certificates',
          loadChildren:() => import('./module/certificates/certificates.module').then(m => m.CertificatesModule)
        },
        {
          path:'cash-drawer',
          loadChildren:() => import('./module/cashdrawer/cashdrawer.module').then(m => m.CashdrawerModule)
        },
        {
          path:'reports',
          loadChildren:() => import('./module/reports/reports.module').then(m => m.ReportsModule)
        },
        {
          path:'admin',
          loadChildren:() => import('./module/admin/admin.module').then(m => m.AdminModule)
        },
        {
          path:'my-account',
          loadChildren:() => import('./my-account/my-account.module').then(m => m.MyAccountModule)
        },
        {
          path:'settings',
          loadChildren:() => import('./module/settings/settings.module').then(m => m.SettingsModule)
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
