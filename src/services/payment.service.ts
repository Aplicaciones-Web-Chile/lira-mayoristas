import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Interfaces
interface TransactionResponse {
  token: string;
  url: string;
}

interface TransactionDetail {
  amount: number;
  status: string;
  buy_order: string;
  session_id: string;
  card_detail: {
    card_number: string;
  };
  accounting_date: string;
  transaction_date: string;
  authorization_code: string;
  payment_type_code: string;
  response_code: number;
  installments_amount?: number;
  installments_number?: number;
  vci?: string;
}

export const paymentService = {
  async createTransaction(buyOrder: string, amount: number, returnUrl: string): Promise<TransactionResponse> {
    try {
      const response = await axios.post(`${API_URL}/api/webpay/create`, {
        buy_order: buyOrder,
        amount: amount,
        return_url: returnUrl
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating Webpay transaction:', error);
      throw error;
    }
  },

  async confirmTransaction(token: string): Promise<TransactionDetail> {
    try {
      const response = await axios.post(`${API_URL}/api/webpay/confirm`, { token });
      return response.data;
    } catch (error) {
      console.error('Error confirming Webpay transaction:', error);
      throw error;
    }
  },

  generateBuyOrder(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `OC${timestamp}${random}`;
  },

  async processPayment(amount: number): Promise<TransactionResponse> {
    const buyOrder = this.generateBuyOrder();
    const returnUrl = `${window.location.origin}/checkout/confirm`;
    
    return await this.createTransaction(buyOrder, amount, returnUrl);
  }
};
