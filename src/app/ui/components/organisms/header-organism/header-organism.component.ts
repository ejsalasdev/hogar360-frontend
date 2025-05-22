import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

interface HeaderConfig {
  logoText: string;
  welcomeMessage: string;
  userName: string;
  userAvatarUrl: string;
  showUserMenu?: boolean;
}

const DEFAULT_CONFIG: HeaderConfig = {
  logoText: 'Hogar 360',
  welcomeMessage: 'Bienvenido',
  userName: 'Admin',
  userAvatarUrl: '',
  showUserMenu: true
};

@Component({
  selector: 'org-header',
  templateUrl: './header-organism.component.html',
  styleUrls: ['./header-organism.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderOrganismComponent {
  @Input() set config(value: Partial<HeaderConfig>) {
    this._config = { ...DEFAULT_CONFIG, ...value };
  }
  get config(): HeaderConfig {
    return this._config;
  }

  @Output() userMenuClick = new EventEmitter<void>();
  @Output() logoClick = new EventEmitter<void>();

  private _config: HeaderConfig = DEFAULT_CONFIG;
  isUserMenuOpen = false;
  isAdminView = false;

  constructor(private router: Router) {
    this.isAdminView = this.checkIfAdminView();
  }

  private checkIfAdminView(): boolean {
    // Considera rutas que contienen '/admin' o '/user' como vistas administrables
    return this.router.url.includes('/admin') || this.router.url.includes('/user');
  }

  get logoText(): string {
    return this._config.logoText;
  }

  get welcomeMessage(): string {
    return this._config.welcomeMessage;
  }

  get userName(): string {
    return this._config.userName;
  }

  get userAvatarUrl(): string {
    return this._config.userAvatarUrl;
  }

  get showUserMenu(): boolean {
    return this._config.showUserMenu ?? true;
  }

  onLogoClick(): void {
    this.logoClick.emit();
  }

  onUserMenuClick(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.userMenuClick.emit();
  }

  onUserMenuOutsideClick(): void {
    this.isUserMenuOpen = false;
  }

  onLoginClick(): void {
    // Redirige al login usando el router
    window.location.href = '/login';
  }
}