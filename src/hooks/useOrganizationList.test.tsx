import { renderHook, act } from "@testing-library/react";
import { useOrganizationList } from "@/hooks/useOrganizationList";
import { useLazyGetOrganisationListQuery } from "@/redux/allReducer";
import { OrganisationListProps } from "@/types/organisation";

jest.mock("@/redux/allReducer", () => ({
  useLazyGetOrganisationListQuery: jest.fn(),
}));

describe("useOrganizationList Hook", () => {
  let getOrganisationListMock: jest.Mock;

  beforeEach(() => {
    getOrganisationListMock = jest.fn();
    (useLazyGetOrganisationListQuery as jest.Mock).mockReturnValue([
      getOrganisationListMock,
    ]);
  });

  it("should fetch and return organization list successfully", async () => {
    const mockData: OrganisationListProps = {
        results: [
            {
                organisation_id: 1, organisation_name: "Org 1",
                organisation_type: "",
                subscription_plan: "",
                is_active: false,
                user_summary: {
                    educator_count: 0,
                    org_admin_count: 0,
                    sub_admin_count: 0,
                    total_count: 0
                }
            },
            {
                organisation_id: 2, organisation_name: "Org 2",
                organisation_type: "",
                subscription_plan: "",
                is_active: false,
                user_summary: {
                    educator_count: 0,
                    org_admin_count: 0,
                    sub_admin_count: 0,
                    total_count: 0
                }
            },
        ],
        count: 0
    };

    getOrganisationListMock.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue(mockData),
    });

    const { result } = renderHook(() => useOrganizationList());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.organizationList).toEqual(mockData.results);
    expect(result.current.error).toBe(null);
  });

  it("should handle API error correctly", async () => {
    getOrganisationListMock.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue(new Error("API Error")),
    });

    const { result } = renderHook(() => useOrganizationList());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.organizationList).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch organization list");
  });
});
