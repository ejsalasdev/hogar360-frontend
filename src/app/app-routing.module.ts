import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCategoryPageComponent } from './ui/components/pages/create-category-page/create-category-page.component';
import { MainLayoutComponent } from './ui/layout/main-layout/main-layout.component'; // Importa MainLayoutComponent

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent, // Usa MainLayoutComponent como el layout
    children: [
      { path: 'admin/create-category', component: CreateCategoryPageComponent },
      { path: '', redirectTo: 'admin/create-category', pathMatch: 'full' },
      // ... otras rutas de la sección de administración ...
    ],
  },
  // Aquí podrías definir rutas para la vista pública sin el layout
  // { path: 'public/home', component: PublicHomePageComponent },
  // { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
