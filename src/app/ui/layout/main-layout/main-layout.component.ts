import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuItem } from '../../components/organisms/side-menu-organism/side-menu-organism.component';

interface UserInfo {
  name: string;
  welcomeMessage: string;
  avatarUrl: string;
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard.png', route: '/dashboard' },
  { id: 'categories', label: 'Categorías', icon: 'category.png', route: '/admin/categories' },
  { id: 'locations', label: 'Ubicaciones', icon: 'ubication.png', route: '/admin/locations' },
  { id: 'houses', label: 'Propiedades', icon: 'property.png', route: '/admin/houses' },
  { id: 'users', label: 'Usuarios', icon: 'user.png', route: '/admin/users' },
  { id: 'settings', label: 'Configuración', icon: 'config.png', route: '/admin/settings' },
];

@Component({
  selector: 'lay-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  user: UserInfo = {
    name: 'Admin',
    welcomeMessage: 'Bienvenido',
    avatarUrl: '/assets/images/avatar.jpg',
  };

  menuItems: MenuItem[] = DEFAULT_MENU_ITEMS;
  activeItemId: string | null = null;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupRouteListener();
  }

  private setupRouteListener(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const currentRoute = event.urlAfterRedirects;
      this.updateActiveMenuItem(currentRoute);
    });
  }

  private updateActiveMenuItem(route: string): void {
    const activeItem = this.menuItems.find(item => route.startsWith(item.route));
    this.activeItemId = activeItem?.id || null;
    this.cdr.markForCheck();
  }

  onMenuItemClick(item: MenuItem): void {
    if (!item.disabled) {
      this.router.navigate([item.route]);
    }
  }
}
