export const apiRoutes = {
    // auth
    register: "/api/auth/register",
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    sendVerificationEmail: "/api/auth/send-verification-email",
    verifyEmail: "/api/auth/verify-email",
    sendResetPasswordEmail: "/api/auth/send-reset-password-email",
    resetPassword: "/api/auth/reset-password",

    // items
    items: "/api/items",
    itemCount: "/api/items/count",
    itemTags: "/api/items/tags",

    // profile
    profile: "/api/profile",

    // users
    users: "/api/users",

    // upload
    uploadImages: "/api/upload/images",

    // messages
    messages: "/api/messages",
    messageCount: "/api/messages/count",
};
