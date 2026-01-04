package com.fullstack.worker_service.service;

import sendinblue.ApiClient;
import sendinblue.ApiException;
import sendinblue.Configuration;
import sendinblue.auth.ApiKeyAuth;
import sibModel.*;
import sibApi.TransactionalEmailsApi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${sender.email}")
    private String senderEmail;

    private TransactionalEmailsApi apiInstance;

    private TransactionalEmailsApi getApiInstance() {
        if (apiInstance == null) {
            ApiClient defaultClient = Configuration.getDefaultApiClient();
            ApiKeyAuth apiKey = (ApiKeyAuth) defaultClient.getAuthentication("api-key");
            apiKey.setApiKey(brevoApiKey);
            apiInstance = new TransactionalEmailsApi();
        }
        return apiInstance;
    }

    public void sendRegistrationOtp(String toEmail, String otp) {
        SendSmtpEmail sendSmtpEmail = new SendSmtpEmail();

        SendSmtpEmailSender sender = new SendSmtpEmailSender();
        sender.setEmail(senderEmail);
        sender.setName("HomeFix Security");
        sendSmtpEmail.setSender(sender);

        List<SendSmtpEmailTo> toList = new ArrayList<>();
        SendSmtpEmailTo to = new SendSmtpEmailTo();
        to.setEmail(toEmail);
        toList.add(to);
        sendSmtpEmail.setTo(toList);

        sendSmtpEmail.setSubject("Verify your HomeFix Account");
        String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>"
                + "<h2>Welcome to HomeFix!</h2>"
                + "<p>Please use the following One-Time Password (OTP) to verify your email address and complete your registration:</p>"
                + "<h1 style='color: #4f46e5; font-size: 32px; letter-spacing: 5px;'>" + otp + "</h1>"
                + "<p>This code is valid for <b>5 minutes</b>.</p>"
                + "<p>If you did not request this code, please ignore this email.</p>"
                + "</div>";

        sendSmtpEmail.setHtmlContent(htmlContent);

        try {
            getApiInstance().sendTransacEmail(sendSmtpEmail);
            logger.info("Registration OTP sent successfully to {}", toEmail);
        } catch (ApiException e) {
            logger.error("Failed to send Registration OTP: {}", e.getMessage());
            throw new RuntimeException("Email Service Error: " + e.getMessage());
        }
    }

    public void sendOtpEmail(String toEmail, String otp) {
        SendSmtpEmail sendSmtpEmail = new SendSmtpEmail();

        // 1. Set Sender
        SendSmtpEmailSender sender = new SendSmtpEmailSender();
        sender.setEmail(senderEmail);
        sender.setName("HomeFix Service Team");
        sendSmtpEmail.setSender(sender);

        // 2. Set Recipient
        List<SendSmtpEmailTo> toList = new ArrayList<>();
        SendSmtpEmailTo to = new SendSmtpEmailTo();
        to.setEmail(toEmail);
        toList.add(to);
        sendSmtpEmail.setTo(toList);

        // 3. Set Content
        sendSmtpEmail.setSubject("Service Completion Verification Code");
        String htmlContent = "<h3>Service Verification</h3>"
                + "<p>Hello,</p>"
                + "<p>Your worker has requested to mark the service as <b>COMPLETED</b>.</p>"
                + "<p>Please share the following One-Time Password (OTP) with the worker to verify and finalize the job:</p>"
                + "<h2 style='color: #4f46e5; letter-spacing: 2px;'>" + otp + "</h2>"
                + "<p>If the work is not yet finished to your satisfaction, please <b>do not</b> share this code.</p>"
                + "<br>"
                + "<p>Best Regards,<br>HomeFix Service Team</p>";

        sendSmtpEmail.setHtmlContent(htmlContent);

        // 4. Send
        try {
            getApiInstance().sendTransacEmail(sendSmtpEmail);
            logger.info("OTP Email sent successfully to {}", toEmail);
        } catch (ApiException e) {
            logger.error("Failed to send OTP email: {}", e.getMessage());
            throw new RuntimeException("Email Service Error: " + e.getMessage());
        }
    }

    public void sendResolutionEmail(String toEmail, String username, String title, String category, String workerPhone, String workerEmail) {
        SendSmtpEmail sendSmtpEmail = new SendSmtpEmail();

        SendSmtpEmailSender sender = new SendSmtpEmailSender();
        sender.setEmail(senderEmail);
        sender.setName("HomeFix Service Team");
        sendSmtpEmail.setSender(sender);

        List<SendSmtpEmailTo> toList = new ArrayList<>();
        SendSmtpEmailTo to = new SendSmtpEmailTo();
        to.setEmail(toEmail);
        to.setName(username);
        toList.add(to);
        sendSmtpEmail.setTo(toList);

        sendSmtpEmail.setSubject("Service Completed: " + title);

        String htmlContent = "<h3>Hello " + username + ",</h3>"
                + "<p>Your service request <b>" + title + "</b> (" + category + ") has been marked as <b>COMPLETED</b> by the worker.</p>"
                + "<p>If you experience any issues, please contact the worker using the details below.</p>"
                + "<p>Contact number : <b>" + (workerPhone != null ? workerPhone : "N/A") + "</b></p>"
                + "<p>E-mail : <b>" + (workerEmail != null ? workerEmail : "N/A") + "</b></p>"
                + "<br/><p>Thank you,<br/>HomeFix Service Team</p>";

        sendSmtpEmail.setHtmlContent(htmlContent);

        try {
            getApiInstance().sendTransacEmail(sendSmtpEmail);
            logger.info("Resolution Email sent to {}", toEmail);
        } catch (ApiException e) {
            logger.error("Failed to send resolution email", e);
        }
    }
}