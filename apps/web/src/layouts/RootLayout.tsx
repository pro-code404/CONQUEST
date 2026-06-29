import { Outlet } from "react-router-dom";
import { CookieConsentBanner } from "../features/legal/CookieConsentBanner.js";

/** Wraps all routes so global UI (cookie banner) stays inside RouterProvider. */
export function RootLayout() {
  return (
    <>
      <Outlet />
      <CookieConsentBanner />
    </>
  );
}
