package com.fullstack.booking_service.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.fullstack.booking_service.client.WorkerClient;
import com.fullstack.booking_service.entity.ServiceRequest;
import com.fullstack.booking_service.model.CommonResponse;
import com.fullstack.booking_service.model.ResponseStatus;
import com.fullstack.booking_service.repository.BookingRepository;
import com.fullstack.booking_service.request.CreateBookingRequest;
import com.fullstack.booking_service.request.JobNotificationRequest;
import com.fullstack.booking_service.request.UpdateBookingRequest;
import com.fullstack.booking_service.response.BookingResponse;
import com.fullstack.booking_service.service.IBookingService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class BookingServiceImpl implements IBookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private WorkerClient workerClient;

    @Override
    public CommonResponse createBooking(HttpServletRequest request, CreateBookingRequest bookingRequest) {
        CommonResponse response = new CommonResponse();

        if (bookingRequest.getTitle() == null || bookingRequest.getTitle().isEmpty()) {
            return buildErrorResponse("Title is required", HttpStatus.BAD_REQUEST);
        }
        if (bookingRequest.getServiceCategory() == null || bookingRequest.getServiceCategory().isEmpty()) {
            return buildErrorResponse("Category is required", HttpStatus.BAD_REQUEST);
        }

        String imageUrl = null;
        if (bookingRequest.getImage() != null && !bookingRequest.getImage().isEmpty()) {
            try {
                imageUrl = uploadImageToCloudinary(bookingRequest.getImage());
            } catch (IOException e) {
                return buildErrorResponse("Image upload failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        Claims claims = (Claims) request.getAttribute("userClaims");

        ServiceRequest newRequest = new ServiceRequest();
        newRequest.setUserId(claims.get("userId", String.class));
        newRequest.setTitle(bookingRequest.getTitle());
        newRequest.setDescription(bookingRequest.getDescription());
        newRequest.setServiceCategory(bookingRequest.getServiceCategory());
        newRequest.setDistrict(bookingRequest.getDistrict());
        newRequest.setTaluka(bookingRequest.getTaluka());
        newRequest.setAddress(bookingRequest.getAddress());
        newRequest.setImageUrl(imageUrl);
        newRequest.setStatus("OPEN");
        newRequest.setCreatedOn(new Date());

        bookingRepository.save(newRequest);

        try {
            JobNotificationRequest notificationReq = new JobNotificationRequest(
                    newRequest.getTitle(),
                    newRequest.getServiceCategory(),
                    newRequest.getDistrict(),
                    newRequest.getTaluka()
            );
            workerClient.notifyWorkers(notificationReq);

        } catch (Exception e) {
            System.err.println("Failed to trigger worker email notifications: " + e.getMessage());
        }

        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Booking Created Successfully");
        response.setData(toDTO(newRequest));
        response.setStatus(HttpStatus.CREATED);
        response.setStatusCode(HttpStatus.CREATED.value());
        return response;
    }

    private String uploadImageToCloudinary(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        return uploadResult.get("secure_url").toString();
    }

    @Override
    public CommonResponse getAllBookings() {
        CommonResponse response = new CommonResponse();
        List<ServiceRequest> list = bookingRepository.getAllBookings();
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Retrieved Successfully");
        response.setData(list.stream().map(this::toDTO).toList());
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(HttpStatus.OK.value());
        return response;
    }

    @Override
    public CommonResponse getBookingsForWorker(String category, String taluka) {
        CommonResponse response = new CommonResponse();
        List<ServiceRequest> list = bookingRepository.findAvailableJobs(category, taluka);
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Retrieved Successfully");
        response.setData(list.stream().map(this::toDTO).toList());
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(HttpStatus.OK.value());
        return response;
    }

    @Override
    public CommonResponse getBookingsByCategory(String serviceCategory) {
        CommonResponse response = new CommonResponse();
        List<ServiceRequest> list = bookingRepository.findByCategory(serviceCategory);
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Retrieved Successfully");
        response.setData(list.stream().map(this::toDTO).toList());
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(HttpStatus.OK.value());
        return response;
    }

    @Override
    public CommonResponse getBookingById(String id) {
        CommonResponse response = new CommonResponse();
        ServiceRequest request = bookingRepository.findById(id);
        if (request == null) return buildErrorResponse("Booking not found", HttpStatus.NOT_FOUND);
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Retrieved Successfully");
        response.setData(toDTO(request));
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(HttpStatus.OK.value());
        return response;
    }

    @Override
    public CommonResponse getBookingsByUserId(String userId) {
        CommonResponse response = new CommonResponse();
        List<ServiceRequest> list = bookingRepository.findByUserId(userId);
        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Retrieved Successfully");
        response.setData(list.stream().map(this::toDTO).toList());
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(HttpStatus.OK.value());
        return response;
    }

    @Override
    public CommonResponse updateBooking(String id, UpdateBookingRequest req) {
        CommonResponse response = new CommonResponse();
        ServiceRequest request = bookingRepository.findById(id);
        if (request == null) return buildErrorResponse("Booking not found", HttpStatus.NOT_FOUND);
        if(request.getStatus().equalsIgnoreCase("ASSIGNED") ||
                request.getStatus().equalsIgnoreCase("COMPLETED")){
            return buildErrorResponse("Booking is already ASSIGNED or COMPLETED, Cannot update booking", HttpStatus.NOT_ACCEPTABLE);
        }

        if (req.getTitle() != null && !req.getTitle().isEmpty()) request.setTitle(req.getTitle());
        if (req.getDescription() != null) request.setDescription(req.getDescription());
        if (req.getAddress() != null) request.setAddress(req.getAddress());

        bookingRepository.save(request);

        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Updated Successfully");
        response.setData(toDTO(request));
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(HttpStatus.OK.value());
        return response;
    }

    @Override
    public CommonResponse updateBookingStatus(String id, String status, String reason) {
        CommonResponse response = new CommonResponse();
        ServiceRequest request = bookingRepository.findById(id);
        if (request == null) return buildErrorResponse("Booking not found", HttpStatus.NOT_FOUND);

        request.setStatus(status);

        if ("REJECTED".equalsIgnoreCase(status) || "CANCELLED".equalsIgnoreCase(status)) {
            request.setCancellationReason(reason);
        }

        bookingRepository.save(request);

        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Status Updated Successfully");
        response.setData(toDTO(request));
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(HttpStatus.OK.value());
        return response;
    }

    @Override
    public CommonResponse deleteBooking(String id) {
        CommonResponse response = new CommonResponse();
        if (bookingRepository.findById(id) == null) return buildErrorResponse("Booking not found", HttpStatus.NOT_FOUND);

        bookingRepository.deleteById(id);

        response.setResponseStatus(ResponseStatus.SUCCESS);
        response.setMessage("Deleted Successfully");
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(HttpStatus.OK.value());
        return response;
    }

    private CommonResponse buildErrorResponse(String msg, HttpStatus status) {
        CommonResponse res = new CommonResponse();
        res.setResponseStatus(ResponseStatus.FAILED);
        res.setMessage(msg);
        res.setStatus(status);
        res.setStatusCode(status.value());
        return res;
    }

    private BookingResponse toDTO(ServiceRequest req) {
        BookingResponse res = new BookingResponse();
        res.setId(req.getId());
        res.setUserId(req.getUserId());
        res.setImageUrl(req.getImageUrl());
        res.setTitle(req.getTitle());
        res.setDescription(req.getDescription());
        res.setServiceCategory(req.getServiceCategory());
        res.setAddress(req.getAddress());
        res.setStatus(req.getStatus());
        res.setCancellationReason(req.getCancellationReason());
        res.setCreatedOn(req.getCreatedOn());
        return res;
    }
}