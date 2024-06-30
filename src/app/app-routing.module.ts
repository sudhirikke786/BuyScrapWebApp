import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteLayoutComponent } from './common/site-layout/site-layout.component';
import { OrganizationLoginComponent } from './organization-login/organization-login.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { PrintTicketComponent } from './print-ticket/print-ticket.component';
import { ErrorComponent } from './error/error.component';
import { RoleGuard } from './core/guard/role.guard';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SuccessPageComponent } from './success-page/success-page.component';

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
    path:'print-layout',
    component: PrintTicketComponent
  },
  {
    path:'error',
    component: ErrorComponent
  },
  { 
    path: ':orgName/user-login', 
    component: UserLoginComponent 
  },
  {
    path:'sign-up',
    component: SignUpComponent
  },
  {
    path:'stripe-checkout',
    component:SuccessPageComponent
  },
  { 
      path: ':orgName',
      component: SiteLayoutComponent, 
      children: [
        { 
          path: '', 
          loadChildren:() => import('./module/tickets/tickets.module').then(m => m.TicketsModule),
          pathMatch: 'full',
          canActivate: [RoleGuard],
          data: { requiredRole:['Administrator','Scale','Cashier']},
        },
        { 
          path: 'home', 
          loadChildren:() => import('./module/tickets/tickets.module').then(m => m.TicketsModule),
          canActivate: [RoleGuard],
          data: { requiredRole:['Administrator','Scale','Cashier']},
        },
        { 
          path: 'invoice', 
          loadChildren:() => import('./module/invoice/tickets-invoice.module').then((m =>m.TicketsInvoiceModule)),
          canActivate: [RoleGuard],
          data: { requiredRole:['Administrator','Scale','Cashier']},
        },
        {
          path:'sellers-buyers',
          loadChildren:() => import('./module/sellers/sellers.module').then(m => m.SellersModule),
          canActivate: [RoleGuard],
          data: { requiredRole:['Administrator','Cashier']},
        },
        {
          path:'ship-out',
          loadChildren:() => import('./module/shipout/shipout.module').then(m => m.ShipoutModule),
          canActivate: [RoleGuard],
          data: { requiredRole: ['Administrator','Cashier']},
        },
        {
          path:'materials',
          loadChildren:() => import('./module/materials/materials.module').then(m => m.MaterialsModule),
          canActivate: [RoleGuard],
          data: { requiredRole: ['Administrator','Cashier']},
        },
        {
          path:'adjustment',
          loadChildren:() => import('./module/adjustment/adjustment.module').then(m => m.AdjustmentModule),
          canActivate: [RoleGuard],
          data: { requiredRole:['Administrator','Cashier']},
        },
        {
          path:'regrade',
          loadChildren:() => import('./module/regrade/regrade.module').then(m => m.RegradeModule),
          canActivate: [RoleGuard],
          data: { requiredRole:['Administrator','Cashier']},
        },
        {
          path:'certificates',
          loadChildren:() => import('./module/certificates/certificates.module').then(m => m.CertificatesModule),
          canActivate: [RoleGuard],
          data: { requiredRole:['Administrator','Cashier']},
        },
        {
          path:'cash-drawer',
          loadChildren:() => import('./module/cashdrawer/cashdrawer.module').then(m => m.CashdrawerModule),
          canActivate: [RoleGuard],
          data: { requiredRole: ['Administrator','Cashier']},
        },
        {
          path:'reports',
          loadChildren:() => import('./module/reports/reports.module').then(m => m.ReportsModule),
          canActivate: [RoleGuard],
          data: { requiredRole:['Administrator','Cashier']},
        },
        {
          path:'admin',
          loadChildren:() => import('./module/admin/admin.module').then(m => m.AdminModule),
          canActivate: [RoleGuard],
          data: { requiredRole: ['Administrator']},
        },
        {
          path:'my-account',
          loadChildren:() => import('./my-account/my-account.module').then(m => m.MyAccountModule),
          canActivate: [RoleGuard],
          data: { requiredRole: ['Administrator','Cashier']},
        },
        {
          path:'settings',
          loadChildren:() => import('./module/settings/settings.module').then(m => m.SettingsModule),
          canActivate: [RoleGuard],
          data: { requiredRole: ['Administrator','Cashier','Scale']},
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
