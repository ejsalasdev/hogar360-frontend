import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogAtomComponent } from './confirm-dialog-atom.component';

describe('ConfirmDialogAtomComponent', () => {
  let component: ConfirmDialogAtomComponent;
  let fixture: ComponentFixture<ConfirmDialogAtomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDialogAtomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogAtomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.show).toBeFalsy();
    expect(component.title).toBe('Confirmar acción');
    expect(component.message).toBe('');
  });

  it('should emit confirm event when onConfirm is called', () => {
    const spy = jest.spyOn(component.confirm, 'emit');
    component.onConfirm();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit cancel event when onCancel is called', () => {
    const spy = jest.spyOn(component.cancel, 'emit');
    component.onCancel();
    component.onCancel();
    expect(spy).toHaveBeenCalled();
  });

  it('should show dialog when show is true', () => {
    component.show = true;
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('.confirm-dialog');
    expect(dialog).toBeTruthy();
  });

  it('should hide dialog when show is false', () => {
    component.show = false;
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('.confirm-dialog');
    expect(dialog).toBeFalsy();
  });

  it('should display custom title and message', () => {
    component.show = true;
    component.title = 'Test Title';
    component.message = 'Test Message';
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('.confirm-dialog__title');
    const messageElement = fixture.nativeElement.querySelector('.confirm-dialog__message');

    expect(titleElement.textContent).toContain('Test Title');
    expect(messageElement.textContent).toContain('Test Message');
  });

  it('should call onCancel when clicking overlay', () => {
    component.show = true;
    fixture.detectChanges();
    
    const spy = jest.spyOn(component, 'onCancel');
    const overlay = fixture.nativeElement.querySelector('.confirm-dialog__overlay');
    overlay.click();
    
    expect(spy).toHaveBeenCalled();
  });
}); 