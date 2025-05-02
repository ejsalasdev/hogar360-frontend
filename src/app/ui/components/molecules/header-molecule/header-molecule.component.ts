import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mol-header',
  templateUrl: './header-molecule.component.html',
  styleUrls: ['./header-molecule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderMoleculeComponent {
  @Input() logoText: string = 'Hogar 360'; // Texto del logotipo
  @Input() welcomeMessage: string = 'Bienvenido'; // Mensaje de bienvenida
  @Input() userName: string = 'Admin'; // Nombre del usuario
  @Input() userAvatarUrl: string = ''; // URL de la imagen del avatar (si tienes una)
}
