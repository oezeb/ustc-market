import React from "react";
import { useParams } from "react-router-dom";

import ItemDetails from "./ItemDetails";
import ItemList from "./ItemList";

function Items() {
    const { id } = useParams();
    return id ? <ItemDetails id={id} /> : <ItemList />;
}

export default Items;
