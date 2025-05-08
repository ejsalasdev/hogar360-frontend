import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastAtomComponent } from './toast-atom.component';
import { By } from '@angular/platform-browser';

describe('ToastAtomComponent', () => {
  let component: ToastAtomComponent;
  let fixture: ComponentFixture<ToastAtomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToastAtomComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastAtomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show message when show is true', () => {
    component.message = 'Test message';
    component.show = true;
    fixture.detectChanges();

    const toastElement = fixture.debugElement.query(By.css('.toast'));
    expect(toastElement).toBeTruthy();
    expect(toastElement.nativeElement.textContent.trim()).toBe('Test message');
  });

  it('should not show message when show is false', () => {
    component.message = 'Test message';
    component.show = false;
    fixture.detectChanges();

    const toastElement = fixture.debugElement.query(By.css('.toast'));
    expect(toastElement).toBeFalsy();
  });

  it('should apply success class when type is success', () => {
    component.message = 'Test message';
    component.type = 'success';
    component.show = true;
    fixture.detectChanges();

    const toastElement = fixture.debugElement.query(By.css('.toast'));
    expect(toastElement.nativeElement.classList).toContain('success');
  });

  it('should apply error class when type is error', () => {
    component.message = 'Test message';
    component.type = 'error';
    component.show = true;
    fixture.detectChanges();

    const toastElement = fixture.debugElement.query(By.css('.toast'));
    expect(toastElement.nativeElement.classList).toContain('error');
  });

  it('should apply info class when type is info', () => {
    component.message = 'Test message';
    component.type = 'info';
    component.show = true;
    fixture.detectChanges();

    const toastElement = fixture.debugElement.query(By.css('.toast'));
    expect(toastElement.nativeElement.classList).toContain('info');
  });

  it('should apply show class when show is true', () => {
    component.message = 'Test message';
    component.show = true;
    fixture.detectChanges();

    const toastElement = fixture.debugElement.query(By.css('.toast'));
    expect(toastElement.nativeElement.classList).toContain('show');
  });

  it('should have default type as info', () => {
    expect(component.type).toBe('info');
  });

  it('should have empty message by default', () => {
    expect(component.message).toBe('');
  });

  it('should have show as false by default', () => {
    expect(component.show).toBe(false);
  });
}); 