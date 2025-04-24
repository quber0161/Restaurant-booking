import express from 'express';
import {
    createBooking,
    getAvailableSlots,
    getAllBookings,
    updateBookingStatus,
    getBookingsByDate,
} from '../controllers/bookingController.js';

const bookingRouter = express.Router();

// GET available time slots for a given date
bookingRouter.get('/availability', getAvailableSlots);
bookingRouter.get('/by-date/:date', getBookingsByDate)

// POST a new booking
bookingRouter.post('/', createBooking);

// ADMIN: GET all bookings
bookingRouter.get('/all', getAllBookings);
bookingRouter.post('/update-status', updateBookingStatus);


export default bookingRouter;
