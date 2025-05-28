import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from '../../components/organisms/side-menu-organism/side-menu-organism.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { RoleService, UserRoles } from 'src/app/core/services/role.service';
import { Subject, takeUntil } from 'rxjs';

interface UserInfo {
  name: string;
  welcomeMessage: string;
  avatarUrl: string;
  role: string;
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard.png',
    route: '/dashboard',
  },
  {
    id: 'categories',
    label: 'Categorías',
    icon: 'category.png',
    route: '/admin/categories',
  },
  {
    id: 'locations',
    label: 'Ubicaciones',
    icon: 'ubication.png',
    route: '/admin/locations',
  },
  {
    id: 'houses',
    label: 'Propiedades',
    icon: 'property.png',
    route: '/admin/houses',
  },
  { id: 'users', label: 'Usuarios', icon: 'user.png', route: '/admin/users' },
  {
    id: 'settings',
    label: 'Configuración',
    icon: 'config.png',
    route: '/admin/settings',
  },
];

@Component({
  selector: 'lay-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  user: UserInfo = {
    name: 'Admin',
    welcomeMessage: 'Bienvenido',
    avatarUrl: '/assets/images/avatar.jpg',
    role: 'ADMIN',
  };

  menuItems: MenuItem[] = DEFAULT_MENU_ITEMS;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.initializeUserState();

    this.authService.user$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((userInfo) => {
      console.log('User info received:', userInfo);
      if (userInfo) {
        this.user = {
          name: userInfo.name || 'Usuario',
          welcomeMessage: 'Bienvenido',
          avatarUrl: '/assets/images/avatar.jpg',
          role: this.determineUserRole(userInfo.roles),
        };

        this.filterMenuItemsByRole();
        this.cdr.markForCheck();
      } else {
        this.initializeUserState();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeUserState(): void {
    const userRoles = this.roleService.getUserRoles();
    console.log('Direct user roles:', userRoles);

    const displayRole = this.getRoleForDisplay(userRoles);
    console.log('Display role:', displayRole);

    const decodedToken = this.authService.getDecodedToken();
    if (decodedToken) {
      this.user = {
        name: decodedToken.name || 'Usuario',
        welcomeMessage: 'Bienvenido',
        avatarUrl: '/assets/images/avatar.jpg',
        role: displayRole,
      };
    } else {
      this.user = {
        name: 'Admin',
        welcomeMessage: 'Bienvenido',
        avatarUrl: '/assets/images/avatar.jpg',
        role: displayRole,
      };
    }

    this.filterMenuItemsByRole();
    this.cdr.markForCheck();
  }

  private getRoleForDisplay(roles: UserRoles): string {
    if (roles.isAdmin) {
      return 'ADMIN';
    } else if (roles.isSeller) {
      return 'SELLER';
    } else if (roles.isBuyer) {
      return 'BUYER';
    }
    return 'USUARIO';
  }

  private determineUserRole(roles: string[]): string {
    console.log('Determining role from:', roles);

    if (!roles || !Array.isArray(roles)) {
      console.log('Invalid roles array, returning default');
      return 'USUARIO';
    }

    if (roles.includes('ADMIN')) {
      return 'ADMIN';
    } else if (roles.includes('SELLER')) {
      return 'SELLER';
    } else if (roles.includes('BUYER')) {
      return 'BUYER';
    }
    return 'USUARIO';
  }

  private filterMenuItemsByRole(): void {
    const roles = this.roleService.getUserRoles();

    this.menuItems = [...DEFAULT_MENU_ITEMS.filter((item) => {
      if (item.id === 'dashboard') {
        return true;
      }

      if (item.id === 'locations' && !roles.isAdmin && !roles.isSeller) {
        return false;
      }

      if (item.id === 'users' && !roles.isAdmin) {
        return false;
      }

      if (item.id === 'categories' && !roles.isAdmin && !roles.isSeller) {
        return false;
      }

      if (item.id === 'houses' && !roles.isAdmin && !roles.isSeller) {
        return false;
      }

      return true;
    })];
  }

  onMenuItemClick(item: MenuItem): void {
    if (item.disabled) {
      return;
    }

    if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
}
