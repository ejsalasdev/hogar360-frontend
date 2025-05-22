import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryPageComponent } from './ui/components/pages/category-page/category-page.component';
import { LocationPageComponent } from './ui/components/pages/location-page/location-page.component';
import { MainLayoutComponent } from './ui/layout/main-layout/main-layout.component';
import { UserPageComponent } from './ui/components/pages/user-page/user-page.component';
import { HousePageComponent } from './ui/components/pages/house-page/house-page.component';
import { LoginPageComponent } from './ui/components/pages/login-page/login-page.component';
import { HomePageComponent } from './ui/components/pages/home-page/home-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'admin/categories',
        children: [
          { path: 'create', component: CategoryPageComponent },
          { path: '', redirectTo: 'create', pathMatch: 'full' },
        ],
      },
      {
        path: 'admin/locations',
        children: [
          { path: 'create', component: LocationPageComponent },
          { path: '', redirectTo: 'create', pathMatch: 'full' },
        ],
      },
      {
        path: 'admin/users',
        children: [
          { path: 'create', component: UserPageComponent },
          { path: '', redirectTo: 'create', pathMatch: 'full' },
        ],
      },
      {
        path: 'admin/houses',
        children: [
          { path: 'create', component: HousePageComponent },
          { path: '', redirectTo: 'create', pathMatch: 'full' },
        ],
      },
      { path: '', redirectTo: 'admin/categories', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
