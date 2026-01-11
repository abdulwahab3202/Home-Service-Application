package com.fullstack.user_service.service.impl;

import com.fullstack.user_service.client.WorkerClient;
import com.fullstack.user_service.entity.Customer;
import com.fullstack.user_service.entity.EmailVerification;
import com.fullstack.user_service.entity.User;
import com.fullstack.user_service.model.CommonResponse;
import com.fullstack.user_service.model.ResponseStatus;
import com.fullstack.user_service.model.UserContactDTO;
import com.fullstack.user_service.model.UserRole;
import com.fullstack.user_service.repository.CustomerRepository;
import com.fullstack.user_service.repository.EmailVerificationRepository;
import com.fullstack.user_service.repository.UserRepository;
import com.fullstack.user_service.request.UserRequest;
import com.fullstack.user_service.request.WorkerRequest;
import com.fullstack.user_service.response.CustomerResponse;
import com.fullstack.user_service.response.UserResponse;
import com.fullstack.user_service.service.IUserService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private EmailVerificationRepository emailVerificationRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private WorkerClient workerClient;

    @Value("${google.client.id}")
    private String googleClientId;
    private static final String ADMIN_EMAIL = "homefixservice507@gmail.com";


    @Override
    public CommonResponse sendVerificationOtp(String email) {
        if (userRepository.findByEmail(email) != null) {
            return buildError("Email is already registered. Please Login.", HttpStatus.BAD_REQUEST);
        }

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        EmailVerification verification = new EmailVerification();
        verification.setEmail(email);
        verification.setOtp(otp);
        verification.setExpiryDate(LocalDateTime.now().plusMinutes(5));

        emailVerificationRepository.save(verification);

        try {
            workerClient.sendRegistrationOtp(email, otp);
        } catch (Exception e) {
            return buildError("Failed to send email: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        CommonResponse response = new CommonResponse();
        response.setMessage("OTP Sent Successfully");
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(200);
        return response;
    }

    @Override
    public CommonResponse verifyOtp(String email, String otp) {
        EmailVerification verification = emailVerificationRepository.findById(email);

        if (verification == null) {
            return buildError("OTP expired or email not found. Please request a new code.", HttpStatus.BAD_REQUEST);
        }

        if (!verification.getOtp().equals(otp)) {
            return buildError("Invalid OTP.", HttpStatus.BAD_REQUEST);
        }

        CommonResponse response = new CommonResponse();
        response.setMessage("Email Verified Successfully");
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(200);
        return response;
    }

    @Override
    public CommonResponse register(UserRequest userRequest) {
        try {
            validateRegistrationRequest(userRequest);
        } catch (IllegalArgumentException e) {
            return buildError(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

        if ("LOCAL".equalsIgnoreCase(userRequest.getProvider()) || userRequest.getProvider() == null) {
            CommonResponse verifyCheck = verifyOtp(userRequest.getEmail(), userRequest.getOtp());
            if (verifyCheck.getStatusCode() != 200) {
                return verifyCheck;
            }
        }

        if (userRepository.findByEmail(userRequest.getEmail()) != null) {
            return buildError("Email already in use", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setName(userRequest.getName());
        user.setEmail(userRequest.getEmail());
        user.setRole(userRequest.getRole());
        user.setProvider(userRequest.getProvider() != null ? userRequest.getProvider() : "LOCAL");
        user.setCreatedOn(new Date());
        user.setUpdatedOn(new Date());

        if ("LOCAL".equalsIgnoreCase(user.getProvider())) {
            user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        }

        if (ADMIN_EMAIL.equalsIgnoreCase(userRequest.getEmail())) {
            user.setRole(UserRole.ADMIN);
        }

        User savedUser = userRepository.save(user);

        try {
            switch (savedUser.getRole()) {
                case CUSTOMER:
                    createCustomerProfile(savedUser, userRequest);
                    break;
                case WORKER:
                    createWorkerProfile(savedUser, userRequest);
                    break;
            }
        } catch (Exception e) {
            userRepository.deleteUserById(savedUser.getId());
            return buildError("Registration failed: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }

        emailVerificationRepository.deleteById(userRequest.getEmail());

        return generateLoginResponse(savedUser, "User Created Successfully", HttpStatus.CREATED);
    }

    @Override
    public CommonResponse login(UserRequest userRequest) {
        if (userRequest.getEmail() == null || userRequest.getPassword() == null) {
            return buildError("Email and Password required", HttpStatus.BAD_REQUEST);
        }

        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userRequest.getEmail(), userRequest.getPassword())
            );

            if (authentication.isAuthenticated()) {
                User fullUser = userRepository.findByEmail(userRequest.getEmail());
                return generateLoginResponse(fullUser, "Logged In Successfully", HttpStatus.ACCEPTED);
            } else {
                return buildError("Failed to Login", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            return buildError("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    @Override
    public CommonResponse handleGoogleLogin(String idTokenString) {
        CommonResponse response = new CommonResponse();
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) throw new RuntimeException("Invalid Google Token");

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            User existingUser = userRepository.findByEmail(email);

            if (existingUser != null) {
                if (ADMIN_EMAIL.equalsIgnoreCase(email) && !existingUser.getRole().equals(UserRole.ADMIN)) {
                    existingUser.setRole(UserRole.ADMIN);
                    userRepository.save(existingUser);
                }
                return generateLoginResponse(existingUser, "Login Successful", HttpStatus.OK);
            } else {
                if (ADMIN_EMAIL.equalsIgnoreCase(email)) {
                    User newAdmin = new User();
                    newAdmin.setEmail(email);
                    newAdmin.setName(name);
                    newAdmin.setRole(UserRole.ADMIN);
                    newAdmin.setPassword(passwordEncoder.encode("GOOGLE_AUTH_ADMIN_SECURE"));
                    userRepository.save(newAdmin);
                    return generateLoginResponse(newAdmin, "Admin Account Created & Logged In", HttpStatus.OK);
                }

                Map<String, Object> tempProfile = new HashMap<>();
                tempProfile.put("email", email);
                tempProfile.put("name", name);
                tempProfile.put("provider", "GOOGLE");
                tempProfile.put("isNewUser", true);

                response.setResponseStatus(ResponseStatus.SUCCESS);
                response.setMessage("NEW_USER");
                response.setData(tempProfile);
                response.setStatus(HttpStatus.ACCEPTED);
                response.setStatusCode(202);
                return response;
            }
        } catch (Exception e) {
            return buildError("Google Auth Failed: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    @Override
    public CommonResponse getUserContactInfo(String userId){
        User user = userRepository.getUserById(userId);
        if(user != null) {
            UserContactDTO dto = new UserContactDTO(user.getName(), user.getEmail());
            return new CommonResponse(HttpStatus.OK, ResponseStatus.SUCCESS, "Success", dto, 200);
        }
        return new CommonResponse(HttpStatus.NOT_FOUND, ResponseStatus.FAILED, "User Not Found", null, 404);
    }

    @Override
    public CommonResponse updateUser(HttpServletRequest request, UserRequest userRequest) {
        Claims userClaims = (Claims) request.getAttribute("userClaims");
        if (userClaims == null) return buildError("Unauthorized", HttpStatus.UNAUTHORIZED);

        String userId = userClaims.get("userId", String.class);
        User user = userRepository.getUserById(userId);

        if (user == null) {
            return buildError("User not found", HttpStatus.NOT_FOUND);
        }

        if (userRequest.getName() != null && !userRequest.getName().isEmpty()) {
            user.setName(userRequest.getName());
        }
        user.setUpdatedOn(new Date());
        userRepository.save(user);

        try {
            switch (user.getRole()) {
                case CUSTOMER:
                    updateCustomerProfile(user.getId(), userRequest);
                    break;
                case WORKER:
                    updateWorkerProfile(user.getId(), userRequest);
                    break;
            }
        } catch (Exception e) {
            return buildError("Failed to update profile: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        CommonResponse fullProfileResponse = getUserById(userId);
        fullProfileResponse.setMessage("User Updated Successfully");
        return fullProfileResponse;
    }

    @Override
    public CommonResponse getAllUsers(){
        CommonResponse response = new CommonResponse();
        List<User> users = userRepository.getAllUsers();
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Users Retrieved Successfully");
        List<UserResponse> dtos = users.stream().map(this::toDTO).toList();
        response.setData(dtos);
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(200);
        return response;
    }

    @Override
    public CommonResponse getAllCustomers(){
        CommonResponse response = new CommonResponse();
        List<Customer> customers = customerRepository.getAllCustomers();
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Customers Retrieved Successfully");
        List<CustomerResponse> dtos = customers.stream().map(this::toCustomerDTO).toList();
        response.setData(dtos);
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(200);
        return response;
    }

    @Override
    public CommonResponse getUserById(String userId){
        CommonResponse response = new CommonResponse();
        User user = userRepository.getUserById(userId);
        if (user == null) return buildError("User not found", HttpStatus.NOT_FOUND);

        if(user.getRole().equals(UserRole.CUSTOMER)){
            Customer customer = customerRepository.findByUserId(userId);
            response.setData(toCustomerDTO(customer));
        } else if(user.getRole().equals(UserRole.WORKER)){
            CommonResponse wRes = workerClient.getWorkerById(userId);
            response.setData(wRes.getData());
        } else {
            response.setData(toDTO(user));
        }

        response.setMessage("User Retrieved");
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(200);
        return response;
    }

    @Override
    public CommonResponse deleteUser(String id) {
        User user = userRepository.getUserById(id);
        if (user == null) return buildError("User Not Found", HttpStatus.NOT_FOUND);

        if (user.getRole() == UserRole.ADMIN) return buildError("Cannot delete Admin", HttpStatus.FORBIDDEN);

        if (user.getRole() == UserRole.WORKER) workerClient.deleteWorkerProfile(id);

        if (user.getRole() == UserRole.CUSTOMER) customerRepository.deleteByUserId(id);

        userRepository.deleteUserById(id);
        return new CommonResponse(HttpStatus.OK, ResponseStatus.SUCCESS, "User Deleted Successfully", null, 200);
    }

    private void createCustomerProfile(User user, UserRequest request) {
        Customer customer = new Customer();
        customer.setUserId(user.getId());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setAddress(request.getAddress());
        customer.setPinCode(request.getPinCode());
        customer.setDistrict(request.getDistrict());
        customer.setTaluka(request.getTaluka());
        customerRepository.save(customer);
    }

    private void createWorkerProfile(User user, UserRequest request) {
        WorkerRequest workerRequest = new WorkerRequest();
        workerRequest.setUserId(user.getId());
        workerRequest.setName(user.getName());
        workerRequest.setEmail(user.getEmail());
        workerRequest.setPhoneNumber(request.getPhoneNumber());
        workerRequest.setDepartment(request.getDepartment());
        workerRequest.setDistrict(request.getDistrict());
        workerRequest.setTaluka(request.getTaluka());

        CommonResponse workerResponse = workerClient.createWorkerProfile(workerRequest);

        if (workerResponse == null ||
                workerResponse.getResponseStatus() == null ||
                !"SUCCESS".equalsIgnoreCase(workerResponse.getResponseStatus().toString())) {
            throw new RuntimeException("Failed to create worker profile in worker-service");
        }
    }

    private void updateCustomerProfile(String userId, UserRequest request) {
        Customer customer = customerRepository.findByUserId(userId);
        if (customer != null) {
            if (request.getPhoneNumber() != null) customer.setPhoneNumber(request.getPhoneNumber());
            if (request.getAddress() != null) customer.setAddress(request.getAddress());
            if (request.getPinCode() != 0) customer.setPinCode(request.getPinCode());
            customerRepository.save(customer);
        }
    }

    private void updateWorkerProfile(String userId, UserRequest request) {
        WorkerRequest workerRequest = new WorkerRequest();
        workerRequest.setName(request.getName());
        workerRequest.setPhoneNumber(request.getPhoneNumber());
        workerRequest.setDepartment(request.getDepartment());
        workerClient.updateWorkerProfile(userId, workerRequest);
    }

    private CommonResponse generateLoginResponse(User user, String msg, HttpStatus status) {
        String token = jwtService.generateToken(user);
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", toDTO(user));
        data.put("isNewUser", false);
        CommonResponse response = new CommonResponse();
        response.setMessage(msg);
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setData(data);
        response.setStatus(status);
        response.setStatusCode(status.value());
        return response;
    }

    private void validateRegistrationRequest(UserRequest request) {
        if (request.getName() == null || request.getName().isBlank())
            throw new IllegalArgumentException("Name is required");
        if (request.getEmail() == null || request.getEmail().isBlank())
            throw new IllegalArgumentException("Email is required");
        if (request.getRole() == null)
            throw new IllegalArgumentException("Role is required");

        if ((request.getProvider() == null || "LOCAL".equals(request.getProvider())) &&
                (request.getPassword() == null || request.getPassword().isBlank())) {
            throw new IllegalArgumentException("Password is required");
        }

        switch (request.getRole()) {
            case CUSTOMER:
                if (request.getAddress() == null) throw new IllegalArgumentException("Address is required");
                if (request.getPhoneNumber() == null) throw new IllegalArgumentException("Phone Number is required");
                if (request.getPinCode() == 0) throw new IllegalArgumentException("Pin Code is required");
                break;
            case WORKER:
                if (request.getPhoneNumber() == null) throw new IllegalArgumentException("Phone Number is required");
                if (request.getDepartment() == null) throw new IllegalArgumentException("Department is required");
                break;
        }
    }

    private CommonResponse buildError(String msg, HttpStatus status) {
        CommonResponse res = new CommonResponse();
        res.setResponseStatus(ResponseStatus.FAILED);
        res.setMessage(msg);
        res.setStatus(status);
        res.setStatusCode(status.value());
        return res;
    }

    private UserResponse toDTO(User user){
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setName(user.getName());
        userResponse.setEmail(user.getEmail());
        userResponse.setRole(user.getRole().name());
        userResponse.setCreatedOn(user.getCreatedOn());
        userResponse.setUpdateOn(user.getUpdatedOn());
        return userResponse;
    }

    private CustomerResponse toCustomerDTO(Customer customer){
        CustomerResponse res = new CustomerResponse();
        User user = userRepository.getUserById(customer.getUserId());
        res.setUserId(customer.getId());
        res.setName(user.getName());
        res.setEmail(user.getEmail());
        res.setRole(user.getRole().name());
        res.setPhoneNumber(customer.getPhoneNumber());
        res.setAddress(customer.getAddress());
        res.setPinCode(customer.getPinCode());
        res.setCreatedOn(user.getCreatedOn());
        res.setUpdateOn(user.getUpdatedOn());
        return res;
    }
}