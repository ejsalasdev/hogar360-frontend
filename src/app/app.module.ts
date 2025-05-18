import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AtomsModule } from './ui/components/atoms/atoms.module';
import { MoleculesModule } from './ui/components/molecules/molecules.module';
import { PagesModule } from './ui/components/pages/pages.module';
import { MainLayoutComponent } from './ui/layout/main-layout/main-layout.component';
import { OrganismsModule } from './ui/components/organisms/organisms.module';
import { AuthInterceptor } from './core/services/auth.interceptor';

@NgModule({
  declarations: [AppComponent, MainLayoutComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AtomsModule,
    MoleculesModule,
    PagesModule,
    OrganismsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
