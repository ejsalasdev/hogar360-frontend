import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';

@Component({
  selector: 'atm-confirm-dialog',
  templateUrl: './confirm-dialog-atom.component.html',
  styleUrls: ['./confirm-dialog-atom.component.scss']
})
export class ConfirmDialogAtomComponent {
  @Input() show: boolean = false;
  @Input() title: string = 'Confirmar acción';
  @Input() message: string = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.show) {
      this.onCancel();
    }
  }
} 