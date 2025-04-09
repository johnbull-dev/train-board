import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Add Next.js API route testing environment
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// Mock Next.js Request and Response
(global as any).Request = class Request {
  url: string;
  options: RequestInit;

  constructor(url: string, options: RequestInit = {}) {
    this.url = url;
    this.options = options;
  }
};

(global as any).Response = class Response {
  body: any;
  options: ResponseInit;

  constructor(body: any, options: ResponseInit = {}) {
    this.body = body;
    this.options = options;
  }

  json(): Promise<any> {
    return Promise.resolve(this.body);
  }
};

// Mock NextRequest and NextResponse
jest.mock('next/server', () => ({
  NextRequest: class NextRequest {
    private _url: string;

    constructor(url: string) {
      this._url = url;
    }

    get url(): string {
      return this._url;
    }
  },
  NextResponse: {
    json: (body: any, init: ResponseInit = {}) => {
      const response = {
        status: init.status || 200,
        json: () => Promise.resolve(body)
      };
      return response;
    }
  }
}));

// Add Next.js API route types
declare module 'next/server' {
  interface NextRequestContext {
    params: { [key: string]: string };
  }
} 