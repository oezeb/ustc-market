import { Route, Routes } from "react-router-dom";

import Home from "./Home";
import Layout from "./Layout";
import SnackbarProvider from "./SnackbarProvider";
import AuthProvider, { RequireAuth } from "./auth/AuthProvider";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ResetPassword from "./auth/ResetPassword";
import VerificationEmail from "./auth/VerificationEmail";
import AddItem from "./items/AddItem";
import EditItem from "./items/EditItem";
import Items from "./items/Items";
import Messages from "./messages/Messages";
import SendMessage from "./messages/SendMessage";
import Profile from "./profile/Profile";
import ProfileEdit from "./profile/ProfileEdit";
import Users from "./users/Users";

const App = () => (
    <SnackbarProvider>
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
                path="/verification-email/:token?"
                element={<VerificationEmail />}
            />
            <Route path="/reset-password/:token?" element={<ResetPassword />} />

            <Route
                path="/"
                element={
                    <AuthProvider
                        children={<RequireAuth children={<Layout />} />}
                    />
                }
            >
                <Route index element={<Home />} />
                <Route path="/items/:id?" element={<Items />} />
                <Route path="/items/:id/edit" element={<EditItem />} />
                <Route path="/items/add" element={<AddItem />} />
                <Route path="/messages" element={<Messages />} />
                <Route
                    path="/messages/:itemId/:userId"
                    element={<SendMessage />}
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<ProfileEdit />} />
                <Route path="/users/:id?" element={<Users />} />
            </Route>
        </Routes>
    </SnackbarProvider>
);

export default App;
