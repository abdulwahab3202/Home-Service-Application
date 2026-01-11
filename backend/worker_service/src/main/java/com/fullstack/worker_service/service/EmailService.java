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
        SendSmtpEmailSender sender = new SendSmtpEmailSender();
        sender.setEmail(senderEmail);
        sender.setName("HomeFix Service Team");
        sendSmtpEmail.setSender(sender);

        List<SendSmtpEmailTo> toList = new ArrayList<>();
        SendSmtpEmailTo to = new SendSmtpEmailTo();
        to.setEmail(toEmail);
        toList.add(to);
        sendSmtpEmail.setTo(toList);

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

        try {
            getApiInstance().sendTransacEmail(sendSmtpEmail);
            logger.info("OTP Email sent successfully to {}", toEmail);
        } catch (ApiException e) {
            logger.error("Failed to send OTP email: {}", e.getMessage());
            throw new RuntimeException("Email Service Error: " + e.getMessage());
        }
    }

    public void sendAssignmentEmail(String toEmail, String username, String title, String category, String workerName, String workerPhone, String workerEmail) {
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

        sendSmtpEmail.setSubject("Service Assigned: " + title);

        String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>"
                + "<h3>Hello " + username + ",</h3>"
                + "<p>Your service request <b>" + title + "</b> (" + category + ") has been <b>ASSIGNED</b> by a worker.</p>"
                + "<div style='background-color: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;'>"
                + "<h4>Worker Contact Details</h4>"
                + "<p><b>Name:</b> " + (workerName != null ? workerName : "HomeFix Worker") + "</p>"
                + "<p><b>Phone:</b> " + (workerPhone != null ? workerPhone : "N/A") + "</p>"
                + "<p><b>Email:</b> " + (workerEmail != null ? workerEmail : "N/A") + "</p>"
                + "</div>"
                + "<p>The worker will arrive shortly. If they do not contact you, please reach out using the details above.</p>"
                + "<br/><p>Thank you,<br/>HomeFix Service Team</p>"
                + "</div>";

        sendSmtpEmail.setHtmlContent(htmlContent);

        try {
            getApiInstance().sendTransacEmail(sendSmtpEmail);
            logger.info("Assignment Email sent to {}", toEmail);
        } catch (ApiException e) {
            logger.error("Failed to send assignment email", e);
        }
    }

    public void sendRevocationEmail(String toEmail, String username, String title, String category) {
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

        sendSmtpEmail.setSubject("Update on Service Request: " + title);

        String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>"
                + "<h3>Hello " + username + ",</h3>"
                + "<p>We wanted to inform you that the worker previously assigned to your request <b>" + title + "</b> (" + category + ") is no longer available to complete the task.</p>"
                + "<p>Don't worry! Your request has been automatically placed back into the <b>OPEN</b> pool.</p>"
                + "<p>It is now visible to other qualified professionals on our platform who can accept and fulfill your request shortly.</p>"
                + "<p>We apologize for any inconvenience this delay may cause and appreciate your patience.</p>"
                + "<br/><p>Best Regards,<br/>HomeFix Service Team</p>"
                + "</div>";

        sendSmtpEmail.setHtmlContent(htmlContent);

        try {
            getApiInstance().sendTransacEmail(sendSmtpEmail);
            logger.info("Revocation Email sent to {}", toEmail);
        } catch (ApiException e) {
            logger.error("Failed to send revocation email", e);
        }
    }
}