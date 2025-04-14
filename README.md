# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project

# GYM

## Sitemap

```bash
npx expo-router-sitemap
```

```txt
/
/+html
/+not-found
/action
/category/[id]
/dashboard
/entry/recovery/apply
/entry/recovery/submit
/entry/sign-in
/entry/sign-up/collect-account
/entry/sign-up/collect-info
/entry/sign-up/success
/entry/sign-up/verify-account
/location/[uuid]
/notifications
/search
/settings/
/settings/dev
/settings/help
/settings/profile/
/wallet

✅ No route collisions detected.
```

## Notes to self

These notes are a little sloppy, a WIP, not a introduction to the codebase

### Do not use

- Tamagui
- easy-peasy
- Local state as a copy of server state

### Do use

- Typescript
- zod
- zustand for local state
- TanStack Query for server state
- TanStack Query with ky, and sometimes just ky, for network requests

### Bugs, Fixes

- collect-account not shown anymore, only verify-account
- Location permission stuff needs better verbiage

### Not built yet

Location screen:\
Modal to show a single image in large view\
Use a location's `is_favorite` 1) instead of `favorites` or 2) to improve favorites performance

Settings:\
Invite Friends

For UX, add a message when the user has reached the end of the Search list. Also, for dev, why does pageInfo not show up below the search results all the time?

### Not planning to build

Favorites in store

### Recently built

Sign up

Remove insets that are not needed. Kept insets for headers and toasts, removed insets for the rest.

For a user that doesn't give location permissions, we should probably show a message and not use a dummy location. I mean, is the app even useful without location permissions?

- Add campaign functionality to Location screen ("Earn Rewards...")

Pull-down to refresh\
Done: Dashboard screen, Wallet screen, Search screen, Categories screen

Dev-only settings on Settings screen

Search

Wallet history -- connect to API

## Note about Location and Favorites

Dashboard:
api.get("user/location/favorites", { searchParams: { lat, lng } }).json(),
// gy_user views.py UserLocationsFavorites
// gets favorites near location. Used only on Dashboard, the other favorites API is used for the favorite-location.tsx component on the Location screen and the Search screen. (The server then marks the location as a favorite, so it's the same info after everything has refreshed.)

useFavoriteLocation:
api.get("user/favorite/favorites").json();
// gy_user views.py ListFavoriteLocations
// does not depend on current lat, lng
