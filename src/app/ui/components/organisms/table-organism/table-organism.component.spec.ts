import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TableOrganismComponent } from './table-organism.component';

describe('TableOrganismComponent', () => {
  let component: TableOrganismComponent;
  let fixture: ComponentFixture<TableOrganismComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableOrganismComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TableOrganismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      // Arrange & Act (done in beforeEach)
      
      // Assert
      expect(component).toBeTruthy();
    });

    it('should have default property values', () => {
      // Arrange & Act (done in beforeEach)
      
      // Assert
      expect(component.columns).toEqual([]);
      expect(component.data).toEqual([]);
      expect(component.actions).toEqual([]);
      expect(component.pagination).toBeNull();
      expect(component.loading).toBe(false);
      expect(component.orderAsc).toBe(true);
      expect(component.sort).toBeNull();
    });
  });

  describe('Table Rendering', () => {
    it('should render table with columns', () => {
      // Arrange
      component.columns = [
        { key: 'name', label: 'Nombre' },
        { key: 'email', label: 'Email' }
      ];

      // Act
      fixture.detectChanges();
      const headers = fixture.debugElement.queryAll(By.css('th'));

      // Assert
      expect(headers.length).toBe(2);
      expect(headers[0].nativeElement.textContent.trim()).toContain('Nombre');
      expect(headers[1].nativeElement.textContent.trim()).toContain('Email');
    });

    it('should render table with data', () => {
      // Arrange
      component.columns = [
        { key: 'name', label: 'Nombre' },
        { key: 'email', label: 'Email' }
      ];
      component.data = [
        { name: 'Juan', email: 'juan@test.com' },
        { name: 'María', email: 'maria@test.com' }
      ];

      // Act
      fixture.detectChanges();
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      const firstRowCells = rows[0].queryAll(By.css('td'));

      // Assert
      expect(rows.length).toBe(2);
      expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('Juan');
      expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('juan@test.com');
    });

    it('should render actions column when actions are provided', () => {
      // Arrange
      component.columns = [{ key: 'name', label: 'Nombre' }];
      component.actions = [{ type: 'edit', icon: 'edit', tooltip: 'Editar' }];

      // Act
      fixture.detectChanges();
      const headers = fixture.debugElement.queryAll(By.css('th'));

      // Assert
      expect(headers.length).toBe(2);
      expect(headers[1].nativeElement.textContent.trim()).toBe('Acciones');
    });

    it('should not render actions column when no actions are provided', () => {
      // Arrange
      component.columns = [{ key: 'name', label: 'Nombre' }];
      component.actions = [];

      // Act
      fixture.detectChanges();
      const headers = fixture.debugElement.queryAll(By.css('th'));

      // Assert
      expect(headers.length).toBe(1);
    });
  });

  describe('Empty State', () => {
    it('should show empty message when no data is provided', () => {
      // Arrange
      component.data = [];
      component.loading = false;

      // Act
      fixture.detectChanges();
      const emptyElement = fixture.debugElement.query(By.css('.org-table__empty'));

      // Assert
      expect(emptyElement).toBeTruthy();
      expect(emptyElement.nativeElement.textContent.trim()).toBe('No hay datos para mostrar.');
    });

    it('should show loading message when loading is true', () => {
      // Arrange
      component.loading = true;

      // Act
      fixture.detectChanges();
      const loadingElement = fixture.debugElement.query(By.css('.org-table__loading'));

      // Assert
      expect(loadingElement).toBeTruthy();
      expect(loadingElement.nativeElement.textContent.trim()).toBe('Cargando...');
    });

    it('should not show empty message when loading is true', () => {
      // Arrange
      component.data = [];
      component.loading = true;

      // Act
      fixture.detectChanges();
      const emptyElement = fixture.debugElement.query(By.css('.org-table__empty'));

      // Assert
      expect(emptyElement).toBeFalsy();
    });
  });

  describe('Sorting', () => {
    beforeEach(() => {
      component.columns = [
        { key: 'name', label: 'Nombre', sortable: true },
        { key: 'email', label: 'Email', sortable: false }
      ];
      fixture.detectChanges();
    });

    it('should render sort button for sortable columns', () => {
      // Arrange & Act (done in beforeEach)
      const sortButtons = fixture.debugElement.queryAll(By.css('.org-table__sort-btn'));

      // Assert
      expect(sortButtons.length).toBe(1);
    });

    it('should not render sort button for non-sortable columns', () => {
      // Arrange
      component.columns = [{ key: 'name', label: 'Nombre', sortable: false }];

      // Act
      fixture.detectChanges();
      const sortButtons = fixture.debugElement.queryAll(By.css('.org-table__sort-btn'));

      // Assert
      expect(sortButtons.length).toBe(0);
    });

    it('should emit sortChange when sort button is clicked', () => {
      // Arrange
      jest.spyOn(component.sortChange, 'emit');
      const sortButton = fixture.debugElement.query(By.css('.org-table__sort-btn'));

      // Act
      sortButton.triggerEventHandler('click', null);

      // Assert
      expect(component.sortChange.emit).toHaveBeenCalledWith({
        key: 'name',
        direction: 'asc'
      });
    });

    it('should toggle sort direction when same column is sorted again', () => {
      // Arrange
      component.sort = { key: 'name', direction: 'asc' };
      jest.spyOn(component.sortChange, 'emit');
      const sortButton = fixture.debugElement.query(By.css('.org-table__sort-btn'));

      // Act
      sortButton.triggerEventHandler('click', null);

      // Assert
      expect(component.sortChange.emit).toHaveBeenCalledWith({
        key: 'name',
        direction: 'desc'
      });
    });

    it('should show ascending sort indicator', () => {
      // Arrange
      component.sort = { key: 'name', direction: 'asc' };

      // Act
      fixture.detectChanges();
      const sortButton = fixture.debugElement.query(By.css('.org-table__sort-btn'));

      // Assert
      expect(sortButton.nativeElement.textContent).toContain('▲');
    });

    it('should show descending sort indicator', () => {
      // Arrange
      component.sort = { key: 'name', direction: 'desc' };

      // Act
      fixture.detectChanges();
      const sortButton = fixture.debugElement.query(By.css('.org-table__sort-btn'));

      // Assert
      expect(sortButton.nativeElement.textContent).toContain('▼');
    });

    it('should show neutral sort indicator when column is not sorted', () => {
      // Arrange
      component.sort = null;

      // Act
      fixture.detectChanges();
      const sortButton = fixture.debugElement.query(By.css('.org-table__sort-btn'));

      // Assert
      expect(sortButton.nativeElement.textContent).toContain('⇅');
    });
  });

  describe('Actions', () => {
    beforeEach(() => {
      component.columns = [{ key: 'name', label: 'Nombre' }];
      component.data = [{ name: 'Juan' }];
      component.actions = [
        { type: 'edit', icon: 'edit', tooltip: 'Editar' },
        { type: 'delete', icon: 'delete', tooltip: 'Eliminar' }
      ];
      fixture.detectChanges();
    });

    it('should render action buttons for each action', () => {
      // Arrange & Act (done in beforeEach)
      const actionButtons = fixture.debugElement.queryAll(By.css('.org-table__action-btn'));

      // Assert
      expect(actionButtons.length).toBe(2);
    });

    it('should emit action event when action button is clicked', () => {
      // Arrange
      jest.spyOn(component.action, 'emit');
      const editButton = fixture.debugElement.query(By.css('.org-table__action-btn'));

      // Act
      editButton.triggerEventHandler('click', null);

      // Assert
      expect(component.action.emit).toHaveBeenCalledWith({
        type: 'edit',
        row: { name: 'Juan' }
      });
    });

    it('should set correct tooltip for action buttons', () => {
      // Arrange & Act (done in beforeEach)
      const actionButtons = fixture.debugElement.queryAll(By.css('.org-table__action-btn'));

      // Assert
      expect(actionButtons[0].nativeElement.title).toBe('Editar');
      expect(actionButtons[1].nativeElement.title).toBe('Eliminar');
    });

    it('should render action icons with correct src', () => {
      // Arrange & Act (done in beforeEach)
      const actionIcons = fixture.debugElement.queryAll(By.css('.org-table__action-icon'));

      // Assert
      expect(actionIcons[0].nativeElement.src).toContain('/assets/icons/edit.png');
      expect(actionIcons[1].nativeElement.src).toContain('/assets/icons/delete.png');
    });
  });

  describe('Pagination', () => {
    it('should not render pagination when pagination is null', () => {
      // Arrange
      component.pagination = null;

      // Act
      fixture.detectChanges();
      const paginationElement = fixture.debugElement.query(By.css('.org-table__pagination'));

      // Assert
      expect(paginationElement).toBeFalsy();
    });

    it('should not render pagination when totalPages is 1 or less', () => {
      // Arrange
      component.pagination = { totalPages: 1, currentPage: 0 };

      // Act
      fixture.detectChanges();
      const paginationElement = fixture.debugElement.query(By.css('.org-table__pagination'));

      // Assert
      expect(paginationElement).toBeFalsy();
    });

    it('should render pagination when totalPages is greater than 1', () => {
      // Arrange
      component.pagination = { totalPages: 3, currentPage: 0 };

      // Act
      fixture.detectChanges();
      const paginationElement = fixture.debugElement.query(By.css('.org-table__pagination'));

      // Assert
      expect(paginationElement).toBeTruthy();
    });

    it('should emit pageChange when pagination button is clicked', () => {
      // Arrange
      component.pagination = { totalPages: 3, currentPage: 0 };
      fixture.detectChanges();
      jest.spyOn(component.pageChange, 'emit');
      const paginationButtons = fixture.debugElement.queryAll(By.css('.org-table__pagination button'));

      // Act
      paginationButtons[1].triggerEventHandler('click', null);

      // Assert
      expect(component.pageChange.emit).toHaveBeenCalledWith(1);
    });

    it('should mark current page as active', () => {
      // Arrange
      component.pagination = { totalPages: 3, currentPage: 1 };

      // Act
      fixture.detectChanges();
      const paginationButtons = fixture.debugElement.queryAll(By.css('.org-table__pagination button'));
      const activeButton = fixture.debugElement.query(By.css('.org-table__pagination button.active'));

      // Assert
      expect(activeButton).toBeTruthy();
      expect(activeButton.nativeElement.textContent.trim()).toBe('2'); // currentPage + 1
    });
  });

  describe('onAction Method', () => {
    it('should emit action with correct type and row', () => {
      // Arrange
      const mockRow = { id: 1, name: 'Test' };
      jest.spyOn(component.action, 'emit');

      // Act
      component.onAction('edit', mockRow);

      // Assert
      expect(component.action.emit).toHaveBeenCalledWith({
        type: 'edit',
        row: mockRow
      });
    });
  });

  describe('onPageChange Method', () => {
    it('should emit pageChange with correct page number', () => {
      // Arrange
      jest.spyOn(component.pageChange, 'emit');

      // Act
      component.onPageChange(2);

      // Assert
      expect(component.pageChange.emit).toHaveBeenCalledWith(2);
    });
  });

  describe('onSort Method', () => {
    it('should not emit sortChange when column is not sortable', () => {
      // Arrange
      const mockColumn = { key: 'name', sortable: false };
      jest.spyOn(component.sortChange, 'emit');

      // Act
      component.onSort(mockColumn);

      // Assert
      expect(component.sortChange.emit).not.toHaveBeenCalled();
    });

    it('should emit sortChange with ascending direction for new sort', () => {
      // Arrange
      const mockColumn = { key: 'name', sortable: true };
      component.sort = null;
      jest.spyOn(component.sortChange, 'emit');

      // Act
      component.onSort(mockColumn);

      // Assert
      expect(component.sortChange.emit).toHaveBeenCalledWith({
        key: 'name',
        direction: 'asc'
      });
    });

    it('should emit sortChange with descending direction when toggling from ascending', () => {
      // Arrange
      const mockColumn = { key: 'name', sortable: true };
      component.sort = { key: 'name', direction: 'asc' };
      jest.spyOn(component.sortChange, 'emit');

      // Act
      component.onSort(mockColumn);

      // Assert
      expect(component.sortChange.emit).toHaveBeenCalledWith({
        key: 'name',
        direction: 'desc'
      });
    });

    it('should emit sortChange with ascending direction when sorting different column', () => {
      // Arrange
      const mockColumn = { key: 'email', sortable: true };
      component.sort = { key: 'name', direction: 'desc' };
      jest.spyOn(component.sortChange, 'emit');

      // Act
      component.onSort(mockColumn);

      // Assert
      expect(component.sortChange.emit).toHaveBeenCalledWith({
        key: 'email',
        direction: 'asc'
      });
    });
  });

  describe('getPagesArray Method', () => {
    it('should return empty array when pagination is null', () => {
      // Arrange
      component.pagination = null;

      // Act
      const result = component.getPagesArray();

      // Assert
      expect(result).toEqual([]);
    });

    it('should return array of page numbers', () => {
      // Arrange
      component.pagination = { totalPages: 3 };

      // Act
      const result = component.getPagesArray();

      // Assert
      expect(result).toEqual([0, 1, 2]);
    });
  });

  describe('getSmartPagination Method', () => {
    it('should return all pages when total pages is less than or equal to max buttons', () => {
      // Arrange
      component.pagination = { totalPages: 4, currentPage: 1 };

      // Act
      const result = component.getSmartPagination();

      // Assert
      expect(result).toEqual([0, 1, 2, 3]);
    });

    it('should return smart pagination for current page near beginning', () => {
      // Arrange
      component.pagination = { totalPages: 10, currentPage: 1 };

      // Act
      const result = component.getSmartPagination();

      // Assert
      expect(result).toEqual([0, 1, 2, 3, 4, '...', 9]);
    });

    it('should return smart pagination for current page near end', () => {
      // Arrange
      component.pagination = { totalPages: 10, currentPage: 8 };

      // Act
      const result = component.getSmartPagination();

      // Assert
      expect(result).toEqual([0, '...', 5, 6, 7, 8, 9]);
    });

    it('should return smart pagination for current page in middle', () => {
      // Arrange
      component.pagination = { totalPages: 10, currentPage: 5 };

      // Act
      const result = component.getSmartPagination();

      // Assert
      expect(result).toEqual([0, '...', 4, 5, 6, '...', 9]);
    });

    it('should handle null pagination gracefully', () => {
      // Arrange
      component.pagination = null;

      // Act
      const result = component.getSmartPagination();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('isNumber Method', () => {
    it('should return true for numbers', () => {
      // Arrange & Act
      const result = component.isNumber(5);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for strings', () => {
      // Arrange & Act
      const result = component.isNumber('...');

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for null', () => {
      // Arrange & Act
      const result = component.isNumber(null);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for undefined', () => {
      // Arrange & Act
      const result = component.isNumber(undefined);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('Ellipsis in Pagination', () => {
    it('should render ellipsis for non-numeric pagination items', () => {
      // Arrange
      component.pagination = { totalPages: 10, currentPage: 5 };

      // Act
      fixture.detectChanges();
      const ellipsisElements = fixture.debugElement.queryAll(By.css('.org-table__pagination-ellipsis'));

      // Assert
      expect(ellipsisElements.length).toBe(2);
      expect(ellipsisElements[0].nativeElement.textContent.trim()).toBe('...');
    });
  });

  describe('CSS Classes', () => {
    it('should apply sorted class to header when column is sorted', () => {
      // Arrange
      component.columns = [{ key: 'name', label: 'Nombre' }];
      component.sort = { key: 'name', direction: 'asc' };

      // Act
      fixture.detectChanges();
      const header = fixture.debugElement.query(By.css('th'));

      // Assert
      expect(header.nativeElement.classList.contains('sorted')).toBe(true);
    });

    it('should not apply sorted class when column is not sorted', () => {
      // Arrange
      component.columns = [{ key: 'name', label: 'Nombre' }];
      component.sort = null;

      // Act
      fixture.detectChanges();
      const header = fixture.debugElement.query(By.css('th'));

      // Assert
      expect(header.nativeElement.classList.contains('sorted')).toBe(false);
    });
  });
});
