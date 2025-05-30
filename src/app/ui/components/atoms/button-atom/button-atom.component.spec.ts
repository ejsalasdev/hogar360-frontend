import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonAtomComponent } from './button-atom.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('ButtonAtomComponent', () => {
  let component: ButtonAtomComponent;
  let fixture: ComponentFixture<ButtonAtomComponent>;
  let buttonElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonAtomComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonAtomComponent);
    component = fixture.componentInstance;
    buttonElement = fixture.debugElement.query(By.css('button'));
  });

  describe('Component Creation', () => {
    it('should create the component', () => {
      // Arrange & Act
      fixture.detectChanges();

      // Assert
      expect(component).toBeTruthy();
      expect(buttonElement).toBeTruthy();
    });
  });

  describe('Default Properties', () => {
    it('should have correct default values', () => {
      // Arrange & Act
      fixture.detectChanges();

      // Assert
      expect(component.type).toBe('button');
      expect(component.variant).toBe('primary');
      expect(component.styleType).toBe('primary');
      expect(component.disabled).toBe(false);
      expect(component.loading).toBe(false);
      expect(component.icon).toBe(null);
      expect(component.label).toBe('');
    });

    it('should render button with default attributes', () => {
      // Arrange & Act
      fixture.detectChanges();

      // Assert
      expect(buttonElement.nativeElement.type).toBe('button');
      expect(buttonElement.nativeElement.disabled).toBe(false);
      expect(buttonElement.nativeElement.classList).toContain('atm-button');
      expect(buttonElement.nativeElement.classList).toContain('atm-button--primary');
    });
  });

  describe('Button Types', () => {
    it('should render submit button when type is submit', () => {
      // Arrange
      component.type = 'submit';

      // Act
      fixture.detectChanges();

      // Assert
      expect(buttonElement.nativeElement.type).toBe('submit');
    });

    it('should render reset button when type is reset', () => {
      // Arrange
      component.type = 'reset';

      // Act
      fixture.detectChanges();

      // Assert
      expect(buttonElement.nativeElement.type).toBe('reset');
    });
  });

  describe('Button Variants', () => {
    it('should apply primary variant class', () => {
      // Arrange
      component.styleType = 'primary';

      // Act
      fixture.detectChanges();

      // Assert
      expect(buttonElement.nativeElement.classList).toContain('atm-button--primary');
    });

    it('should apply secondary variant class', () => {
      // Arrange
      component.styleType = 'secondary';

      // Act
      fixture.detectChanges();

      // Assert
      expect(buttonElement.nativeElement.classList).toContain('atm-button--secondary');
    });

    it('should apply danger variant class', () => {
      // Arrange
      component.styleType = 'danger';

      // Act
      fixture.detectChanges();

      // Assert
      expect(buttonElement.nativeElement.classList).toContain('atm-button--danger');
    });

    it('should use styleType over variant when both are provided', () => {
      // Arrange
      component.variant = 'primary';
      component.styleType = 'danger';

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.effectiveVariant).toBe('danger');
      expect(buttonElement.nativeElement.classList).toContain('atm-button--danger');
    });
  });

  describe('Disabled State', () => {
    it('should disable button when disabled is true', () => {
      // Arrange
      component.disabled = true;

      // Act
      fixture.detectChanges();

      // Assert
      expect(buttonElement.nativeElement.disabled).toBe(true);
    });

    it('should not emit onClick when button is disabled and clicked', () => {
      // Arrange
      component.disabled = true;
      jest.spyOn(component.onClick, 'emit');

      // Act
      fixture.detectChanges();
      buttonElement.nativeElement.click();

      // Assert
      expect(component.onClick.emit).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should disable button when loading is true', () => {
      // Arrange
      component.loading = true;

      // Act
      fixture.detectChanges();

      // Assert
      expect(buttonElement.nativeElement.disabled).toBe(true);
    });

    it('should show spinner when loading is true', () => {
      // Arrange
      component.loading = true;

      // Act
      fixture.detectChanges();

      // Assert
      const spinner = fixture.debugElement.query(By.css('.atm-button__spinner'));
      expect(spinner).toBeTruthy();
    });

    it('should not show icon when loading is true', () => {
      // Arrange
      component.loading = true;
      component.icon = 'test-icon';

      // Act
      fixture.detectChanges();

      // Assert
      const iconElement = fixture.debugElement.query(By.css('.atm-button__icon'));
      expect(iconElement).toBeFalsy();
    });

    it('should not emit onClick when button is loading and clicked', () => {
      // Arrange
      component.loading = true;
      jest.spyOn(component.onClick, 'emit');

      // Act
      fixture.detectChanges();
      buttonElement.nativeElement.click();

      // Assert
      expect(component.onClick.emit).not.toHaveBeenCalled();
    });
  });

  describe('Icon Display', () => {
    it('should display icon when icon is provided and not loading', () => {
      // Arrange
      component.icon = 'test-icon';
      component.label = 'Test Button';
      component.loading = false;

      // Act
      fixture.detectChanges();

      // Assert
      const iconElement = fixture.debugElement.query(By.css('.atm-button__icon'));
      expect(iconElement).toBeTruthy();
      expect(iconElement.nativeElement.src).toContain('/assets/icons/test-icon.png');
      expect(iconElement.nativeElement.alt).toBe('Test Button');
    });

    it('should not display icon when icon is null', () => {
      // Arrange
      component.icon = null;

      // Act
      fixture.detectChanges();

      // Assert
      const iconElement = fixture.debugElement.query(By.css('.atm-button__icon'));
      expect(iconElement).toBeFalsy();
    });
  });

  describe('Label Display', () => {
    it('should display label when label is provided', () => {
      // Arrange
      const testLabel = 'Test Button';
      component.label = testLabel;

      // Act
      fixture.detectChanges();

      // Assert
      const labelElement = fixture.debugElement.query(By.css('span'));
      expect(labelElement).toBeTruthy();
      expect(labelElement.nativeElement.textContent.trim()).toBe(testLabel);
    });

    it('should not display label span when label is empty', () => {
      // Arrange
      component.label = '';

      // Act
      fixture.detectChanges();

      // Assert
      const spans = fixture.debugElement.queryAll(By.css('span'));
      const labelSpan = spans.find(span => !span.nativeElement.classList.contains('atm-button__spinner'));
      expect(labelSpan).toBeFalsy();
    });

    it('should show ng-content when no label is provided', () => {
      // Arrange
      component.label = '';

      // Act
      fixture.detectChanges();

      // Assert
      // ng-content is handled by Angular's content projection and is not queryable as a DOM element
      // Instead, we verify that the content area exists by checking the *ngIf condition
      const ngContentElement = fixture.debugElement.query(By.css('ng-content[ng-reflect-ng-if="true"]'));
      // Alternative: check that the label span is not present when label is empty
      const spans = fixture.debugElement.queryAll(By.css('span'));
      const labelSpan = spans.find(span => !span.nativeElement.classList.contains('atm-button__spinner'));
      expect(labelSpan).toBeFalsy();
    });
  });

  describe('Click Events', () => {
    it('should emit onClick when button is clicked and not disabled/loading', () => {
      // Arrange
      component.disabled = false;
      component.loading = false;
      component.type = 'button';
      jest.spyOn(component.onClick, 'emit');

      // Act
      fixture.detectChanges();
      buttonElement.nativeElement.click();

      // Assert
      expect(component.onClick.emit).toHaveBeenCalledWith();
    });

    it('should not emit onClick for submit type buttons', () => {
      // Arrange
      component.type = 'submit';
      component.disabled = false;
      component.loading = false;
      jest.spyOn(component.onClick, 'emit');

      // Act
      fixture.detectChanges();
      buttonElement.nativeElement.click();

      // Assert
      expect(component.onClick.emit).not.toHaveBeenCalled();
    });

    it('should call onButtonClick method when button is clicked', () => {
      // Arrange
      jest.spyOn(component, 'onButtonClick');

      // Act
      fixture.detectChanges();
      buttonElement.triggerEventHandler('click', null);

      // Assert
      expect(component.onButtonClick).toHaveBeenCalled();
    });

    it('should emit onClick for reset type buttons when clicked', () => {
      // Arrange
      component.type = 'reset';
      component.disabled = false;
      component.loading = false;
      jest.spyOn(component.onClick, 'emit');

      // Act
      fixture.detectChanges();
      buttonElement.nativeElement.click();

      // Assert
      expect(component.onClick.emit).toHaveBeenCalledWith();
    });
  });

  describe('Effective Variant Getter', () => {
    it('should return styleType when styleType is provided', () => {
      // Arrange
      component.variant = 'primary';
      component.styleType = 'secondary';

      // Act
      const result = component.effectiveVariant;

      // Assert
      expect(result).toBe('secondary');
    });

    it('should return styleType as default since it always has a value', () => {
      // Arrange
      component.variant = 'danger';
      component.styleType = 'primary'; // default value

      // Act
      const result = component.effectiveVariant;

      // Assert
      expect(result).toBe('primary');
    });
  });
});