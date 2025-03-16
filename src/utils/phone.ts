import { phone } from "phone";
import { Platform } from "react-native";

// 'phone' docs: "phone number will be treated as USA or Canada by default"

function isValidPhone(value: string) {
  if (!value) {
    return false;
  }
  const phoneObject = phone(value);
  if (!phoneObject.isValid) {
    return false;
  }
  return true;
}

const handledCountryCodes = ["+1"]; // USA, Canada

function isHandledCountryCode(countryCode: string) {
  return handledCountryCodes.indexOf(countryCode) > -1;
}

// returns (801) 225-6115
function phoneFormatter(inputPhoneNumber: string | null) {
  if (!inputPhoneNumber) return null;
  const digitsOnly = phoneFormatterDigitsOnly(inputPhoneNumber);
  const match = digitsOnly.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return inputPhoneNumber;
}

// returns 8012256115
function phoneFormatterDigitsOnly(inputPhoneNumber: string) {
  const phoneObject = phone(inputPhoneNumber);
  if (!phoneObject.isValid) {
    return inputPhoneNumber;
  }
  const { countryCode, phoneNumber } = phoneObject;
  const digitsOnly = isHandledCountryCode(countryCode)
    ? phoneNumber.slice(countryCode.length)
    : phoneNumber.replace(/\D/g, "");
  return digitsOnly;
}

// returns link to initiate a native phone call
function phoneFormatterAsLink(phoneNumber: string) {
  const prefix = Platform.OS === "ios" ? "telprompt" : "tel";
  return `${prefix}:${phoneFormatterDigitsOnly(phoneNumber)}`;
}

export { isValidPhone, phoneFormatter, phoneFormatterAsLink };
