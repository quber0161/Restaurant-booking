import bookingModel from '../models/bookingModel.js';
import sendEmail from "../utils/sendEmail.js";

// Utility: Generate 1hr time slots from 1pm to 11pm
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 13; hour < 23; hour++) {
    const from = `${hour}:00`;
    const to = `${hour + 1}:00`;
    slots.push(`${from} - ${to}`);
  }
  return slots;
};

// Controller: Get available time slots for a given date
const getAvailableSlots = async (req, res) => {
  const { date, timeSlot } = req.query;

  if (!date || !timeSlot) {
    return res.status(400).json({ error: "Missing date or timeSlot" });
  }

  try {
    const bookings = await bookingModel.find({
      date,
      timeSlot,
      status: { $in: ['pending', 'approved'] }
    });

    const totalGuestsBooked = bookings.reduce((sum, b) => sum + b.guestCount, 0);
    const MAX_GUESTS = 20;
    const availableGuests = Math.max(0, MAX_GUESTS - totalGuestsBooked);

    res.json({ availableGuests });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ error: "Server error" });
  }
};


const createBooking = async (req, res) => {

    const {
        firstName,
        lastName,
        email,
        phone,
        comment,
        date,
        timeSlot,
        guestCount,
      } = req.body;
    
      if (!firstName || !lastName || !email || !phone || !date || !timeSlot || !guestCount) {
        return res.status(400).json({ error: "Missing required booking fields." });
      }
    
      try {
        // Calculate already booked guests for the selected date/time
        const existingBookings = await bookingModel.find({
          date,
          timeSlot,
          status: { $in: ['pending', 'approved'] },
        });
    
        const totalBooked = existingBookings.reduce((sum, b) => sum + b.guestCount, 0);
        const MAX_GUESTS = 20;
    
        if (totalBooked + guestCount > MAX_GUESTS) {
          return res.status(400).json({ error: "Not enough availability in this time slot." });
        }
    
        // Save booking
        const newBooking = new bookingModel({
          firstName,
          lastName,
          email,
          phone,
          comment,
          date,
          timeSlot,
          guestCount,
          status: 'pending'
        });
    
        await newBooking.save();
    
        res.status(201).json({ message: "Booking request submitted successfully." });
      } catch (error) {
        console.error("Error submitting booking:", error);
        res.status(500).json({ error: "Server error." });
      }

}



const getAllBookings = async (req, res) => {
  try {
    const { date, status } = req.query;

    const filter = {};
    if (date) filter.date = date;
    if (status && status !== "all") filter.status = status;

    const bookings = await bookingModel.find(filter).sort({ date: 1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};



const getBookingsByDate = async (req, res) => {
    const { date } = req.params;
  
    try {
      const bookings = await bookingModel.find({ date });
      
      // Group guest counts by time slot
      const timeSlotGuestMap = {};
  
      bookings.forEach(booking => {
        const timeSlot = booking.timeSlot;
        const guests = booking.guestCount || 0;
  
        if (!timeSlotGuestMap[timeSlot]) {
          timeSlotGuestMap[timeSlot] = 0;
        }
        timeSlotGuestMap[timeSlot] += guests;
      });
  
      res.json({ success: true, timeSlotGuestMap });
    } catch (error) {
      console.error("❌ Error fetching bookings by date:", error);
      res.status(500).json({ success: false, message: "Error retrieving bookings" });
    }
  };
  


const updateBookingStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const booking = await bookingModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Send email to user
    const subject = `Your table booking has been ${status}`;
    const text = `Hello ${booking.firstName},\n\nYour Table booking at our Restaurant for ${booking.date} at ${booking.timeSlot} has been ${status}.`;
    const html = `<p>Hello ${booking.firstName},<br>Your Table booking at our Restaurant for <strong>${booking.date}</strong> at <strong>${booking.timeSlot}</strong> for ${booking.guestCount} guests has been <b>${status}</b>.</p>`;

    await sendEmail(booking.email, subject, text, html);

    res.json({ success: true, message: `Booking ${status}` });
  } catch (error) {
    console.error("❌ Error updating booking status:", error);
    res.status(500).json({ success: false, message: "Failed to update booking" });
  }
};


export { getAvailableSlots, createBooking, getAllBookings, updateBookingStatus, getBookingsByDate}