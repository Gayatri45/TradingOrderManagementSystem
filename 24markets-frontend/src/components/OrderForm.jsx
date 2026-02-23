import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { orderAPI } from '../services/api';
import '../styles/OrderForm.css';

export const OrderForm = ({ marketId, onOrderCreated }) => {
  const { user, addOrder, setError } = useAppContext();
  const [formData, setFormData] = useState({
    quantity: '',
    pricePerUnit: '',
    orderType: 'BUY',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Please login to place an order');
      return;
    }

    try {
      const orderData = {
        user: { id: user.id },
        market: { id: marketId },
        quantity: parseFloat(formData.quantity),
        pricePerUnit: parseFloat(formData.pricePerUnit),
        orderType: formData.orderType,
      };

      const response = await orderAPI.createOrder(orderData);
      addOrder(response.data);
      setFormData({ quantity: '', pricePerUnit: '', orderType: 'BUY' });

      if (onOrderCreated) {
        onOrderCreated();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <h3>Place Order</h3>

      <div className="form-group">
        <label>Order Type</label>
        <select
          name="orderType"
          value={formData.orderType}
          onChange={handleChange}
        >
          <option value="BUY">Buy</option>
          <option value="SELL">Sell</option>
        </select>
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Enter quantity"
          step="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label>Price per Unit</label>
        <input
          type="number"
          name="pricePerUnit"
          value={formData.pricePerUnit}
          onChange={handleChange}
          placeholder="Enter price"
          step="0.01"
          required
        />
      </div>

      <button type="submit" className="btn-submit">
        Place Order
      </button>
    </form>
  );
};