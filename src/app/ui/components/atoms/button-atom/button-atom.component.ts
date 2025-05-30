import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'atm-button',
  templateUrl: './button-atom.component.html',
  styleUrls: ['./button-atom.component.scss']
})
export class ButtonAtomComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() styleType: 'primary' | 'secondary' | 'danger' = 'primary'; // alias for variant
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() icon: string | null = null;
  @Input() label: string = '';

  get effectiveVariant() {
    return this.styleType || this.variant;
  }
  
  @Output() onClick = new EventEmitter<void>();

  onButtonClick(): void {
    if (!this.disabled && !this.loading) {
      if (this.type !== 'submit') {
        this.onClick.emit();
      }
    }
  }
} 