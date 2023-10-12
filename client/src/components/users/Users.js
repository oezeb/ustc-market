import React from "react";
import { useParams } from "react-router-dom";

import UserDetails from "./UserDetails";

const Users = () => {
    const { id } = useParams();
    return id ? <UserDetails id={id} /> : null;
};

export default Users;
