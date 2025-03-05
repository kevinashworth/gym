import Color from "color";

export const spectrum = {
  primary: "#0047BA",
  primaryLight: Color("#0047BA").lighten(0.4).rgb().toString(),
  primaryContent: "#fff",
  secondary: "#71E2EA",
  success: "#00a13c",
  warning: "#fc7100",
  error: "#F13A1E",
  errorLight: Color("#F13A1E").lighten(0.4).rgb().toString(),
  errorContent: "#fff",
  base1: "#fff",
  base1Content: "#303030",
  base2Content: Color("#434343").alpha(0.72).rgb().toString(),
  base3Content: Color("#434343").alpha(0.5).rgb().toString(),
};
