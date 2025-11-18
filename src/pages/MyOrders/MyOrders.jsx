import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";
import { MdCancel } from "react-icons/md";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  // Fetch all user orders
  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Cancel order function
  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const response = await axios.post(
        url + "/api/order/cancel",
        { orderId },
        { headers: { token } }
      );
      if (response.data.success) {
        alert("Order cancelled successfully!");
        setData((prev) => prev.filter((o) => o._id !== orderId)); // Remove from UI
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Error cancelling order");
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  return (
    <div className="my-orders">
      <h2>Orders</h2>
      <div className="container">
        {data.length > 0 ? (
          data.map((order, index) => (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="parcel" />
              <p>
                {order.items.map((item, i) =>
                  i === order.items.length - 1
                    ? `${item.name} X ${item.quantity}`
                    : `${item.name} X ${item.quantity}, `
                )}
              </p>
              <p>${order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p>
                <span>&#x25cf;</span> <b>{order.status}</b>
              </p>

              <div className="order-actions">
                <button onClick={fetchOrders}>Track Order</button>
                <MdCancel
                  className="cancel-icon"
                  title="Cancel Order"
                  onClick={() => handleCancel(order._id)}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
