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

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route
                    path="/"
                    element={
                        <RequireAuth>
                            <Layout />
                        </RequireAuth>
                    }
                >
                    <Route index element={<Home />} />
                    <Route path="/messages" element={<div>Messages</div>} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/edit" element={<ProfileEdit />} />
                    <Route path="/items/:id?" element={<Items />} />
                    <Route path="/items/add" element={<AddItem />} />
                    <Route path="/items/:id/edit" element={<EditItem />} />
                    <Route path="/users/:id?" element={<Users />} />
                </Route>
                <Route path="/login" element={<Login />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
