import { ORGANISATION_FORM_FIELDS } from '@/types/organisation';
import * as Yup from 'yup';
import { CONSTANT_MESSAGE } from './globalConstant';
import { validateEmail, validatePhone, validatePostalCode } from '@/utils/validationData';

export const OrganisationTypes = [
  { id: 1, name: 'School', value: 'School' },
  { id: 2, name: 'District', value: 'District' },
  { id: 3, name: 'College/University', value: 'college' },
  { id: 4, name: 'Training Institute', value: 'training' },
  { id: 5, name: 'Corporate', value: 'corporate' },
  { id: 6, name: 'Non-profit', value: 'non-profit' },
]

export const createOrganisationValidationSchema = Yup.object({
  [ORGANISATION_FORM_FIELDS.ORGANISATION_NAME]: Yup.string().trim().required(CONSTANT_MESSAGE.ORGANISATION_NAME_REQUIRED),
  [ORGANISATION_FORM_FIELDS.ORGANISATION_TYPE]: Yup.string().trim().required(CONSTANT_MESSAGE.ORGANISATION_TYPE_REQUIRED),
  [ORGANISATION_FORM_FIELDS.STREET_ADDRESS]: Yup.string().trim().required(CONSTANT_MESSAGE.ORGANISATION_STREET_ADDRESS_REQUIRED),
  [ORGANISATION_FORM_FIELDS.CITY]: Yup.string().trim().required(CONSTANT_MESSAGE.ORGANISATION_CITY_REQUIRED),
  [ORGANISATION_FORM_FIELDS.STATE_PROVINCE]: Yup.string().trim().required(CONSTANT_MESSAGE.ORGANISATION_STATE_PROVINCE_REQUIRED),
  [ORGANISATION_FORM_FIELDS.POSTAL_CODE]: Yup.string()
    .matches(
      validatePostalCode,
      'Invalid postal code format'
    )
    .required(CONSTANT_MESSAGE.ORGANISATION_POSTAL_CODE_REQUIRED),
  [ORGANISATION_FORM_FIELDS.COUNTRY]: Yup.string().trim().required(CONSTANT_MESSAGE.ORGANISATION_COUNTRY_REQUIRED),
  [ORGANISATION_FORM_FIELDS.CONTACT_NAME]: Yup.string().trim().required(CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_NAME_REQUIRED),
  [ORGANISATION_FORM_FIELDS.CONTACT_EMAIL]: Yup.string().trim()
    .required(CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_EMAIL_REQUIRED)
    .email(CONSTANT_MESSAGE.VALID_EMAIL_REQUIRED)
    .matches(
      validateEmail,
      CONSTANT_MESSAGE.VALID_EMAIL_REQUIRED,
    ),
  [ORGANISATION_FORM_FIELDS.CONTACT_PHONE]: Yup.string()
    .matches(
      validatePhone,
      'Invalid phone number format'
    )
    .required(CONSTANT_MESSAGE.ORGANISATION_PRIMARY_CONTACT_PHONE_REQUIRED)
});