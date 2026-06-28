import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.js";
import { CookieConsentBanner } from "./features/legal/CookieConsentBanner.js";

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <CookieConsentBanner />
    </>
  );
}
