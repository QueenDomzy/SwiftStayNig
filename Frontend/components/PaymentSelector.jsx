// components/PaymentSelector.jsx
import React from "react";

/**
 * Props:
 * - amount (number)
 * - onPay({ method: 'PAYSTACK'|'FLUTTERWAVE' })
 */
export default function PaymentSelector({ amount, onPay }) {
  return (
    <div className="payment-selector p-3 border rounded">
      <div className="mb-2">Total: ₦{amount}</div>
      <div className="flex gap-2">
        <button className="btn" onClick={() => onPay({ method: "PAYSTACK" })}>Pay with Paystack</button>
        <button className="btn" onClick={() => onPay({ method: "FLUTTERWAVE" })}>Pay with Flutterwave</button>
      </div>
    </div>
  );
}
