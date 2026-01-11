package com.fullstack.booking_service.controller.impl;

import com.fullstack.booking_service.controller.IBookingController;
import com.fullstack.booking_service.model.CommonResponse;
import com.fullstack.booking_service.model.ResponseStatus;
import com.fullstack.booking_service.request.CreateBookingRequest;
import com.fullstack.booking_service.request.UpdateBookingRequest;
import com.fullstack.booking_service.service.IBookingService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("booking")
@RestController
public class BookingController implements IBookingController {

    @Autowired
    private IBookingService bookingService;

    @Override
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<CommonResponse> createBooking(HttpServletRequest request,
                                                        @ModelAttribute CreateBookingRequest bookingRequest) {
        try {
            CommonResponse response = bookingService.createBooking(request, bookingRequest);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Create Booking");
        }
    }

    @Override
    @PreAuthorize("hasAnyRole('CUSTOMER','WORKER','ADMIN')")
    public ResponseEntity<CommonResponse> getBookingsForWorker(String category, String taluka) {
        try {
            CommonResponse response = bookingService.getBookingsForWorker(category, taluka);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Get Bookings For Worker");
        }
    }

    @Override
    @PreAuthorize("hasAnyRole('WORKER','ADMIN')")
    public ResponseEntity<CommonResponse> getAllBookings() {
        try {
            CommonResponse response = bookingService.getAllBookings();
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Get All Bookings");
        }
    }

    @Override
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<CommonResponse> getBookingsByCategory(String category) {
        try {
            CommonResponse response = bookingService.getBookingsByCategory(category);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Get By Category");
        }
    }

    @Override
    @PreAuthorize("hasAnyRole('CUSTOMER','WORKER','ADMIN')")
    public ResponseEntity<CommonResponse> getBookingById(String id) {
        try {
            CommonResponse response = bookingService.getBookingById(id);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Get By Id");
        }
    }

    @Override
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<CommonResponse> getBookingsByUserId(String userId) {
        try {
            CommonResponse response = bookingService.getBookingsByUserId(userId);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Get By User Id");
        }
    }

    @Override
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<CommonResponse> updateBooking(String id, UpdateBookingRequest request) {
        try {
            CommonResponse response = bookingService.updateBooking(id, request);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Update Booking");
        }
    }

    @Override
    @PreAuthorize("hasAnyRole('WORKER','ADMIN')")
    public ResponseEntity<CommonResponse> updateBookingStatus(String id, String status, String reason) {
        try {
            CommonResponse response = bookingService.updateBookingStatus(id, status, reason);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Update Status");
        }
    }

    @Override
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<CommonResponse> deleteBooking(String id) {
        try {
            CommonResponse response = bookingService.deleteBooking(id);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            return exceptionHandler(e, "Delete Booking");
        }
    }

    public ResponseEntity<CommonResponse> exceptionHandler(Exception ex, String contextMessage) {
        CommonResponse response = new CommonResponse();
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.setResponseStatus(ResponseStatus.FAILED);
        response.setMessage("Internal Server Error: " + contextMessage);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}