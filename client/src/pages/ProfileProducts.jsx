import { uploadImages } from "@/api/image";
import { createProduct, getProducts } from "@/api/user.product";
import FloatingAddButton from "@/components/FloatingAddButton";
import Products from "@/components/Products";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import * as React from "react";
import { useSearchParams } from "react-router";

export default function ProfileProducts() {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleChange = (_, newValue) => {
        setSearchParams((prev) => {
            const params = Object.fromEntries(prev.entries());
            return { ...params, page: 0, tab: newValue };
        });
    };

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}
            >
                {value === index && <Box>{children}</Box>}
            </div>
        );
    }

    const _getProducts = (config) => {
        return getProducts({
            ...config,
            params: { ...config.params, sold: false },
        });
    };

    return (
        <Box>
            <Box position="sticky" top={5} zIndex={1}>
                <Tabs
                    value={searchParams.get("tab") || "listed"}
                    onChange={handleChange}
                >
                    <Tab value="listed" label="Listed" />
                    <Tab value="sold" label="Sold" />
                </Tabs>
            </Box>
            <TabPanel
                value={searchParams.get("tab") || "listed"}
                index="listed"
            >
                <Products
                    getProducts={getProducts}
                    params={{ sold: false }}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />
            </TabPanel>
            <TabPanel value={searchParams.get("tab") || "listed"} index="sold">
                <Products
                    getProducts={getProducts}
                    params={{ sold: true }}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />
            </TabPanel>
            <FloatingAddButton
                add={createProduct}
                addFormPayload={{ uploadImages }}
            />
        </Box>
    );
}
