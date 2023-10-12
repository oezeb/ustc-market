import React from "react";
import { useParams } from "react-router-dom";

import ItemDetails from "./itemdetails/ItemDetails";
import ItemList from "./itemlist/ItemList";

const Items = () => {
    const { id } = useParams();
    return id ? <ItemDetails id={id} /> : <ItemList />;
};

export default Items;
