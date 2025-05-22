import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AtomsModule } from '../atoms/atoms.module';
import { CategoryPageComponent } from './category-page/category-page.component';
import { LocationPageComponent } from './location-page/location-page.component';
import { MoleculesModule } from '../molecules/molecules.module';
import { OrganismsModule } from '../organisms/organisms.module';
import { UserPageComponent } from './user-page/user-page.component';
import { HousePageComponent } from './house-page/house-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { AccessDeniedPageComponent } from './access-denied-page/access-denied-page.component';

@NgModule({
  declarations: [
    CategoryPageComponent,
    LocationPageComponent,
    UserPageComponent,
    HousePageComponent,
    LoginPageComponent,
    HomePageComponent,
    DashboardPageComponent,
    AccessDeniedPageComponent
  ],
  imports: [
    CommonModule,
    AtomsModule,
    HttpClientModule,
    MoleculesModule,
    ReactiveFormsModule,
    OrganismsModule
  ],
  exports: [
    CategoryPageComponent,
    LocationPageComponent,
    ReactiveFormsModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class PagesModule { }
