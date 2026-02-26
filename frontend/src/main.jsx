import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./routes/App";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./routes/Home";
import Bag from "./routes/Bag";
import SellerDashboard from "./routes/SellerDashboard";
import MyRequests from "./routes/MyRequests";
import MyntraStore from "./store";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/bag",
        element: <Bag />,
      },
      {
        path: "/seller/dashboard",
        element: <SellerDashboard />,
      },
      {
        path: "/my-requests",
        element: <MyRequests />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={MyntraStore}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
