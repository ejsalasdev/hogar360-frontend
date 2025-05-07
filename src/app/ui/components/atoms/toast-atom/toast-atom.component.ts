import { Component, Input } from '@angular/core';

@Component({
  selector: 'atm-toast',
  templateUrl: './toast-atom.component.html',
  styleUrls: ['./toast-atom.component.scss']
})
export class ToastAtomComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Input() show: boolean = false;
} 