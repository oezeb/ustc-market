import { AppBar, Box, Toolbar } from "@mui/material";
import { CopyRight, Logo } from "./Layout";

function Privacy() {
    return (
        <Box>
            <AppBar color="default">
                <Toolbar>
                    <Logo />
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Box p={1}>
                <h2>Privacy Policy</h2>
                <p>
                    Your privacy is important to us. This Privacy Policy
                    explains how we collect, use, and protect your data on the
                    USTC Market platform.
                </p>
                <h3>1. Information We Collect</h3>
                <p>
                    We collect and use your USTC email address during
                    registration to ensure that all users on our platform are
                    USTC students. Rest assured that we will never share your
                    email address with any third parties. We will only use it
                    for account verification and password reset purposes.
                </p>
                <h3>2. User Anonymity</h3>
                <p>
                    All users on our platform are kept anonymous to each other.
                    Your email address will not be visible to other users. Only
                    a nickname and avatar of your choice will be displayed. You
                    can use our messaging system to communicate with other users
                    securely.
                </p>
                <h3>3. Item Visibility</h3>
                <p>
                    All items posted on our platform are visible to
                    authenticated users. To optimize storage space, items that
                    have been posted for more than one year will be
                    automatically deleted.
                </p>
                <h3>4. Messaging Security</h3>
                <p>
                    We take your privacy seriously. All messages sent through
                    our platform are encrypted before being stored in our
                    database. However, for your safety, we strongly discourage
                    sending sensitive information (e.g., bank account details)
                    through the messaging system. Its primary purpose is to
                    facilitate communication, share contact information, and
                    arrange meetings with other users.
                </p>
                <h3>5. Usage Analytics</h3>
                <p>
                    In our efforts to improve the user experience, we use{" "}
                    <a href="https://tongji.baidu.com/">Baidu Analytics</a> to
                    collect anonymous statistics regarding platform usage. This
                    helps us make informed decisions to enhance our services.
                </p>
                <h3>6. Changes to the Privacy Policy</h3>
                <p>
                    We may update this Privacy Policy as needed. Any changes
                    will be communicated to you through the platform. We
                    recommend reviewing this policy periodically to stay
                    informed about how your data is handled.
                </p>
                <h3>7. Contact Us</h3>
                <p>
                    If you have any questions or concerns about your privacy or
                    this Privacy Policy, please feel free to contact us at{" "}
                    <a href="mailto:support@ustc.market">support@ustc.market</a>
                    .
                </p>
            </Box>
            <CopyRight />
            <Toolbar />
        </Box>
    );
}

export default Privacy;
