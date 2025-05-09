import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show message when config has message', fakeAsync(() => {
    component.config = { message: 'Test message', type: 'info', duration: 3000 };
    fixture.detectChanges();
    tick();

    const toastElement = fixture.debugElement.query(By.css('.toast'));
    expect(toastElement).toBeTruthy();
    expect(toastElement.nativeElement.textContent.trim()).toContain('Test message');

    tick(3000);
  }));

  it('should not show message when config has no message', () => {
    component.config = { message: '', type: 'info', duration: 3000 };
    fixture.detectChanges();

    const toastElement = fixture.debugElement.query(By.css('.toast'));
    expect(toastElement).toBeFalsy();
  });

  it('should apply success class when type is success', fakeAsync(() => {
    component.config = { message: 'Test message', type: 'success', duration: 3000 };
    fixture.detectChanges();
    tick();

    const toastElement = fixture.debugElement.query(By.css('.toast'));
    expect(toastElement.nativeElement.classList.contains('success')).toBeTruthy();

    tick(3000);
  }));

  it('should apply error class when type is error', fakeAsync(() => {
    component.config = { message: 'Test message', type: 'error', duration: 3000 };
    fixture.detectChanges();
    tick();

    const toastElement = fixture.debugElement.query(By.css('.toast'));
    expect(toastElement.nativeElement.classList.contains('error')).toBeTruthy();

    tick(3000);
  }));

  it('should apply info class when type is info', fakeAsync(() => {
    component.config = { message: 'Test message', type: 'info', duration: 3000 };
    fixture.detectChanges();
    tick();

    const toastElement = fixture.debugElement.query(By.css('.toast'));
    expect(toastElement.nativeElement.classList.contains('info')).toBeTruthy();

    tick(3000);
  }));

  it('should apply show class when config has message', fakeAsync(() => {
    component.config = { message: 'Test message', type: 'info', duration: 3000 };
    fixture.detectChanges();
    tick();

    const toastElement = fixture.debugElement.query(By.css('.toast'));
    expect(toastElement.nativeElement.classList.contains('show')).toBeTruthy();

    tick(3000);
  }));

  it('should have default type as info', () => {
    expect(component.type).toBe('info');
  });

  it('should have empty message by default', () => {
    expect(component.message).toBe('');
  });

  it('should emit closed event when onClose is called', () => {
    const closedSpy = jest.spyOn(component.closed, 'emit');
    component.onClose();
    expect(closedSpy).toHaveBeenCalled();
  });

  it('should clear timeout when onClose is called', fakeAsync(() => {
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
    component.config = { message: 'Test message', type: 'info', duration: 3000 };
    fixture.detectChanges();
    tick();

    component.onClose();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();

    tick(3000);
  }));

  it('should clear message when onClose is called', () => {
    component.config = { message: 'Test message', type: 'info', duration: 3000 };
    fixture.detectChanges();
    component.onClose();
    expect(component.message).toBe('');
  });

  it('should auto-close after duration', fakeAsync(() => {
    const duration = 3000;
    component.config = { message: 'Test message', type: 'info', duration };
    fixture.detectChanges();
    
    expect(component.message).toBe('Test message');
    tick(duration);
    expect(component.message).toBe('');
  }));
}); 