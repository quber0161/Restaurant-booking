/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./TableBooking.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const TableBooking = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 13; // 13 = 1PM
    const start = `${hour}:00`;
    const end = `${hour + 1}:00`;
    return `${start} - ${end}`;
  });

  const [selectedGuestCount, setSelectedGuestCount] = useState(0);
  const [availableGuests, setAvailableGuests] = useState(); // mocked availability
  const [slotAvailability, setSlotAvailability] = useState({});



  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    comment: "",
  });



  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };


  const formatLocalDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    const { firstName, lastName, email, phone, comment } = formData;
  
  
    const bookingData = {
      firstName,
      lastName,
      email,
      phone,
      comment,
      date: formatLocalDate(selectedDate), // ✅ send as string
      timeSlot: selectedTimeSlot,
      guestCount: selectedGuestCount,
    };
  
    try {
      const response = await fetch('https://restaurant-booking-35qh.onrender.com/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
  
      const data = await response.json();
  
      if (response.ok) {

        setStep(5)
      } else {
        alert(data.error || 'Failed to submit booking.');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Something went wrong. Please try again.');
    }
  };
  
  

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDate || !selectedTimeSlot) return;
  
      try {
        const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
        const response = await fetch(
          `https://restaurant-booking-35qh.onrender.com/api/bookings/availability?date=${formattedDate}&timeSlot=${selectedTimeSlot}`
        );
        const data = await response.json();
        setAvailableGuests(data.availableGuests);


      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };
  
    fetchAvailability();
  }, [selectedDate, selectedTimeSlot]);
  



  useEffect(() => {
    const fetchSlotAvailability = async () => {
        if (!selectedDate) return;

        try {
        const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
        const res = await fetch(`https://restaurant-booking-35qh.onrender.com/api/bookings/by-date/${formattedDate}`);
        const data = await res.json();
        if (data.success) {
            setSlotAvailability(data.timeSlotGuestMap);
        }
        } catch (err) {
        console.error("Error fetching slot availability:", err);
        }
    };

    fetchSlotAvailability();
    }, [selectedDate]);

  
  
  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])


  return (
    <div className="booking-container">
      <h2>Book a Table</h2>
      <div className="step-indicator">
        <div className={`step ${step >= 1 ? "active" : ""}`}>Date</div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>Time</div>
        <div className={`step ${step >= 3 ? "active" : ""}`}>Guests</div>
        <div className={`step ${step === 4 || step=== 5 ? "active" : ""}`}>Confirm</div>
      </div>

      {step === 1 && (
        <div className="step-content">
          <label htmlFor="booking-date">Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            placeholderText="Select a date"
            className="custom-datepicker"
            calendarClassName="custom-calendar"
            dateFormat="yyyy-MM-dd"
            />
          <button onClick={handleNext} disabled={!selectedDate}>
            Next
          </button>
        </div>
      )}

        {step === 2 && (
        <div className="step-content">
            <label>Select a Time Slot:</label>
            <div className="timeslot-container">
            {timeSlots.map((slot, index) => {
                const booked = slotAvailability[slot] || 0;
                const isFull = booked >= 20;

                return (
                <button
                    key={index}
                    className={`timeslot-button ${selectedTimeSlot === slot ? "selected" : ""}`}
                    onClick={() => !isFull && setSelectedTimeSlot(slot)}
                    disabled={isFull}
                >
                    {slot}
                    {isFull && " (Full)"}
                </button>
                );
            })}
            </div>
            <div className="button-group">
            <button onClick={handlePrev}>Back</button>
            <button onClick={handleNext} disabled={!selectedTimeSlot}>
                Next
            </button>
            </div>
        </div>
        )}



      {step === 3 && (
        <div className="step-content">
          <label>Select Number of Guests:</label>
          <div className="guest-buttons">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((count) => (
              <button
                key={count}
                className={`guest-button ${
                  selectedGuestCount === count ? "selected" : ""
                }`}
                disabled={count > availableGuests}
                onClick={() => {
                  if (count <= availableGuests) {
                    setSelectedGuestCount(count);
                  }
                }}
              >
                {count}
              </button>
            ))}
          </div>
          <div className="button-group">
            <button onClick={handlePrev}>Back</button>
            <button onClick={handleNext} disabled={!selectedGuestCount}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="step-content">
          <h3>Confirm Your Booking Request</h3>
          <p>
            <strong>Date:</strong>{" "}
            {selectedDate
              ? new Date(selectedDate).toDateString()
              : "Not selected"}
          </p>
          <p>
            <strong>Time Slot:</strong> {selectedTimeSlot}
          </p>
          <p>
            <strong>Guests:</strong> {selectedGuestCount}
          </p>

          <div className="form-grid">
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <textarea
              placeholder="Comments (optional)"
              rows="3"
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
            />
          </div>

          <div className="button-group">
            <button onClick={handlePrev}>Back</button>
            <button
              onClick={() => {
                handleSubmit();
              }}
              disabled={
                !formData.firstName || !formData.lastName || !formData.email
              }
            >
              Request Booking
            </button>
          </div>
        </div>
      )}

        {step === 5 && (
        <div className="step-content confirmation-screen">
            <h3>🎉 Booking Pending for Approval!</h3>
            <p>Thank you, {formData.firstName}! We've received request.                
                Your booking will be confrm through the email.
            </p>
            <div className="confirmation-details">
            <p><strong>Date:</strong> {new Date(selectedDate).toDateString()}</p>
            <p><strong>Time Slot:</strong> {selectedTimeSlot}</p>
            <p><strong>Guests:</strong> {selectedGuestCount}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            {formData.phone && <p><strong>Phone:</strong> {formData.phone}</p>}
            {formData.comment && <p><strong>Comment:</strong> {formData.comment}</p>}
            </div>
            <div className="button-group">
            <button onClick={() => window.location.reload()}>Make Another Booking</button>
            <button onClick={() => window.location.href = "/"}>Go to Home</button>
            </div>
        </div>
        )}

    </div>
  );
};

export default TableBooking;
