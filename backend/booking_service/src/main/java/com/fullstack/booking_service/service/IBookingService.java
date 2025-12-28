package com.fullstack.booking_service.service;

import com.fullstack.booking_service.model.CommonResponse;
import com.fullstack.booking_service.request.CreateBookingRequest;
import com.fullstack.booking_service.request.UpdateBookingRequest;
import jakarta.servlet.http.HttpServletRequest;

public interface IBookingService {

    CommonResponse createBooking(HttpServletRequest request, CreateBookingRequest bookingRequest);

    CommonResponse getAllBookings();

    CommonResponse getBookingsByCategory(String serviceCategory);

    CommonResponse getBookingById(String bookingId);

    CommonResponse getBookingsByUserId(String userId);

    CommonResponse updateBooking(String bookingId, UpdateBookingRequest bookingRequest);

    CommonResponse updateBookingStatus(String bookingId, String status, String reason);

    CommonResponse deleteBooking(String bookingId);
}