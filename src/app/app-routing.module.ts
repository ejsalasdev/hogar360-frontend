import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryPageComponent } from './ui/components/pages/category-page/category-page.component';
import { LocationPageComponent } from './ui/components/pages/location-page/location-page.component';
import { MainLayoutComponent } from './ui/layout/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { 
        path: 'admin/categories',
        children: [
          { path: 'create', component: CategoryPageComponent },
          { path: '', redirectTo: 'create', pathMatch: 'full' }
        ]
      },
      {
        path: 'admin/locations',
        children: [
          { path: 'create', component: LocationPageComponent },
          { path: '', redirectTo: 'create', pathMatch: 'full' }
        ]
      },
      { path: '', redirectTo: 'admin/categories', pathMatch: 'full' }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
