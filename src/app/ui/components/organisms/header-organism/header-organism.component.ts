import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

interface HeaderConfig {
  logoText: string;
  welcomeMessage: string;
  userName: string;
  userAvatarUrl: string;
  showUserMenu?: boolean;
  userRole?: string;
}

const DEFAULT_CONFIG: HeaderConfig = {
  logoText: 'Hogar 360',
  welcomeMessage: 'Bienvenido',
  userName: 'Usuario',
  userAvatarUrl: '/assets/images/avatar.jpg',
  showUserMenu: true,
  userRole: ''
};

@Component({
  selector: 'org-header',
  templateUrl: './header-organism.component.html',
  styleUrls: ['./header-organism.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderOrganismComponent implements OnInit {
  @Input() set config(value: Partial<HeaderConfig>) {
    this._config = { ...DEFAULT_CONFIG, ...value };
    if (this.cdr) {
      this.cdr.markForCheck();
    }
  }
  get config(): HeaderConfig {
    return this._config;
  }

  @Output() userMenuClick = new EventEmitter<void>();
  @Output() logoClick = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();

  private _config: HeaderConfig = DEFAULT_CONFIG;
  isUserMenuOpen = false;
  isAdminView = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.isAdminView = this.checkIfAdminView();
  }

  ngOnInit(): void {
    const token = this.authService.getDecodedToken();
    
    this.router.events.subscribe(() => {
      this.isAdminView = this.checkIfAdminView();
    });
  }

  private checkIfAdminView(): boolean {
    return this.router.url.includes('/admin') || 
           this.router.url.includes('/dashboard') || 
           this.router.url.includes('/user');
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

  get userRole(): string {
    // Depuración
    console.log('userRole from config:', this._config.userRole);
    return this._config.userRole || '';
  }

  get showUserMenu(): boolean {
    return this._config.showUserMenu ?? true;
  }

  onLogoClick(): void {
    this.logoClick.emit();
    if (this.isAdminView) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

  onUserMenuClick(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.userMenuClick.emit();
  }

  onUserMenuOutsideClick(): void {
    this.isUserMenuOpen = false;
  }

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }

  onLogoutClick(): void {
    this.isUserMenuOpen = false;
    this.logoutClick.emit();
    this.authService.logout();
  }
}