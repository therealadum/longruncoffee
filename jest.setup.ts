import "@testing-library/jest-dom";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Make it globally available in all tests
// if it doesn't already exist
if (typeof global.ResizeObserver === "undefined") {
  (global as any).ResizeObserver = ResizeObserverMock;
}
