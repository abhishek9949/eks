// jest.setup.ts
import "@testing-library/jest-dom";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";

beforeEach(() => {
  setMockPathname("/default-path"); // Default for all tests
});
