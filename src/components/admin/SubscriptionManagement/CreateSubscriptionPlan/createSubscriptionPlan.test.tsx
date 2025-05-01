import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateSubscriptionPlan from "./index";
import { Formik } from 'formik';
import * as Yup from 'yup';

const mockHandleSubscriptionPlanSubmit = jest.fn();
const mockHandleGetOrganisationList = jest.fn();
const mockRouterPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

const organisationListMock = {
  count: 2,
  results: [
    {
      organisation_id: 10,
      organisation_name: 'Test1',
      organisation_type: 'School',
      subscription_plan: 'Plan1',
      is_active: true,
      user_summary: {
        educator_count: 0,
        org_admin_count: 0,
        sub_admin_count: 0,
        total_count: 0
      }
    },
    {
      organisation_id: 12,
      organisation_name: 'Test2',
      organisation_type: 'College',
      subscription_plan: 'Plan2',
      is_active: true,
      user_summary: {
        educator_count: 0,
        org_admin_count: 2,
        sub_admin_count: 8,
        total_count: 10
      }
    }
  ]
}

const subscriptionDetailsMock = {
  plan_name: "Test Plan",
  plan_type: "Business",
  monthly_value: 10,
  annually_value: 100,
  max_licenses: 5,
  organisation_id: 10,
  created_at: '2025-01-01',
  currency: 'USD',
  is_active: true,
  max_users: 5,
  plan_id: 2,
  is_published: false
};

const initialValues = {
  plan_name: "",
  plan_type: "",
  monthly_value: "",
  annually_value: "",
  max_licenses: "",
  organisation_id: ""
};

const validationSchema = Yup.object({
  plan_name: Yup.string().trim().required('Plan Name is required'),
  plan_type: Yup.string().required('Plan type is required'),
  monthly_value: Yup.number()
    .typeError("Monthly price must be a number.")
    .min(0, "Monthly price must be 0 or a positive number.")
    .required("Monthly price is required."),
  annually_value: Yup.number()
    .typeError("Annual price must be a number.")
    .min(0, "Annual price must be 0 or a positive number.")
    .required("Annual price is required."),
  max_licenses: Yup.number()
    .typeError("No of licenses must be a number.")
    .min(0, "No of licenses must be 0 or a positive number.")
    .integer("No of licenses must be an integer.").
    required('No of licenses is required')
})

