import { createBrowserRouter } from "react-router";
import Layout from "./layouts/Layout";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResendVerification from "./pages/auth/ResendVerification";
import ResetPassword from "./pages/auth/ResetPassword";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import ProfileProductAdd from "./pages/ProfileProductAdd";
import ProfileProductEdit from "./pages/ProfileProductEdit";
import ProfileProducts from "./pages/ProfileProducts";
import UserProducts from "./pages/UserProducts";

export default createBrowserRouter([
    {
        children: [
            {
                path: "/login",
                Component: SignIn,
            },
            {
                path: "/register",
                Component: SignUp,
            },
            {
                path: "/forgot-password",
                Component: ForgotPassword,
            },
            {
                path: "resend-verification",
                Component: ResendVerification,
            },
            {
                path: "verify-email",
                Component: VerifyEmail,
            },
            {
                path: "reset-password",
                Component: ResetPassword,
            },
            {
                path: "/",
                Component: Layout,
                children: [
                    {
                        path: "",
                        Component: Home,
                    },
                    {
                        path: "products",
                        Component: Products,
                    },
                    {
                        path: "products/:id",
                        Component: ProductDetail,
                    },
                    {
                        path: "profile/products",
                        Component: ProfileProducts,
                    },
                    {
                        path: "profile/products/:id",
                        Component: ProfileProductEdit,
                    },
                    {
                        path: "profile/products/new",
                        Component: ProfileProductAdd,
                    },
                    {
                        path: "users/:id",
                        Component: UserProducts,
                    },
                ],
            },
            {
                path: "*",
                Component: NotFound,
            },
        ],
    },
]);
