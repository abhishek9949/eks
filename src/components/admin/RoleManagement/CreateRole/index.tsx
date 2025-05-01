'use client';
import React, { useEffect, useState } from "react";
import { 
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
 } from "@mui/material";
import { ExpandMoreOutlined } from "@mui/icons-material";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup"; 
import clsx from "clsx";
import Image from "next/image";
import { ChildPermissionProps, CreateRoleProps, CreateRoleSubmitProps, PermissionProps } from "@/types/roleAndPermission";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import Link from "next/link";

const CreateRole = ({
  permissions,
  handleRoleSubmit,
  roleId,
  roleDetails,
  isFormSubmitted
}: CreateRoleProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const dispatch = useAppDispatch();
  
  const initalValues = {
    roleName: roleDetails?.roleName ?? '',
    roleDescription: roleDetails?.roleDescription ?? ''
  }

  useEffect(() => {
    if (roleId && roleDetails?.selectedPermissions) {
      setSelectedPermissions(roleDetails?.selectedPermissions)
    }
  }, [roleDetails]);

  const validationSchema = Yup.object({
    roleName: Yup.string().trim().required('Role name is required'),
    roleDescription: Yup.string().trim().required('Role description is required')
  })

  const hanldeEventPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handlePermissionSelect = (permissionId: number) => {
    setSelectedPermissions((prevPermissions) => {
      if (prevPermissions.includes(permissionId)) {
        return prevPermissions.filter((id) => id !== permissionId);
      } else {
        return [...prevPermissions, permissionId];
      }
    });
  };

  const handlePermissionClick = (event: React.MouseEvent, permissionId: number) => {
    hanldeEventPropagation(event);
    handlePermissionSelect(permissionId);
  }

  const handleSubmit = (values: Omit<CreateRoleSubmitProps, 'selectedPermissions'>) => {
    if (selectedPermissions?.length === 0) {
      dispatch(showToastMessage({ message: "Please select a permission", severity: "error"}));
    } else {
      handleRoleSubmit({ ...values, selectedPermissions});
    }
  }

  const renderSubPermissions = (subPermissions: ChildPermissionProps[]) => (
    subPermissions.map((subPermission) => (
      <FormControlLabel
        key={subPermission.permission_id}
        control={
          <Checkbox
            onClick={(event) => handlePermissionClick(event, subPermission.permission_id)}
            checked={selectedPermissions?.includes(subPermission?.permission_id)}
          />
        }
        label={subPermission.permission_name}
      />
    ))
  );

  return (
    <Box>
      <Formik 
        initialValues={initalValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
        enableReinitialize
      >
        {({ errors, touched }) => (
          <Form>
            <div className="grid grid-cols-12 gap-7 3xl:gap-3 pt-4">
              <div className="col-span-5 3xl:col-span-4 flex flex-col w-full max-w-xl gap-4">
                <div>
                  <Typography variant="subtitle1">
                    Role Name*
                  </Typography>
                  <Field
                    name="roleName"
                    as={TextField}
                    variant="outlined"
                    color="primary"
                    fullWidth
                    placeholder="Enter Role Name"
                    error={
                      Boolean(errors.roleName) && Boolean(touched.roleName)
                    }
                    helperText={Boolean(touched.roleName) && errors.roleName}
                    FormHelperTextProps={{
                      classes: {
                        root: "!ml-0",
                      },
                    }}
                  />
                </div>
                <div>
                  <Typography>
                    Role Description*
                  </Typography>
                  <Field
                    name="roleDescription"
                    as={TextField}
                    variant="outlined"
                    color="primary"
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Enter Role Description"
                    error={
                      Boolean(errors.roleDescription) && Boolean(touched.roleDescription)
                    }
                    helperText={Boolean(touched.roleDescription) && errors.roleDescription}
                    FormHelperTextProps={{
                      classes: {
                        root: "!ml-0",
                      },
                    }}
                  />
                </div>
                <div className="flex gap-3">
                  <Link href={URL_CONSTANTS.ADMIN_ROLE_MANAGEMENT_VIEW}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="large"
                      disableRipple
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
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
                    Save
                  </Button>
                </div>
              </div>
              <div className="col-span-6">
                <Typography>
                  Role Permissions*
                </Typography>
                <div className="grid grid-cols-12 gap-4">
                  {permissions?.map((permission: PermissionProps) => (
                    <div className="col-span-6" key={permission?.permission_id}>
                      <Accordion className="shadow-none border !m-0">
                        <AccordionSummary
                          expandIcon={permission?.sub_permissions ? <ExpandMoreOutlined /> : null}
                          aria-controls="panel1-content"
                          id="panel1-header"
                          onClick={hanldeEventPropagation}
                          className={clsx(`[&.Mui-expanded]:bg-gray-9`)}
                        >
                          <Image src={permission?.icon ?? '/svg/resourceAndResearch.svg'} width={28} height={28} alt="permission-image" />
                          <span className="px-3">{permission?.permission_name}</span>
                        </AccordionSummary>
                        {permission?.sub_permissions?.length > 0 && (
                          <AccordionDetails className="pl-10 flex flex-col m-0">
                            {renderSubPermissions(permission?.sub_permissions)}
                          </AccordionDetails>
                        )}
                      </Accordion>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateRole;