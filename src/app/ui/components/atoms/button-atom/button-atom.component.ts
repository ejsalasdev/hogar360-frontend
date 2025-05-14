import { Component, Input } from '@angular/core';

@Component({
  selector: 'atm-button',
  templateUrl: './button-atom.component.html',
  styleUrls: ['./button-atom.component.scss']
})
export class ButtonAtomComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() icon: string | null = null;
  @Input() label: string = '';
} 