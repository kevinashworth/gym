// for password validation
export const specialChars = "`~<>./!@#$%^&*()-_+=\",'{} [];:";
export const specialRegex = new RegExp(
  ".*[ `~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*",
);

export const EMPTY_ARRAY = [];
export const EMPTY_OBJECT = [];
export const NOOP = () => void 0;

export const ALLOW_PATHNAME = ["referral", "checkin"];
