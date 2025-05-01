export const ORGANISATION_FORM_FIELDS = {
  ORGANISATION_NAME: 'organisation_name',
  ORGANISATION_TYPE: 'organisation_type',
  STREET_ADDRESS: 'street_address',
  CITY: 'city',
  STATE_PROVINCE: 'state_province',
  POSTAL_CODE: 'postal_code',
  COUNTRY: 'country',
  CONTACT_NAME: 'primary_contact_name',
  CONTACT_EMAIL: 'primary_contact_email',
  CONTACT_PHONE: 'primary_contact_phone'
} as const;

export interface OrganisationFormValuesProps {
  [ORGANISATION_FORM_FIELDS.ORGANISATION_NAME]: string,
  [ORGANISATION_FORM_FIELDS.ORGANISATION_TYPE]: string,
  [ORGANISATION_FORM_FIELDS.STREET_ADDRESS]: string,
  [ORGANISATION_FORM_FIELDS.CITY]: string,
  [ORGANISATION_FORM_FIELDS.STATE_PROVINCE]: string,
  [ORGANISATION_FORM_FIELDS.POSTAL_CODE]: string,
  [ORGANISATION_FORM_FIELDS.COUNTRY]: string,
  [ORGANISATION_FORM_FIELDS.CONTACT_NAME]: string,
  [ORGANISATION_FORM_FIELDS.CONTACT_EMAIL]: string,
  [ORGANISATION_FORM_FIELDS.CONTACT_PHONE]: string
}

export interface OrganisationFormSubmitProps {
  [ORGANISATION_FORM_FIELDS.ORGANISATION_NAME]: string,
  [ORGANISATION_FORM_FIELDS.ORGANISATION_TYPE]: string,
  addresses: [
    {
      [ORGANISATION_FORM_FIELDS.STREET_ADDRESS]: string,
      [ORGANISATION_FORM_FIELDS.CITY]: string,
      [ORGANISATION_FORM_FIELDS.STATE_PROVINCE]: string,
      [ORGANISATION_FORM_FIELDS.POSTAL_CODE]: string,
      [ORGANISATION_FORM_FIELDS.COUNTRY]: string,
    }
  ],
  contact_details: [
    {
      [ORGANISATION_FORM_FIELDS.CONTACT_NAME]: string,
      [ORGANISATION_FORM_FIELDS.CONTACT_EMAIL]: string,
      [ORGANISATION_FORM_FIELDS.CONTACT_PHONE]: string
    }
  ]
}

export interface CreateOrganisationProps {
  hanldeOrganisationSubmit: (data: OrganisationFormSubmitProps) => void,
  organisationDetails?: OrganisationFormSubmitProps,
  isFormSubmitted: boolean,
}

export interface CreateOrganisationSuccessProps {
  message: string
}

export interface ViewOrganisationProps {
  organisationList: OrganisationListProps,
  rowsPerPage: number,
  page: number,
  handlePageChange: (event: React.MouseEvent | null, newPage: number) => void
  handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  isLoading: boolean,
  handleUpdateOrganisationStatus: (organisationId: number, isActive: boolean) => void,
  handleDeleteOrganisation: (organisationId: number) => void
}

export const InitialOrganisationList = {
  count: 0,
  results: [
    {
      organisation_id: 1,
      organisation_name: '',
      organisation_type: '',
      subscription_plan: '',
      is_active: true,
      user_summary: 
      {
        educator_count: 0,
        org_admin_count: 0,
        sub_admin_count: 0,
        total_count: 0
      }
    } 
  ]
}

export interface IndividualOrganisationProps {
  organisation_id: number,
  organisation_name: string,
  organisation_type: string,
  subscription_plan: string,
  is_active: boolean,
  user_summary: {
    educator_count: number,
    org_admin_count: number,
    sub_admin_count: number,
    total_count: number
  }
}
export interface OrganisationListProps {
  count: number,
  results: IndividualOrganisationProps[]
}

export interface OrganisationMoreActionsProps {
  openMoreActions: HTMLButtonElement | null,
  handleCloseMoreActions: () => void,
  row: IndividualOrganisationProps | null,
  handleUpdateOrganisationStatus: (organisationId: number, isActive: boolean) => void,
  handleDeleteOrganisation: (organisationId: number) => void
}


export interface EditOrganisationParamsProps {
  params: {
    id: number
  }
}