import request from "@/utils/request";

export function getProducts(config) {
    return request({
        ...config,
        url: "/api/products",
        method: "get",
    });
}

export function getProduct(id, config) {
    return request({
        ...config,
        url: `/api/products/${id}`,
        method: "get",
    });
}
