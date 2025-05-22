import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  disabled?: boolean;
}

@Component({
  selector: 'org-side-menu',
  templateUrl: './side-menu-organism.component.html',
  styleUrls: ['./side-menu-organism.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuOrganismComponent {
  @Input() menuItems: MenuItem[] = [];
  @Output() itemClick = new EventEmitter<MenuItem>();

  trackByFn(index: number, item: MenuItem): string {
    return item.id;
  }

  onItemClick(item: MenuItem): void {
    if (!item.disabled) {
      this.itemClick.emit(item);
    }
  }
}
