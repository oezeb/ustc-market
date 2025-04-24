import request from "@/utils/request";

export function login(data, config) {
    return request({
        ...config,
        url: "/api/auth/login",
        method: "post",
        data,
    });
}

export function register(data, config) {
    return request({
        ...config,
        url: "/api/auth/register",
        method: "post",
        data,
    });
}

export function forgotPassword(data, config) {
    return request({
        ...config,
        url: "/api/auth/forgot-password",
        method: "post",
        data,
    });
}

export function resendVerification(data, config) {
    return request({
        ...config,
        url: "/api/auth/resend-verification",
        method: "post",
        data,
    });
}

export function verifyEmail(token, config) {
    return request({
        ...config,
        url: "/api/auth/verify-email",
        method: "get",
        params: { ...config.params, token },
    });
}

export function resetPassword(data, config) {
    return request({
        ...config,
        url: "/api/auth/reset-password",
        method: "post",
        data,
    });
}
