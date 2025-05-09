import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  disabled?: boolean;
}

@Component({
  selector: 'mol-side-menu',
  templateUrl: './side-menu-molecule.component.html',
  styleUrls: ['./side-menu-molecule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuMoleculeComponent {
  @Input() menuItems: MenuItem[] = [];
  @Input() activeItemId: string | null = null;
  @Output() itemClick = new EventEmitter<MenuItem>();

  trackByFn(index: number, item: MenuItem): string {
    return item.id;
  }

  onItemClick(item: MenuItem): void {
    if (!item.disabled) {
      this.itemClick.emit(item);
    }
  }

  isItemActive(item: MenuItem): boolean {
    return item.id === this.activeItemId;
  }
}
