import request from "@/utils/request";

export function getUser(config) {
    return request({
        ...config,
        url: "/api/user",
        method: "get",
    });
}

export function getUserById(userId, config) {
    return request({
        ...config,
        url: `/api/user/${userId}`,
        method: "get",
    });
}
