import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryPageComponent } from './ui/components/pages/category-page/category-page.component';
import { LocationPageComponent } from './ui/components/pages/location-page/location-page.component';
import { MainLayoutComponent } from './ui/layout/main-layout/main-layout.component';
import { UserPageComponent } from './ui/components/pages/user-page/user-page.component';
import { HousePageComponent } from './ui/components/pages/house-page/house-page.component';
import { LoginPageComponent } from './ui/components/pages/login-page/login-page.component';
import { HomePageComponent } from './ui/components/pages/home-page/home-page.component';
import { DashboardPageComponent } from './ui/components/pages/dashboard-page/dashboard-page.component';
import { AccessDeniedPageComponent } from './ui/components/pages/access-denied-page/access-denied-page.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'access-denied', component: AccessDeniedPageComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { 
        path: 'dashboard', 
        component: DashboardPageComponent 
      },
      {
        path: 'admin/categories',
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'SELLER'] },
        component: CategoryPageComponent,
      },
      {
        path: 'admin/locations',
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'SELLER'] },
        component: LocationPageComponent
      },
      {
        path: 'admin/users',
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] },
        component: UserPageComponent
      },
      {
        path: 'admin/houses',
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'SELLER'] },
        component: HousePageComponent
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  // Ruta de fallback
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
