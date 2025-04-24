import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  date: { type: String, required: true }, // format: 'YYYY-MM-DD'
  timeSlot: { type: String, required: true }, // format: '13:00 - 14:00'
  guestCount: { type: Number, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  comment: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});


const bookingModel = mongoose.model.booking || mongoose.model("booking",bookingSchema);

export default bookingModel;