import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { Formik } from "formik";
import CreateOrganisation from "./index";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import {
  ORGANISATION_FORM_FIELDS,
  OrganisationFormSubmitProps,
  OrganisationFormValuesProps,
} from "@/types/organisation";
import { createOrganisationValidationSchema } from "@/constants/organisationTypes";

const mockHandleCreateOrganisation = jest.fn();
const mockRouterPush = jest.fn();

const createOrganisationInitialValues: OrganisationFormValuesProps = {
  [ORGANISATION_FORM_FIELDS.ORGANISATION_NAME]: "",
  [ORGANISATION_FORM_FIELDS.ORGANISATION_TYPE]: "",
  [ORGANISATION_FORM_FIELDS.STREET_ADDRESS]: "",
  [ORGANISATION_FORM_FIELDS.CITY]: "",
  [ORGANISATION_FORM_FIELDS.STATE_PROVINCE]: "",
  [ORGANISATION_FORM_FIELDS.POSTAL_CODE]: "",
  [ORGANISATION_FORM_FIELDS.COUNTRY]: "",
  [ORGANISATION_FORM_FIELDS.CONTACT_NAME]: "",
  [ORGANISATION_FORM_FIELDS.CONTACT_EMAIL]: "",
  [ORGANISATION_FORM_FIELDS.CONTACT_PHONE]: "",
};

const initialValues = createOrganisationInitialValues;
const validationSchema = createOrganisationValidationSchema;

const mockOrganisationListDetails: OrganisationFormSubmitProps = {
  [ORGANISATION_FORM_FIELDS.ORGANISATION_NAME]: "Test",
  [ORGANISATION_FORM_FIELDS.ORGANISATION_TYPE]: "District",
  addresses: [
    {
      [ORGANISATION_FORM_FIELDS.STREET_ADDRESS]: "279 Troy Road",
      [ORGANISATION_FORM_FIELDS.CITY]: "East Greenbush",
      [ORGANISATION_FORM_FIELDS.STATE_PROVINCE]: "New York",
      [ORGANISATION_FORM_FIELDS.POSTAL_CODE]: "12061",
      [ORGANISATION_FORM_FIELDS.COUNTRY]: "USA",
    },
  ],
  contact_details: [
    {
      [ORGANISATION_FORM_FIELDS.CONTACT_NAME]: "Dan",
      [ORGANISATION_FORM_FIELDS.CONTACT_EMAIL]: "dan@test.com",
      [ORGANISATION_FORM_FIELDS.CONTACT_PHONE]: "718 222 2222",
    },
  ],
};

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

