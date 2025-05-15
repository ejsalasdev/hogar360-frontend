import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'org-table',
  templateUrl: './table-organism.component.html',
  styleUrls: ['./table-organism.component.scss']
})
export class TableOrganismComponent {
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() actions: any[] = [];
  @Input() pagination: any = null;
  @Input() loading: boolean = false;
  @Input() orderAsc: boolean = true;
  @Output() action = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() sortByName = new EventEmitter<void>();

  onAction(type: string, row: any) {
    this.action.emit({ type, row });
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onSortByName() {
    this.sortByName.emit();
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.pagination?.totalPages || 0 }, (_, i) => i);
  }

  getSmartPagination(): (number | string)[] {
    const total = this.pagination?.totalPages || 0;
    const current = this.pagination?.currentPage || 0;
    const maxButtons = 5;
    const buttons: (number | string)[] = [];

    if (total <= maxButtons) {
      for (let i = 0; i < total; i++) {
        buttons.push(i);
      }
    } else {
      if (current <= 2) {
        for (let i = 0; i < maxButtons; i++) buttons.push(i);
        buttons.push('...');
        buttons.push(total - 1);
      } else if (current >= total - 3) {
        buttons.push(0);
        buttons.push('...');
        for (let i = total - maxButtons; i < total; i++) buttons.push(i);
      } else {
        buttons.push(0);
        buttons.push('...');
        for (let i = current - 1; i <= current + 1; i++) buttons.push(i);
        buttons.push('...');
        buttons.push(total - 1);
      }
    }
    return buttons;
  }

  isNumber(value: any): value is number {
    return typeof value === 'number';
  }
} 