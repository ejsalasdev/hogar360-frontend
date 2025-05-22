import { HttpHandler, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let mockRequest: HttpRequest<any>;
  let mockHandler: HttpHandler;
  let localStorageSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthInterceptor]
    });

    interceptor = TestBed.inject(AuthInterceptor);
    mockRequest = new HttpRequest('GET', '/api/test');
    mockHandler = {
      handle: jest.fn().mockReturnValue(of({}))
    };
    localStorageSpy = jest.spyOn(Storage.prototype, 'getItem');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add authorization header when token exists', () => {
    const testToken = 'test-token';
    localStorageSpy.mockReturnValue(testToken);

    interceptor.intercept(mockRequest, mockHandler);

    expect(mockHandler.handle).toHaveBeenCalled();
    const modifiedRequest = (mockHandler.handle as jest.Mock).mock.calls[0][0];
    expect(modifiedRequest.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
  });

  it('should not add authorization header when token is null', () => {
    localStorageSpy.mockReturnValue(null);

    interceptor.intercept(mockRequest, mockHandler);

    expect(mockHandler.handle).toHaveBeenCalledWith(mockRequest);
  });

  it('should not modify original request when adding token', () => {
    const testToken = 'test-token';
    localStorageSpy.mockReturnValue(testToken);

    interceptor.intercept(mockRequest, mockHandler);

    expect(mockRequest.headers.has('Authorization')).toBeFalsy();
  });

  it('should handle requests with existing headers', () => {
    const testToken = 'test-token';
    localStorageSpy.mockReturnValue(testToken);
    const requestWithHeaders = mockRequest.clone({
      setHeaders: { 'Content-Type': 'application/json' }
    });

    interceptor.intercept(requestWithHeaders, mockHandler);

    const modifiedRequest = (mockHandler.handle as jest.Mock).mock.calls[0][0];
    expect(modifiedRequest.headers.get('Content-Type')).toBe('application/json');
    expect(modifiedRequest.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
  });
});
