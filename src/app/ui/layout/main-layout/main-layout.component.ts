import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

interface UserInfo {
  name: string;
  welcomeMessage: string;
  avatarUrl: string;
}

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

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard.png', route: '/dashboard' },
    { label: 'Categorías', icon: 'category.png', route: '/admin/categories' },
    { label: 'Propiedades', icon: 'property.png', route: '/admin/properties' },
    { label: 'Usuarios', icon: 'user.png', route: '/admin/users' },
    { label: 'Configuración', icon: 'config.png', route: '/admin/settings' },
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
