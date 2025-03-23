import parsePhoneNumber, { AsYouType } from "libphonenumber-js/mobile";
import { Platform } from "react-native";

function isValidMobilePhone(value: string) {
  if (!value) return false;
  const phoneNumber = parsePhoneNumber(value, {
    defaultCountry: "US",
    extract: false,
  });
  if (phoneNumber?.isValid()) {
    if (phoneNumber.getType() === "MOBILE") {
      return true;
    }
  }
  return false;
}

function isValidPhone(value: string) {
  if (!value) return false;
  const phoneNumber = parsePhoneNumber(value, {
    defaultCountry: "US",
    extract: false,
  });
  if (phoneNumber?.isValid()) {
    return true;
  }
  return false;
}

// returns (801) 225-6115 or null
function phoneFormatter(inputPhoneNumber: string) {
  if (!inputPhoneNumber) return null;
  const phoneNumber = parsePhoneNumber(inputPhoneNumber, {
    defaultCountry: "US",
    extract: false,
  });
  if (phoneNumber?.isValid()) {
    return phoneNumber.formatNational();
  }
  return null;
}

// returns 8012256115 or null
function phoneFormatterDigitsOnly(inputPhoneNumber: string) {
  if (!inputPhoneNumber) return null;
  const phoneNumber = parsePhoneNumber(inputPhoneNumber, {
    defaultCountry: "US",
    extract: false,
  });
  if (phoneNumber?.isValid()) {
    return phoneNumber.nationalNumber;
  }
  return null;
}

// returns +18012256115 or null
function phoneFormatterE164(inputPhoneNumber: string) {
  if (!inputPhoneNumber) return null;
  const phoneNumber = parsePhoneNumber(inputPhoneNumber, {
    defaultCountry: "US",
    extract: false,
  });
  if (phoneNumber?.isValid()) {
    return phoneNumber.number;
  }
  return null;
}

// returns link to initiate a native phone call
function phoneFormatterAsLink(phoneNumber: string) {
  const prefix = Platform.OS === "ios" ? "telprompt" : "tel";
  return `${prefix}:${phoneFormatterDigitsOnly(phoneNumber)}`;
}

export {
  AsYouType,
  isValidMobilePhone,
  isValidPhone,
  phoneFormatter,
  phoneFormatterDigitsOnly,
  phoneFormatterE164,
  phoneFormatterAsLink,
};
