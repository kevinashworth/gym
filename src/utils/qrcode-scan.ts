import { decode } from "js-base64";

import { ALLOW_PATHNAME } from "@/constants/constants";

import type { ParsedURL } from "expo-linking";

export class UriValidatorError extends Error {
  readonly type = "uri-validation-error";
}

export interface CheckInResult {
  type: "checkin";
  locationId: string;
  campaign_short_code: string;
}

export interface ReferralResult {
  type: "referral";
  locationId: string;
  referralCode: string;
}

export type UriValidatorResult = CheckInResult | ReferralResult;

export interface UriValidator {
  result?: UriValidatorResult;
  error?: UriValidatorError;
}

const getPayload = {
  referral(url: ParsedURL): ReferralResult | undefined {
    const infoParam = url.queryParams?.["info"] as string | undefined;
    if (!infoParam) {
      throw new UriValidatorError("Missing data [referral]");
    }
    try {
      const info = JSON.parse(decode(infoParam));
      if ("locationId" in info && "referralCode" in info) {
        return info;
      }
    } catch (error) {
      console.error(error);
      throw new UriValidatorError("Incorrect data format [referral]");
    }
  },
  checkin(url: ParsedURL): CheckInResult | undefined {
    const payload = url.path?.match(
      /checkin\/([^/]+)\/?$/,
    ) as RegExpMatchArray | null;
    if (!payload || !payload[1]) {
      throw new UriValidatorError("Missing data [checkin]");
    }
    try {
      const info = JSON.parse(decode(payload[1]));
      if ("locationId" in info && "campaign_short_code" in info) {
        return info;
      }
    } catch (error) {
      console.error(error);
      throw new UriValidatorError("Incorrect data format [checkin]");
    }
  },
};

export function uriValidator(url: any): UriValidator {
  try {
    const pathname = url.path.replace(/\/$/, "");
    console.log("pathname:", pathname);
    if (ALLOW_PATHNAME.some((pathPrefix) => pathname.startsWith(pathPrefix))) {
      const type: "referral" | "checkin" = pathname.match(
        /\/?(referral|checkin)\/?/,
      )?.[1];
      const result = {
        result: {
          type,
          ...getPayload[type](url),
        },
      };
      return result as UriValidator;
    } else {
      return {
        error: new UriValidatorError("Unsupported link [uriValidator]"),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      error: new UriValidatorError("Incorrect format [uriValidator]"),
    };
  }
}
