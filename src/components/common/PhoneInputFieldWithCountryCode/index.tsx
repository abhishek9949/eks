"use client";

import { FC, useState, useEffect } from "react";
import { Box, SxProps, Theme } from "@mui/material";
import { GLOBAL_CONSTANTS } from "@/constants/index";
import { MuiTelInput, MuiTelInputCountry } from "mui-tel-input";

const countryValidations: Record<
  string,
  {
    iso: MuiTelInputCountry;
    pattern: RegExp;
    message: string;
    minLength: number;
    maxLength: number;
  }
> = {
  "+1": {
    iso: "US",
    pattern: /^[2-9]\d{2}[2-9]\d{6}$/,
    message: "Please enter a valid US phone number (e.g., 1234567890)",
    minLength: 10,
    maxLength: 10,
  },
  "+91": {
    iso: "IN",
    pattern: /^[6-9]\d{9}$/,
    message:
      "Please enter a valid Indian phone number (10 digits starting with 6-9)",
    minLength: 10,
    maxLength: 10,
  },
  "+44": {
    iso: "GB",
    pattern: /^[1-9]\d{1,4}\d{6,7}$/,
    message: "Please enter a valid UK phone number",
    minLength: 9,
    maxLength: 10,
  },
};

interface PhoneInputProps {
  value: { phone: string; countryCode: string };
  onChange: (phone: string, countryCode: string, isValid: boolean) => void;
  defaultCountryCode?: string;
  width?: string;
  error?: boolean;
  helperText?: string;
  onBlur?: () => void;
  className?: string;
  sx?: SxProps<Theme>;
  required?: boolean;
}

const PhoneInputField: FC<PhoneInputProps> = ({
  value,
  onChange,
  defaultCountryCode = GLOBAL_CONSTANTS.DEFAULT_COUNTRY_CODE,
  width = "100%",
  error = false,
  helperText,
  onBlur,
  className,
  sx,
  required = false,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(value.phone ?? "");
  const [countryCode, setCountryCode] = useState(
    value.countryCode ?? defaultCountryCode,
  );
  const [country, setCountry] = useState<MuiTelInputCountry>(
    countryValidations[defaultCountryCode]?.iso ||
      GLOBAL_CONSTANTS.DEFAULT_COUNTRY,
  );
  const [isTouched, setIsTouched] = useState(false);

  const currentValidation =
    countryValidations[countryCode] || countryValidations[defaultCountryCode];

  const validatePhone = (
    phone: string,
  ): { isValid: boolean; message?: string } => {
    if (required && !phone) {
      return { isValid: false, message: "Phone number is required" };
    }

    if (!phone) return { isValid: !required }; // Empty is valid if not required
    if (currentValidation) {
      if (phone.length < currentValidation.minLength) {
        return { isValid: false, message: `Phone number too short` };
      }
    }
    if (currentValidation) {
      if (phone.length > currentValidation.maxLength) {
        return { isValid: false, message: `Phone number too long` };
      }
    }
    if (currentValidation) {
      if (!currentValidation.pattern.test(phone)) {
        return { isValid: false, message: currentValidation.message };
      }
    }

    return { isValid: true };
  };

  useEffect(() => {
    const newCountry = countryValidations[defaultCountryCode]?.iso;
    if (newCountry) {
      setCountry(newCountry);
      setCountryCode(defaultCountryCode);
    }
  }, [defaultCountryCode]);

  const handlePhoneChange = (newValue: string) => {
    if (!newValue) {
      const newPhone = "";
      const newCountryCode = defaultCountryCode;
      setPhoneNumber(newPhone);
      setCountryCode(newCountryCode);
      onChange(newPhone, newCountryCode, !required);
      return;
    }

    const phoneParts = newValue.split(" ");
    const newCountryCode = phoneParts[0] || defaultCountryCode;
    const parsedPhone = phoneParts.slice(1).join("").replace(/\D/g, "");

    setPhoneNumber(parsedPhone);
    setCountryCode(newCountryCode);

    const newCountry = countryValidations[newCountryCode]?.iso;
    if (newCountry && newCountry !== country) {
      setCountry(newCountry);
    }

    const validation = validatePhone(parsedPhone);
    onChange(parsedPhone, newCountryCode, validation.isValid);
  };

  const handleBlur = () => {
    setIsTouched(true);
    onBlur?.();
  };

  const validation = validatePhone(phoneNumber);
  const showError = error || (isTouched && !validation.isValid);
  const errorMessage = showError ? helperText || validation.message : undefined;

  return (
    <Box width={width} className={className} sx={sx}>
      <MuiTelInput
        onlyCountries={Object.values(countryValidations).map((v) => v.iso)}
        placeholder="Phone number"
        defaultCountry={country}
        value={`${countryCode} ${phoneNumber}`}
        onChange={handlePhoneChange}
        fullWidth
        disableFormatting={false}
        forceCallingCode
        focusOnSelectCountry
        error={showError}
        helperText={errorMessage}
        onBlur={handleBlur}
        required={required}
        sx={{
          "& .MuiOutlinedInput-root": {
            "&.Mui-error fieldset": {
              borderColor: "error.main",
            },
          },
          "& .MuiFormHelperText-root": {
            marginLeft: 0,
            color: showError ? "error.main" : "text.secondary",
          },
        }}
      />
    </Box>
  );
};

export default PhoneInputField;
