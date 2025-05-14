// backend/payment/PaymentGatewayInterface.js

class PaymentGatewayInterface {
  processPayment(amount, cardDetails) {
    throw new Error('processPayment method must be implemented by concrete gateways.');
  }

  // Add other common payment gateway methods as needed
  // مثلاً: refundPayment(transactionId, amount)
  // مثلاً: checkPaymentStatus(transactionId)
}
//ntc
module.exports = PaymentGatewayInterface;