"use client";

import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  Grid2,
  TextField,
  Typography,
  Box,
  Autocomplete,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { object, string } from "yup";
import {
  useLazyGetRolesQuery,
  useLazyGetOrganisationListQuery,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { RoleDetailsProps, RoleProps } from "@/types/roleAndPermission";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import { validateEmail } from "@/utils/validationData";
import { UserFormProps } from "@/types/userManagementType";
import {
  InitialOrganisationList,
  OrganisationListProps,
} from "@/types/organisation";
import Link from "next/link";
import { usePathname } from "next/navigation";

const UserForm = ({
  initialValues,
  onSubmit,
  isFormSubmitted,
}: UserFormProps) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isEditUserPath = pathname.includes("edit-user");
  const isCreateUserPath = pathname.includes(URL_CONSTANTS.ADMIN_USER_MANAGEMENT_CREATE_USER);
  const [getRoles] = useLazyGetRolesQuery();
  const [roles, setRoles] = useState<RoleProps[]>();
  const [getOrganisationList] = useLazyGetOrganisationListQuery();
  const [organisationList, setOrganisationList] =
    useState<OrganisationListProps>(InitialOrganisationList);
  const isAdmin =
    useAppSelector(
      (state) => state.cookies.cookies.userCookies?.organization_id,
    ) === 0;

  const handleGetOrganisationList = () => {
    getOrganisationList({
      endpoint: `${API_CONSTANTS.GET_ORGANISATION_LIST}?pagination=false`,
    })
      .unwrap()
      .then((getOrgRes) => {
        setOrganisationList(getOrgRes);
      })
      .catch((error) => {
        dispatch(
          showToastMessage({
            message: error?.data?.error?.message,
            severity: "error",
          }),
        );
      });
  };

  const handleGetRoles = () => {
    getRoles({
      endpoint: `${API_CONSTANTS.GET_ROLES_LIST}/?pagination=false`,
    })
      .unwrap()
      .then((roleRes) => {
        const filteredRoles = (roleRes as RoleDetailsProps)?.results?.filter((role) => {
          if (isCreateUserPath && role.role_id === 2) {
            return false; // Hide role_id === 2 for CREATE_USER path
          }
          return true; // Include all other roles
        });
        setRoles(filteredRoles);
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  };

  useEffect(() => {
    handleGetRoles();
    isAdmin && handleGetOrganisationList();
    }, []);

    console.log(roles)
  return (
    <Box className="mt-10">
      <Formik
        initialValues={initialValues}
        validationSchema={object({
          firstname: string().required(
            CONSTANT_MESSAGE.CREATE_USER_FIRST_NAME_REQUIRED,
          ),
          lastname: string().required(
            CONSTANT_MESSAGE.CREATE_USER_LAST_NAME_REQUIRED,
          ),
          email: string()
            .required(CONSTANT_MESSAGE.EMAIL_REQUIRED)
            .email(CONSTANT_MESSAGE.VALID_EMAIL_REQUIRED)
            .matches(validateEmail, CONSTANT_MESSAGE.VALID_EMAIL_REQUIRED),
          role_id: string().required(
            CONSTANT_MESSAGE.CREATE_USER_ROLE_REQUIRED,
          ),
        })}
        onSubmit={onSubmit}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            <Grid2 container spacing={2} className="!mb-5">
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">
                  {CONSTANT_MESSAGE.CREATE_USER_FIRST_NAME_LABEL}*
                </Typography>
                <Field
                  name="firstname"
                  as={TextField}
                  variant="outlined"
                  color="primary"
                  placeholder="First Name"
                  fullWidth
                  error={
                    Boolean(errors.firstname) && Boolean(touched.firstname)
                  }
                  helperText={touched.firstname && errors.firstname}
                  FormHelperTextProps={{
                    classes: {
                      root: "!ml-0",
                    },
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">
                  {CONSTANT_MESSAGE.CREATE_USER_LAST_NAME_LABEL}*
                </Typography>
                <Field
                  name="lastname"
                  as={TextField}
                  variant="outlined"
                  color="primary"
                  placeholder="Last Name"
                  fullWidth
                  error={Boolean(errors.lastname) && Boolean(touched.lastname)}
                  helperText={touched.lastname && errors.lastname}
                  FormHelperTextProps={{
                    classes: {
                      root: "!ml-0",
                    },
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">
                  {CONSTANT_MESSAGE.CREATE_USER_EMAIL_LABEL}*
                </Typography>
                <Field
                  name="email"
                  as={TextField}
                  variant="outlined"
                  color="primary"
                  placeholder="Email"
                  fullWidth
                  error={Boolean(errors.email) && Boolean(touched.email)}
                  helperText={touched.email && errors.email}
                  FormHelperTextProps={{
                    classes: {
                      root: "!ml-0",
                    },
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">
                  {CONSTANT_MESSAGE.CREATE_USER_ROLE_LABEL}*
                </Typography>
                <FormControl
                  fullWidth
                  error={Boolean(errors.role_id) && Boolean(touched.role_id)}
                >
                  <Autocomplete
                    disabled={isEditUserPath}
                    options={roles || []}
                    getOptionLabel={(option) => option.role_name}
                    value={
                      roles?.find(
                        (role) => role.role_id === values.role_id,
                      ) || null
                    } // Set initial value
                    onChange={(_, value) =>
                      setFieldValue("role_id", value ? value.role_id : "")
                    }
                    getOptionDisabled={(option) => option.role_id === 2}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select a role"
                        error={
                          Boolean(errors.role_id) && Boolean(touched.role_id)
                        }
                        helperText={touched.role_id && errors.role_id}
                        slotProps={{
                          formHelperText: {
                            className: "!ml-0",
                          },
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid2>
              {isAdmin && (
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1">
                    {CONSTANT_MESSAGE.CREATE_USER_ORGANISATION_LABEL}
                  </Typography>
                  <Autocomplete
                    options={organisationList?.results || []}
                    getOptionLabel={(option) => option?.organisation_name}
                    value={
                      organisationList?.results?.find(
                        (org) => org.organisation_id === values.organisation_id,
                      ) || null
                    }
                    onChange={(_, value) =>
                      setFieldValue(
                        "organisation_id",
                        value ? value?.organisation_id : "",
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select an organisation"
                        error={
                          Boolean(errors.organisation_id) &&
                          Boolean(touched.organisation_id)
                        }
                        helperText={
                          touched.organisation_id && errors.organisation_id
                        }
                      />
                    )}
                  />
                </Grid2>
              )}
            </Grid2>

            <div className="flex gap-3">
              <Link href={URL_CONSTANTS.ADMIN_USER_MANAGEMENT_VIEW_USER}>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  type="button"
                  disableRipple
                >
                  {CONSTANT_MESSAGE.CREATE_USER_CANCEL_BTN_LABEL}
                </Button>
              </Link>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isFormSubmitted}
                sx={{
                  backgroundColor: "primary.main",
                  "&.Mui-disabled": {
                    backgroundColor: "primary.main",
                    color: "white",
                    cursor: "not-allowed",
                  },
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                startIcon={
                  isFormSubmitted && (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                  )
                }
                disableRipple
              >
                {CONSTANT_MESSAGE.CREATE_USER_SAVE_BTN_LABEL}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default UserForm;
