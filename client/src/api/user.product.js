import request from "@/utils/request";

export function getProducts(config) {
    return request({
        ...config,
        url: "/api/user/products",
        method: "get",
    });
}

export function getProduct(id, config) {
    return request({
        ...config,
        url: `/api/user/products/${id}`,
        method: "get",
    });
}

export function createProduct(data, config) {
    return request({
        ...config,
        url: "/api/user/products",
        method: "post",
        data,
    });
}

export function updateProduct(id, data, config) {
    return request({
        ...config,
        url: `/api/user/products/${id}`,
        method: "put",
        data,
    });
}

export function deleteProduct(id, config) {
    return request({
        ...config,
        url: `/api/user/products/${id}`,
        method: "delete",
    });
}
