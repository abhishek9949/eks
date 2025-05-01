const usePathnameMock = jest.fn(() => "/default-path");
const useRouterMock = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
}));

const useSearchParamsMock = jest.fn(
  () => new URLSearchParams({ email: "test@example.com", token: "12345" }),
);

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  usePathname: usePathnameMock,
  useRouter: useRouterMock,
  useSearchParams: useSearchParamsMock, // ✅ Add this line
}));

// Helper function to update pathname mock
const setMockPathname = (pathname: string) => {
  usePathnameMock.mockImplementation(() => pathname);
};

// Helper function to update search params mock
const setMockSearchParams = (params: Record<string, string>) => {
  useSearchParamsMock.mockImplementation(() => new URLSearchParams(params));
};

export { setMockPathname, setMockSearchParams };
