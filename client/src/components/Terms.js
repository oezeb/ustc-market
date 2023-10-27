import { AppBar, Box, Toolbar } from "@mui/material";
import { CopyRight, Logo } from "./Layout";

function Terms() {
    return (
        <Box>
            <AppBar color="default">
                <Toolbar>
                    <Logo />
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Box p={1}>
                <h2>Terms of Use</h2>
                <h3>1. Acceptance of Terms</h3>
                <p>
                    USTC Market has no direct connection with the University of
                    Science and Technology of China (USTC), and is not
                    affiliated with any institution or organization under USTC.{" "}
                    <br />
                    By using the USTC Market platform, you agree to comply with
                    and be bound by these Terms of Use. If you do not agree with
                    these terms, please do not use the Platform.
                </p>
                <h3>2. Eligibility</h3>
                <p>
                    The USTC Market is intended solely for use by students of
                    the University of Science and Technology of China (USTC). To
                    register and use the platform, you must have a valid USTC
                    email address. You must also be a current student of USTC.
                    By using the platform, you represent and warrant that you
                    meet these eligibility requirements.
                </p>
                <h3>3. User Accounts</h3>
                <ul>
                    <li>
                        When creating a user account, you agree to provide
                        accurate and up-to-date information.
                    </li>
                    <li>
                        You are responsible for maintaining the confidentiality
                        of your account credentials.
                    </li>
                    <li>
                        You are solely responsible for any activity occurring
                        under your account.
                    </li>
                </ul>
                <h3>4. User Responsibilities</h3>
                <ul>
                    <li>
                        You agree to use the Platform for lawful purposes only.
                    </li>
                    <li>
                        You are solely responsible for the content you post on
                        the Platform.
                    </li>
                    <li>
                        You may only post items for sale or request to buy items
                        within the USTC community.
                    </li>
                </ul>
                <h3>5. Transactions</h3>
                <ul>
                    <li>
                        The USTC Market acts as a platform for facilitating
                        transactions between students.
                    </li>
                    <li>
                        The platform does not participate in or have any
                        responsibility for the transactions, including payment
                        processing, delivery, or quality of items.
                    </li>
                    <li>
                        Users are responsible for negotiating and completing
                        transactions, including setting prices, payment terms,
                        and delivery arrangements.
                    </li>
                </ul>
                <h3>6. User Conduct</h3>
                <ul>
                    <li>
                        You must conduct yourself in a respectful and
                        professional manner when interacting with other users.
                    </li>
                    <li>
                        Harassment, discrimination, or any form of abusive
                        behavior will not be tolerated.
                    </li>
                </ul>
                <h3>7. Privacy</h3>
                <ul>
                    <li>
                        Your privacy is important to us. Please refer to our{" "}
                        <a href="/privacy">Privacy Policy</a> to understand how
                        we collect, use, and protect your personal information.
                    </li>
                </ul>
                <h3>8. Termination</h3>
                <ul>
                    <li>
                        We reserve the right to terminate or suspend any user
                        account for any reason, including violation of these
                        Terms of Use.
                    </li>
                </ul>
                <h3>9. Limitation of Liability</h3>
                <ul>
                    <li>
                        The USTC Market is not responsible for any disputes or
                        issues arising from transactions between users.
                    </li>
                    <li>
                        We are not responsible for the quality, safety, or
                        legality of items listed on the platform.
                    </li>
                </ul>
                <h3>10. Changes to Terms</h3>
                <ul>
                    <li>
                        We may update these Terms of Use from time to time. It
                        is your responsibility to review the terms periodically.
                    </li>
                </ul>
                <h3>11. Contact Information</h3>
                <p>
                    If you have any questions or concerns about these Terms of
                    Use, please contact us at{" "}
                    <a href="mailto:support@ustc.market">support@ustc.market</a>
                    .
                </p>
            </Box>
            <CopyRight />
            <Toolbar />
        </Box>
    );
}

export default Terms;
