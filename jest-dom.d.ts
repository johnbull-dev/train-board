import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
    }
  }
} 