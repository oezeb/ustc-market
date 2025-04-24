import request from "@/utils/request";

export function uploadImages(data, config) {
    return request({
        ...config,
        url: "/api/images",
        method: "post",
        data,
    });
}
