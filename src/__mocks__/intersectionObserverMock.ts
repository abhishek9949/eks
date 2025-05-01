// __mocks__/intersectionObserverMock.ts

type MockIntersectionObserverEntry = {
  isIntersecting: boolean;
};

type MockIntersectionObserver = {
  callback: (entries: MockIntersectionObserverEntry[]) => void;
  options?: IntersectionObserverInit;
  observe: (target: Element) => void;
  unobserve: (target: Element) => void;
  disconnect: () => void;
};

const mockIntersectionObserver = function (
  callback: (entries: MockIntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): MockIntersectionObserver {
  return {
    callback,
    options,
    observe: (target: Element) => {
      // Simulate an intersection event
      callback([{ isIntersecting: true }]);
    },
    unobserve: (target: Element) => {
      // No-op
    },
    disconnect: () => {
      // No-op
    },
  };
};

// Assign the mock to the global object only in a test environment
if (typeof window !== "undefined") {
  window.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver;
}

export default mockIntersectionObserver;
