import request from "@/utils/request";

export function getCategories(config) {
    return request({
        ...config,
        url: "/api/categories",
        method: "get",
    });
}
