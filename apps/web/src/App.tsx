import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.js";

export function App() {
  return <RouterProvider router={router} />;
}
