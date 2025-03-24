import type { Location } from "@/types/location";

export function formatAddressForMaps(location: Location) {
  return (
    location.address1 +
    (location.address2 ? ` ${location.address2}, ` : " ") +
    location.city +
    ", " +
    location.state +
    " " +
    location.zip
  );
}
