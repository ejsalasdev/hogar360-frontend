import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ModalOrganismComponent } from './modal-organism.component';

describe('ModalOrganismComponent', () => {
  let component: ModalOrganismComponent;
  let fixture: ComponentFixture<ModalOrganismComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalOrganismComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalOrganismComponent);
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
      expect(component.isVisible).toBe(false);
      expect(component.showCloseButton).toBe(true);
      expect(component.closeOnOutsideClick).toBe(true);
      expect(component.closeOnEscape).toBe(true);
    });
  });

  describe('Modal Visibility', () => {
    it('should not render modal when isVisible is false', () => {
      // Arrange
      component.isVisible = false;
      
      // Act
      fixture.detectChanges();
      const modalElement = fixture.debugElement.query(By.css('.modal-organism__overlay'));
      
      // Assert
      expect(modalElement).toBeNull();
    });

    it('should render modal when isVisible is true', () => {
      // Arrange
      component.isVisible = true;
      
      // Act
      fixture.detectChanges();
      const modalElement = fixture.debugElement.query(By.css('.modal-organism__overlay'));
      
      // Assert
      expect(modalElement).not.toBeNull();
    });
  });

  describe('Close Button', () => {
    beforeEach(() => {
      component.isVisible = true;
      fixture.detectChanges();
    });

    it('should show close button when showCloseButton is true', () => {
      // Arrange
      component.showCloseButton = true;
      
      // Act
      fixture.detectChanges();
      const closeButton = fixture.debugElement.query(By.css('.modal-organism__close-button'));
      
      // Assert
      expect(closeButton).not.toBeNull();
    });

    it('should hide close button when showCloseButton is false', () => {
      // Arrange
      component.showCloseButton = false;
      
      // Act
      fixture.detectChanges();
      const closeButton = fixture.debugElement.query(By.css('.modal-organism__close-button'));
      
      // Assert
      expect(closeButton).toBeNull();
    });

    it('should emit close event when close button is clicked', () => {
      // Arrange
      component.showCloseButton = true;
      fixture.detectChanges();
      const closeButton = fixture.debugElement.query(By.css('.modal-organism__close-button'));
      jest.spyOn(component.close, 'emit');
      
      // Act
      closeButton.triggerEventHandler('click', null);
      
      // Assert
      expect(component.close.emit).toHaveBeenCalledWith();
    });
  });

  describe('closeModal Method', () => {
    it('should emit close event when closeModal is called', () => {
      // Arrange
      jest.spyOn(component.close, 'emit');
      
      // Act
      component.closeModal();
      
      // Assert
      expect(component.close.emit).toHaveBeenCalledWith();
    });
  });

  describe('Outside Click Behavior', () => {
    beforeEach(() => {
      component.isVisible = true;
      fixture.detectChanges();
    });

    it('should close modal when overlay is clicked and closeOnOutsideClick is true', () => {
      // Arrange
      component.closeOnOutsideClick = true;
      const overlay = fixture.debugElement.query(By.css('.modal-organism__overlay'));
      jest.spyOn(component, 'closeModal');
      
      // Act
      overlay.triggerEventHandler('click', null);
      
      // Assert
      expect(component.closeModal).toHaveBeenCalled();
    });

    it('should not close modal when overlay is clicked and closeOnOutsideClick is false', () => {
      // Arrange
      component.closeOnOutsideClick = false;
      const overlay = fixture.debugElement.query(By.css('.modal-organism__overlay'));
      jest.spyOn(component, 'closeModal');
      
      // Act
      overlay.triggerEventHandler('click', null);
      
      // Assert
      expect(component.closeModal).not.toHaveBeenCalled();
    });

    it('should prevent modal close when dialog content is clicked', () => {
      // Arrange
      const dialog = fixture.debugElement.query(By.css('.modal-organism__dialog'));
      const mockEvent = { stopPropagation: jest.fn() };
      
      // Act
      component.onDialogClick(mockEvent as any);
      
      // Assert
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('Keyboard Events', () => {
    beforeEach(() => {
      component.isVisible = true;
      fixture.detectChanges();
    });

    it('should close modal when escape key is pressed and closeOnEscape is true', () => {
      // Arrange
      component.closeOnEscape = true;
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      jest.spyOn(component, 'closeModal');
      
      // Act
      component.onKeydownHandler(escapeEvent);
      
      // Assert
      expect(component.closeModal).toHaveBeenCalled();
    });

    it('should not close modal when escape key is pressed and closeOnEscape is false', () => {
      // Arrange
      component.closeOnEscape = false;
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      jest.spyOn(component, 'closeModal');
      
      // Act
      component.onKeydownHandler(escapeEvent);
      
      // Assert
      expect(component.closeModal).not.toHaveBeenCalled();
    });

    it('should not close modal when escape key is pressed but modal is not visible', () => {
      // Arrange
      component.isVisible = false;
      component.closeOnEscape = true;
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      jest.spyOn(component, 'closeModal');
      
      // Act
      component.onKeydownHandler(escapeEvent);
      
      // Assert
      expect(component.closeModal).not.toHaveBeenCalled();
    });
  });

  describe('Modal Structure', () => {
    beforeEach(() => {
      component.isVisible = true;
      fixture.detectChanges();
    });

    it('should render modal header section', () => {
      // Arrange & Act (done in beforeEach)
      const headerElement = fixture.debugElement.query(By.css('.modal-organism__header'));
      
      // Assert
      expect(headerElement).not.toBeNull();
    });

    it('should render modal body section', () => {
      // Arrange & Act (done in beforeEach)
      const bodyElement = fixture.debugElement.query(By.css('.modal-organism__body'));
      
      // Assert
      expect(bodyElement).not.toBeNull();
    });

    it('should render modal footer section', () => {
      // Arrange & Act (done in beforeEach)
      const footerElement = fixture.debugElement.query(By.css('.modal-organism__footer'));
      
      // Assert
      expect(footerElement).not.toBeNull();
    });
  });

  describe('Event Integration', () => {
    it('should handle onOverlayClick method correctly when closeOnOutsideClick is enabled', () => {
      // Arrange
      component.closeOnOutsideClick = true;
      jest.spyOn(component, 'closeModal');
      
      // Act
      component.onOverlayClick();
      
      // Assert
      expect(component.closeModal).toHaveBeenCalled();
    });

    it('should handle onOverlayClick method correctly when closeOnOutsideClick is disabled', () => {
      // Arrange
      component.closeOnOutsideClick = false;
      jest.spyOn(component, 'closeModal');
      
      // Act
      component.onOverlayClick();
      
      // Assert
      expect(component.closeModal).not.toHaveBeenCalled();
    });
  });
});
