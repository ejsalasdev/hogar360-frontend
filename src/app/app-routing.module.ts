import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCategoryPageComponent } from './ui/components/pages/create-category-page/create-category-page.component';
import { MainLayoutComponent } from './ui/layout/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { 
        path: 'admin/categories',
        children: [
          { path: 'create', component: CreateCategoryPageComponent },
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
