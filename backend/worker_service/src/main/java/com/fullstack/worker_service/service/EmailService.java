package com.fullstack.worker_service.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.io.UnsupportedEncodingException;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private static final String senderEmail = "homefixservice507@gmail.com";

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(new InternetAddress(senderEmail, "HomeFix Service Team"));
            helper.setTo(toEmail);
            helper.setSubject("Service Completion Verification Code");

            // Email Body
            String content = "<h3>Service Verification</h3>"
                    + "<p>Hello,</p>"
                    + "<p>Your worker has requested to mark the service as <b>COMPLETED</b>.</p>"
                    + "<p>Please share the following One-Time Password (OTP) with the worker to verify and finalize the job:</p>"
                    + "<h2 style='color: #4f46e5; letter-spacing: 2px;'>" + otp + "</h2>"
                    + "<p>If the work is not yet finished to your satisfaction, please <b>do not</b> share this code.</p>"
                    + "<br>"
                    + "<p>Best Regards,<br>HomeFix Service Team</p>";

            helper.setText(content, true); // true = send as HTML

            mailSender.send(message);
            System.out.println("OTP Email sent successfully to " + toEmail);

        } catch (Exception e) {
            System.err.println("Error sending OTP email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void sendResolutionEmail(String toEmail, String username, String title, String category, String workerPhone, String workerEmail) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(new InternetAddress(senderEmail, "HomeFix Service Team"));
            helper.setTo(toEmail);
            helper.setSubject("Service Completed: " + title);

            String htmlContent = "<h3>Hello " + username + ",</h3>"
                    + "<p>Your service request <b>" + title + "</b> (" + category + ") has been marked as <b>COMPLETED</b> by the worker.</p>"
                    + "<p>If you experience any issues, please contact the worker using the details below.</p>"
                    + "<p>Contact number : <b>" + (workerPhone != null ? workerPhone : "N/A") + "</b></p>"
                    + "<p>E-mail : <b>" + (workerEmail != null ? workerEmail : "N/A") + "</b></p>"
                    + "<br/><p>Thank you,<br/>HomeFix Service Team</p>";

            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("Email sent successfully to " + toEmail);

        } catch (MessagingException | UnsupportedEncodingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}