import { Route, Routes } from "react-router-dom";

import AuthProvider, { RequireAuth } from "components/auth/AuthProvider";

import Home from "./Home";
import Layout from "./Layout";
import Login from "./auth/Login";
import AddItem from "./items/AddItem";
import EditItem from "./items/EditItem";
import Items from "./items/Items";
import Profile from "./profile/Profile";
import ProfileEdit from "./profile/ProfileEdit";
import Users from "./users/Users";
import SnackbarProvider from "./SnackbarProvider";
import Messages from "./messages/Messages";
import SendMessage from "./messages/SendMessage";

const App = () => (
    <SnackbarProvider>
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<RequireAuth children={<Layout />} />}>
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
        </AuthProvider>
    </SnackbarProvider>
);

export default App;
