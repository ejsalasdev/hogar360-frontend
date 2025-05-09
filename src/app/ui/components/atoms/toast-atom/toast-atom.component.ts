import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastConfig {
  message: string;
  type: ToastType;
  duration?: number;
}

@Component({
  selector: 'atm-toast',
  templateUrl: './toast-atom.component.html',
  styleUrls: ['./toast-atom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastAtomComponent implements OnChanges {
  @Input() set config(value: ToastConfig) {
    this._config = {
      ...this._config,
      ...value
    };
  }
  get config(): ToastConfig {
    return this._config;
  }

  @Output() closed = new EventEmitter<void>();

  private _config: ToastConfig = {
    message: '',
    type: 'info',
    duration: 3000
  };

  private timeoutId?: number;

  get message(): string {
    return this._config.message;
  }

  get type(): ToastType {
    return this._config.type;
  }

  get show(): boolean {
    return !!this._config.message;
  }

  get icon(): string {
    switch (this.type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'exclamation-circle';
      default:
        return 'info-circle';
    }
  }

  get ariaLabel(): string {
    return `${this.type === 'success' ? 'Éxito' : this.type === 'error' ? 'Error' : 'Información'}: ${this.message}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this._config.message) {
      this.startTimeout();
    }
  }

  private startTimeout(): void {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = window.setTimeout(() => {
      this.onClose();
    }, this._config.duration);
  }

  onClose(): void {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
    this._config.message = '';
    this.closed.emit();
  }
} 