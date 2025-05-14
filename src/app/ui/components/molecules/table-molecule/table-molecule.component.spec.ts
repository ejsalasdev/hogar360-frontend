import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableMoleculeComponent } from './table-molecule.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TableMoleculeComponent', () => {
  let component: TableMoleculeComponent;
  let fixture: ComponentFixture<TableMoleculeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableMoleculeComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableMoleculeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 