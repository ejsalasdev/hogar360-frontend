import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-modal-organism',
  templateUrl: './modal-organism.component.html',
  styleUrls: ['./modal-organism.component.scss']
})
export class ModalOrganismComponent {
  @Input() isVisible: boolean = false;
  @Input() showCloseButton: boolean = true;
  @Input() closeOnOutsideClick: boolean = true;
  @Input() closeOnEscape: boolean = true;

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  closeModal(): void {
    this.close.emit();
  }

  onOverlayClick(): void {
    if (this.closeOnOutsideClick) {
      this.closeModal();
    }
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation(); // Prevents click on dialog from closing modal
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent): void {
    if (this.isVisible && this.closeOnEscape) {
      this.closeModal();
    }
  }
}
