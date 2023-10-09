import { Route, Routes } from "react-router-dom";

import AuthProvider, { RequireAuth } from "AuthProvider";

import AddItem from "./AddItem";
import EditItem from "./EditItem";
import Home from "./Home";
import Layout from "./Layout";
import Login from "./Login";
import Profile from "./Profile";
import Items from "./items/Items";
import Users from "./users/Users";
import ProfileEdit from "./ProfileEdit";

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