describe("CreateSubscriptionPlan Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with all fields", async () => {
    await act(async () => {
      render(
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={mockHandleSubscriptionPlanSubmit}>
          <CreateSubscriptionPlan
            handleSubscriptionPlanSubmit={mockHandleSubscriptionPlanSubmit}
            handleGetOrganisationList={mockHandleGetOrganisationList}
            organisationList={organisationListMock}
            isFormSubmitted={false}
          />
        </Formik>
      );
    })
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Plan Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Monthly Price")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Annual Price")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("No of Licenses")).toBeInTheDocument();
      expect(screen.getByText("Plan Type*")).toBeInTheDocument();
    })
  })

  it("pre-fills the form fields if subscriptionDetails are provided", async () => {
    await act(async () => {
      render(
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={mockHandleSubscriptionPlanSubmit}>
          <CreateSubscriptionPlan
            handleSubscriptionPlanSubmit={mockHandleSubscriptionPlanSubmit}
            handleGetOrganisationList={mockHandleGetOrganisationList}
            organisationList={organisationListMock}
            subscriptionDetails={subscriptionDetailsMock}
            isFormSubmitted={false}
          />
        </Formik>
      );
    });
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Plan Name")).toHaveValue(subscriptionDetailsMock.plan_name);
      expect(screen.getByPlaceholderText("Monthly Price")).toHaveValue((subscriptionDetailsMock.monthly_value).toString());
      expect(screen.getByPlaceholderText("Annual Price")).toHaveValue((subscriptionDetailsMock.annually_value).toString());
      expect(screen.getByPlaceholderText("No of Licenses")).toHaveValue((subscriptionDetailsMock.max_licenses).toString());
    })
  })

  it("calls handleGetOrganisationList when Business plan type is selected", async () => {
    await act(async () => {
      render(
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={mockHandleSubscriptionPlanSubmit}>
          <CreateSubscriptionPlan
            handleSubscriptionPlanSubmit={mockHandleSubscriptionPlanSubmit}
            handleGetOrganisationList={mockHandleGetOrganisationList}
            organisationList={organisationListMock}
            isFormSubmitted={false}
          />
        </Formik>
      );
    })
    const planTypeDropdown = screen.getByRole("combobox", { name: /plan type/i });

    // Open the dropdown
    act(() => fireEvent.mouseDown(planTypeDropdown));
  
    // Select "Business Users"
    const businessOption = await screen.findByText("Business Users");
    act(() => fireEvent.click(businessOption));
  
    // Assert that the handler was called
    await waitFor(() => {
      expect(mockHandleGetOrganisationList).toHaveBeenCalledTimes(1);
      expect(screen.getByRole("combobox", { name: /organization/i })).toBeInTheDocument()
    })
  })

  it("hides organisation dropdown when Individual plan type is selected", async () => {
    await act(async() => {
      render(
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={mockHandleSubscriptionPlanSubmit}>
          <CreateSubscriptionPlan
            handleSubscriptionPlanSubmit={mockHandleSubscriptionPlanSubmit}
            handleGetOrganisationList={mockHandleGetOrganisationList}
            organisationList={organisationListMock}
            isFormSubmitted={false}
          />
        </Formik>
      );
    })
    const planTypeDropdown = screen.getByRole("combobox", { name: /plan type/i });
    act(() => fireEvent.mouseDown(planTypeDropdown));
    const individualEducatorOption = await screen.findByText("Individual Educators");
    act(() => fireEvent.click(individualEducatorOption));
    await waitFor(() => expect(screen.queryByRole("combobox", { name: /organization/i })).not.toBeInTheDocument());
  })

  it("validates required fields", async () => {
    await act(async () => {
      render(
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={mockHandleSubscriptionPlanSubmit}>
          <CreateSubscriptionPlan
            handleSubscriptionPlanSubmit={mockHandleSubscriptionPlanSubmit}
            handleGetOrganisationList={mockHandleGetOrganisationList}
            organisationList={organisationListMock}
            isFormSubmitted={false}
          />
        </Formik>
      );
    })
    act(() => fireEvent.click(screen.getByText("Save")));
    await waitFor(() => {
      expect(screen.getByText(/Plan Name is required/)).toBeInTheDocument();
      expect(screen.getByText(/Plan type is required/)).toBeInTheDocument();
      expect(screen.getByText(/Monthly price is required/)).toBeInTheDocument();
      expect(screen.getByText(/Annual price is required/)).toBeInTheDocument();
      expect(screen.getByText(/No of licenses is required/)).toBeInTheDocument();
    });
  })

  it("submits the form with correct values", async () => {
    jest.setTimeout(10000);
    await act(async () => {
      render(
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={mockHandleSubscriptionPlanSubmit}>
          <CreateSubscriptionPlan
            handleSubscriptionPlanSubmit={mockHandleSubscriptionPlanSubmit}
            handleGetOrganisationList={mockHandleGetOrganisationList}
            organisationList={organisationListMock}
            isFormSubmitted={false}
          />
        </Formik>
      );
    })
    act(() => fireEvent.change(screen.getByPlaceholderText("Plan Name"), { target: { value: "New Plan" } }));
    act(() => fireEvent.change(screen.getByPlaceholderText("Monthly Price"), { target: { value: 20 } }));
    act(() => fireEvent.change(screen.getByPlaceholderText("Annual Price"), { target: { value: 200 } }));
    act(() => fireEvent.change(screen.getByPlaceholderText("No of Licenses"), { target: { value: 10 } }));
    const planTypeDropdown = screen.getByRole("combobox", { name: /plan type/i });
    act(() => fireEvent.mouseDown(planTypeDropdown));
    const businessOption = await screen.findByText("Business Users");
    act(() => fireEvent.click(businessOption));
    const organisationDropdown = await waitFor(() => screen.getByRole("combobox", { name: /organization/i }));
    act(() => fireEvent.mouseDown(organisationDropdown));
    const organisation = await screen.findByText("Test1");
    act(() => fireEvent.click(organisation));

    const saveButton = screen.getByTestId("subscription-save");

    act(() => fireEvent.click(saveButton));
    await waitFor(() => {
      expect(mockHandleSubscriptionPlanSubmit).toHaveBeenCalledWith({
        plan_name: "New Plan",
        plan_type: "Business",
        monthly_value: '20',
        annually_value: '200',
        max_licenses: '10',
        organisation_id: 10,
      });
    });
  });

  it("renders the cancel link and navigates back on click", async () => {
    render(
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={jest.fn()}
      >
        <CreateSubscriptionPlan
          handleSubscriptionPlanSubmit={jest.fn()}
          handleGetOrganisationList={jest.fn()}
          organisationList={organisationListMock}
          isFormSubmitted={false}
        />
      </Formik>
    );
  
    const cancelLink = screen.getByTestId("subscription-cancel");
  
    expect(cancelLink).toHaveAttribute("href", "/admin/subscription-management/view");
  
    await fireEvent.click(cancelLink);
  });
});
