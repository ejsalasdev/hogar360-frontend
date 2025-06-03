import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AtomsModule } from './ui/components/atoms/atoms.module';
import { MoleculesModule } from './ui/components/molecules/molecules.module';
import { PagesModule } from './ui/components/pages/pages.module';
import { MainLayoutComponent } from './ui/layout/main-layout/main-layout.component';
import { OrganismsModule } from './ui/components/organisms/organisms.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { RoleInterceptor } from './core/interceptors/role.interceptor';

@NgModule({
  declarations: [AppComponent, MainLayoutComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'),
        allowedDomains: [environment.apiUrl.replace(/^https?:\/\//, '')]
      }
    }),
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
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RoleInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
