import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MenuItem',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true
        },
        specialRequests: String
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    orderType: {
      type: String,
      enum: ['dine-in', 'takeout', 'delivery'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending'
    },
    deliveryAddress: String,
    notes: String,
    estimatedTime: Number
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Order', orderSchema);
