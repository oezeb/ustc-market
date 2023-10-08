import React from "react";
import { useNavigate } from "react-router-dom";

import { apiRoutes } from "../api";
import AddEditItem from "./AddEditItem";

function AddItem() {
    const navigate = useNavigate();

    const handleSubmit = (formData) => {
        fetch(apiRoutes.profileItems, {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => navigate("/items/" + data._id))
            .catch((err) => console.error(err));
    };

    return <AddEditItem onSubmit={handleSubmit} />;
}

export default AddItem;
