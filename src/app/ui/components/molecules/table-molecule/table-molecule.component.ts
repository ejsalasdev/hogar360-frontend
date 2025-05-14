import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mol-table',
  templateUrl: './table-molecule.component.html',
  styleUrls: ['./table-molecule.component.scss']
})
export class TableMoleculeComponent {
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() actions: any[] = [];
  @Input() pagination: any = null;
  @Input() loading: boolean = false;
  @Output() action = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<number>();

  onAction(type: string, row: any) {
    this.action.emit({ type, row });
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }
} 