describe("Create Organisation Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with all fields", async () => {
    await act(async () => {
      render(
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={mockHandleCreateOrganisation}
        >
          <CreateOrganisation
            hanldeOrganisationSubmit={mockHandleCreateOrganisation}
            isFormSubmitted={false}
          />
        </Formik>,
      );
    });
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(CONSTANT_MESSAGE.ORGANISATION_NAME),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/Select organization type/i),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(
          CONSTANT_MESSAGE.ORGANISATION_STREET_ADDRESS,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(CONSTANT_MESSAGE.ORGANISATION_CITY),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(
          CONSTANT_MESSAGE.ORGANISATION_STATE_PROVINCE,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(CONSTANT_MESSAGE.ORGANISATION_POSTAL_CODE),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(CONSTANT_MESSAGE.ORGANISATION_COUNTRY),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(
          CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_NAME,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(
          CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_EMAIL,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(
          CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_PHONE,
        ),
      ).toBeInTheDocument();
    });
  });

  it("validates required fields", async () => {
    await act(async () => {
      render(
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={mockHandleCreateOrganisation}
        >
          <CreateOrganisation
            hanldeOrganisationSubmit={mockHandleCreateOrganisation}
            isFormSubmitted={false}
          />
        </Formik>,
      );
    });
    act(() =>
      fireEvent.click(
        screen.getByText(CONSTANT_MESSAGE.ORGANISATION_SAVE_BUTTON),
      ),
    );
    await waitFor(() => {
      expect(
        screen.getByText(CONSTANT_MESSAGE.ORGANISATION_NAME_REQUIRED),
      ).toBeInTheDocument();
      expect(
        screen.getByText(CONSTANT_MESSAGE.ORGANISATION_TYPE_REQUIRED),
      ).toBeInTheDocument();
      expect(
        screen.getByText(CONSTANT_MESSAGE.ORGANISATION_STREET_ADDRESS_REQUIRED),
      ).toBeInTheDocument();
      expect(
        screen.getByText(CONSTANT_MESSAGE.ORGANISATION_CITY_REQUIRED),
      ).toBeInTheDocument();
      expect(
        screen.getByText(CONSTANT_MESSAGE.ORGANISATION_STATE_PROVINCE_REQUIRED),
      ).toBeInTheDocument();
      expect(
        screen.getByText(CONSTANT_MESSAGE.ORGANISATION_POSTAL_CODE_REQUIRED),
      ).toBeInTheDocument();
      expect(
        screen.getByText(CONSTANT_MESSAGE.ORGANISATION_COUNTRY_REQUIRED),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_NAME_REQUIRED,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_EMAIL_REQUIRED,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_PHONE_REQUIRED,
        ),
      ).toBeInTheDocument();
    });
  });

  it("submits the form with correct values", async () => {
    await act(async () => {
      render(
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={mockHandleCreateOrganisation}
        >
          <CreateOrganisation
            hanldeOrganisationSubmit={mockHandleCreateOrganisation}
            isFormSubmitted={false}
          />
        </Formik>,
      );
    });
    act(() =>
      fireEvent.change(
        screen.getByPlaceholderText(CONSTANT_MESSAGE.ORGANISATION_NAME),
        { target: { value: "Test Organisation" } },
      ),
    );
    act(() =>
      fireEvent.change(
        screen.getByPlaceholderText(
          CONSTANT_MESSAGE.ORGANISATION_STREET_ADDRESS,
        ),
        { target: { value: "132 My Street" } },
      ),
    );
    act(() =>
      fireEvent.change(
        screen.getByPlaceholderText(CONSTANT_MESSAGE.ORGANISATION_CITY),
        { target: { value: "Kingston" } },
      ),
    );
    act(() =>
      fireEvent.change(
        screen.getByPlaceholderText(
          CONSTANT_MESSAGE.ORGANISATION_STATE_PROVINCE,
        ),
        { target: { value: "New York" } },
      ),
    );
    act(() =>
      fireEvent.change(
        screen.getByPlaceholderText(CONSTANT_MESSAGE.ORGANISATION_POSTAL_CODE),
        { target: { value: "12401" } },
      ),
    );
    act(() =>
      fireEvent.change(
        screen.getByPlaceholderText(CONSTANT_MESSAGE.ORGANISATION_COUNTRY),
        { target: { value: "US" } },
      ),
    );
    act(() =>
      fireEvent.change(
        screen.getByPlaceholderText(
          CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_NAME,
        ),
        { target: { value: "Smith" } },
      ),
    );
    act(() =>
      fireEvent.change(
        screen.getByPlaceholderText(
          CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_EMAIL,
        ),
        { target: { value: "smith@test.com" } },
      ),
    );
    act(() =>
      fireEvent.change(
        screen.getByPlaceholderText(
          CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_PHONE,
        ),
        { target: { value: "1234567890" } },
      ),
    );
    const organisationTypeDropdonw = screen.getByRole("combobox", {
      name: /Organization type/i,
    });
    act(() => fireEvent.mouseDown(organisationTypeDropdonw));
    const schoolOption = await screen.findByText("School");
    act(() => fireEvent.click(schoolOption));

    const saveButton = screen.getByText(
      CONSTANT_MESSAGE.ORGANISATION_SAVE_BUTTON,
    );

    act(() => fireEvent.click(saveButton));
    await waitFor(() => {
      expect(mockHandleCreateOrganisation).toHaveBeenCalledWith({
        [ORGANISATION_FORM_FIELDS.ORGANISATION_NAME]: "Test Organisation",
        [ORGANISATION_FORM_FIELDS.ORGANISATION_TYPE]: "School",
        addresses: [
          {
            [ORGANISATION_FORM_FIELDS.STREET_ADDRESS]: "132 My Street",
            [ORGANISATION_FORM_FIELDS.CITY]: "Kingston",
            [ORGANISATION_FORM_FIELDS.STATE_PROVINCE]: "New York",
            [ORGANISATION_FORM_FIELDS.POSTAL_CODE]: "12401",
            [ORGANISATION_FORM_FIELDS.COUNTRY]: "US",
          },
        ],
        contact_details: [
          {
            [ORGANISATION_FORM_FIELDS.CONTACT_NAME]: "Smith",
            [ORGANISATION_FORM_FIELDS.CONTACT_EMAIL]: "smith@test.com",
            [ORGANISATION_FORM_FIELDS.CONTACT_PHONE]: "1234567890",
          },
        ],
      });
    });
  });

  it("navigates back on cancel", async () => {
    await act(async () => {
      render(
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={mockHandleCreateOrganisation}
        >
          <CreateOrganisation
            hanldeOrganisationSubmit={mockHandleCreateOrganisation}
            isFormSubmitted={false}
          />
        </Formik>,
      );
    });

    const cancelLink = screen.getByTestId("organization-cancel");

    expect(cancelLink).toHaveAttribute(
      "href",
      "/admin/organisation-management/view",
    );

    await fireEvent.click(cancelLink);
  });

  it("pre fills the form fields if organisation details are provided", async () => {
    await act(async () => {
      render(
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={mockHandleCreateOrganisation}
        >
          <CreateOrganisation
            hanldeOrganisationSubmit={mockHandleCreateOrganisation}
            organisationDetails={mockOrganisationListDetails}
            isFormSubmitted={false}
          />
        </Formik>,
      );
    });
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(CONSTANT_MESSAGE.ORGANISATION_NAME),
      ).toHaveValue("Test");
      expect(
        screen.getByPlaceholderText(/Select organization type/i),
      ).toHaveValue("District");
      expect(
        screen.getByPlaceholderText(
          CONSTANT_MESSAGE.ORGANISATION_STREET_ADDRESS,
        ),
      ).toHaveValue("279 Troy Road");
      expect(
        screen.getByPlaceholderText(CONSTANT_MESSAGE.ORGANISATION_CITY),
      ).toHaveValue("East Greenbush");
      expect(
        screen.getByPlaceholderText(
          CONSTANT_MESSAGE.ORGANISATION_STATE_PROVINCE,
        ),
      ).toHaveValue("New York");
      expect(
        screen.getByPlaceholderText(CONSTANT_MESSAGE.ORGANISATION_POSTAL_CODE),
      ).toHaveValue("12061");
      expect(
        screen.getByPlaceholderText(CONSTANT_MESSAGE.ORGANISATION_COUNTRY),
      ).toHaveValue("USA");
      expect(
        screen.getByPlaceholderText(
          CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_NAME,
        ),
      ).toHaveValue("Dan");
      expect(
        screen.getByPlaceholderText(
          CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_EMAIL,
        ),
      ).toHaveValue("dan@test.com");
      expect(
        screen.getByPlaceholderText(
          CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_PHONE,
        ),
      ).toHaveValue("718 222 2222");
    });
  });
});
