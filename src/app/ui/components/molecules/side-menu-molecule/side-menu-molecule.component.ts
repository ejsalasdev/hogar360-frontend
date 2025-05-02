import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'mol-side-menu',
  templateUrl: './side-menu-molecule.component.html',
  styleUrls: ['./side-menu-molecule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuMoleculeComponent {
  @Input() menuItems: MenuItem[] = [];
}
