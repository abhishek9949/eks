"use client";

import React, { useState } from "react";
import PageMetaData from "@/components/common/PageMetaData";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import Image from "next/image";
import Link from "next/link";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ContactSalesForm from "@/components/ContactSales";
import {
  ContactSalesInitialValue,
  ContactSalesPayload,
} from "@/types/contactSalesType";
import { useContactSalesMutation } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import ConfirmApiDialog from "@/components/common/ConfirmApiDialog";
import { useRouter } from "next/navigation";

const initialValues: ContactSalesInitialValue = {
  first_name: "",
  last_name: "",
  email: "",
  country_code: "",
  phone_number: "",
  company_name: "",
  country: "",
  contact_reason: "",
};
const ConstactSalesPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [contactSales] = useContactSalesMutation();
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleContactSales = (payload: ContactSalesPayload) => {
    setIsFormLoading(true);
    contactSales({
      endpoint: API_CONSTANTS.CONTACT_SALES,
      method: "POST",
      data: payload,
    })
      .unwrap()
      .then(() => {
        setIsFormLoading(false);
        setOpenConfirmDialog(true);
        setTimeout(() => {
          router.push("/");
        }, 5000);
      })
      .catch((err) => {
        setIsFormLoading(false);
        dispatch(
          showToastMessage({
            message:
              err?.data?.detail ||
              "Error while submitting the contact sales form.",
            severity: "error",
          }),
        );
      });
  };

  const handleSubmit = async (values: ContactSalesInitialValue) => {
    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      country_code: values.country_code,
      phone_number: values.phone_number,
      company: values.company_name,
      country: values.country,
      message: values.contact_reason,
    };
    handleContactSales(payload);
  };
  return (
    <>
      <PageMetaData title="Contact Sales" />
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side Image (Visible on Large Screens) */}
        <div className="hidden min-h-[70vh] items-center justify-center bg-primary lg:flex lg:min-h-screen">
          <Image
            src="/images/logo/login_logo.webp"
            width={275}
            height={275}
            alt="logo"
            priority
          />
        </div>

        {/* Login Form */}
        <div className="min-h-[70vh] min-w-full bg-white lg:min-h-screen">
          <div className="ml-5 mr-5 mt-5 grid grid-cols-12 items-center">
            <div className="col-span-1">
              <Link href="/">
                <button className="flex w-max items-center text-gray-breadcrumb">
                  <ArrowBackIosIcon className="!text-[20px] !text-gray-breadcrumb" />
                  <span>Back</span>
                </button>
              </Link>
            </div>
          </div>
          <div className="mx-5 mt-5 grid grid-cols-12 pb-5 xl:mt-5 2xl:mt-10 2xl:pb-0 3xl:mt-20">
            <div className="col-span-1"></div>
            <div className="col-span-10">
              <h1
                className="text-3xl font-bold text-black"
                data-testid="login-title"
              >
                {CONSTANT_MESSAGE.CONTACT_SALES_TITLE}
              </h1>
              <p className="mb-2 text-lg text-gray-16 xl:mb-5">
                {CONSTANT_MESSAGE.CONTACT_SALES_DESCRIPTION}
              </p>

              <ContactSalesForm
                onSubmit={handleSubmit}
                initialValues={initialValues}
                isFormSubmitted={isFormLoading}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmApiDialog
        open={openConfirmDialog}
        handleClose={handleCloseConfirmDialog}
        message="Your submission was successful! Our sales team will contact you within 24 hours."
      />
    </>
  );
};

export default ConstactSalesPage;
