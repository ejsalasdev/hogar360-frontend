import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mol-header',
  templateUrl: './header-molecule.component.html',
  styleUrls: ['./header-molecule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderMoleculeComponent {
  @Input() logoText: string = 'Hogar 360';
  @Input() welcomeMessage: string = 'Bienvenido';
  @Input() userName: string = 'Admin';
  @Input() userAvatarUrl: string = '';
}
