import { Route, Routes } from "react-router-dom";

import AuthProvider, { RequireAuth } from "../AuthProvider";
import AddItem from "./AddItem";
import EditItem from "./EditItem";
import Items from "./Items";
import Layout from "./Layout";
import Login from "./Login";
import Profile from "./Profile";

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
          <Route index element={<Items />} />
          <Route path="/messages" element={<div>Messages</div>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/items/:id?" element={<Items />} />
          <Route path="/items/add" element={<AddItem />} />
          <Route path="/items/:id/edit" element={<EditItem />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
