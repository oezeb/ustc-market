package com.github.oezeb.server.service;

import com.github.oezeb.server.dto.TokenResponse;
import com.github.oezeb.server.entity.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class MailService {
    private final JavaMailSender mailSender;

    @Value("${app.verification.base-url}")
    private String verificationBaseUrl;
    @Value("${app.password-reset.base-url}")
    private String passwordResetBaseUrl;

    @Value("${spring.mail.username}")
    private String from;

    public void sendVerificationEmail(String to, String name, TokenResponse tokenResponse) {
        String subject = "Verify your email";

        // Build verification URL
        String verificationLink = verificationBaseUrl + "?token=" + tokenResponse.token;

        // Build HTML content
        String content = "<p>Hi " + name + ",</p>"
                + "<p>Please verify your email by clicking the link below:</p>"
                + "<a href=\"" + verificationLink + "\">Verify Email</a>"
                + "<p>This link will expire on " + tokenResponse.expiration / 60 + " minutes.</p>"
                + "<p>If you didn't request this, you can safely ignore this email.</p>"
                + "<p>Best regards, <br>USTC Market</p>";


        // Send email
        sendEmail(to, subject, content, true);
    }

    public void sendPasswordResetEmail(User user, TokenResponse tokenResponse) {
        String to = user.getEmail();
        String subject = "Reset your password";

        // Build reset link
        String resetLink = passwordResetBaseUrl + "?token=" + tokenResponse.token;

        // Build HTML content
        String content = "<p>Hello " + user.getName() + ",</p>"
                + "<p>We received a request to reset your password.</p>"
                + "<p>Click the link below to set a new password:</p>"
                + "<a href=\"" + resetLink + "\">Reset Password</a>"
                + "<p>If you didn’t request this, you can safely ignore this email.</p>"
                + "<p>This link will expire on " + tokenResponse.expiration / 60 + " minutes.</p>"
                + "<p>Best regards, <br>USTC Market</p>";

        sendEmail(to, subject, content, true);
    }

    public void sendEmail(String to, String subject, String content, Boolean isHtml) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, isHtml, "UTF-8");

            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, isHtml);

            mailSender.send(message);
        } catch (MessagingException | MailException e) {
            // Handle/log error appropriately
            throw new RuntimeException("Failed to send email", e);
        }
    }
}

