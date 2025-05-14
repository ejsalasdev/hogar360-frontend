import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextareaAtomComponent } from './textarea-atom.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TextareaAtomComponent', () => {
  let component: TextareaAtomComponent;
  let fixture: ComponentFixture<TextareaAtomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextareaAtomComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaAtomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 