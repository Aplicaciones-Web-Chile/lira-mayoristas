import { ref } from 'vue';
import type { Cart, CartItem, CartSummary } from '@/types/cart.types';
import type { ProductWithCustomerPrice } from '@/types/product.types';

// Estado del carrito
const cart = ref<Cart>({
  items: [],
  subtotal: 0,
  total: 0,
  discount: 0
});

// Evento personalizado para cambios en el carrito
const cartChangeEvent = new Event('cartChange');

// Calcular totales del carrito
const calculateTotals = () => {
  const subtotal = cart.value.items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const totalWithDiscount = cart.value.items.reduce((total, item) => {
    return total + (item.product.customer_price * item.quantity);
  }, 0);

  cart.value.subtotal = subtotal;
  cart.value.total = totalWithDiscount;
  cart.value.discount = subtotal - totalWithDiscount;
};

// Notificar cambios en el carrito
const notifyCartChange = () => {
  window.dispatchEvent(cartChangeEvent);
};

// Servicio del carrito
export const cartService = {
  // Obtener el carrito completo
  getCart(): Cart {
    return cart.value;
  },

  // Obtener resumen del carrito
  getCartSummary(): CartSummary {
    const totalItems = cart.value.items.reduce((total, item) => total + item.quantity, 0);
    return {
      totalItems,
      subtotal: cart.value.subtotal,
      total: cart.value.total,
      discount: cart.value.discount
    };
  },

  // Añadir producto al carrito
  addToCart(product: ProductWithCustomerPrice, quantity: number = 1): void {
    const existingItem = cart.value.items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.value.items.push({
        product,
        quantity
      });
    }

    calculateTotals();
    this.saveCart();
    notifyCartChange();
  },

  // Actualizar cantidad de un item
  updateQuantity(productId: number, quantity: number): void {
    const item = cart.value.items.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      calculateTotals();
      this.saveCart();
      notifyCartChange();
    }
  },

  // Eliminar item del carrito
  removeItem(productId: number): void {
    cart.value.items = cart.value.items.filter(item => item.product.id !== productId);
    calculateTotals();
    this.saveCart();
    notifyCartChange();
  },

  // Limpiar carrito
  clearCart(): void {
    cart.value.items = [];
    calculateTotals();
    this.saveCart();
    notifyCartChange();
  },

  // Guardar carrito en localStorage
  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(cart.value));
  },

  // Cargar carrito desde localStorage
  loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        cart.value = parsedCart;
        calculateTotals();
        notifyCartChange();
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
        this.clearCart();
      }
    }
  },

  // Verificar si un producto está en el carrito
  isInCart(productId: number): boolean {
    return cart.value.items.some(item => item.product.id === productId);
  },

  // Obtener cantidad de un producto en el carrito
  getItemQuantity(productId: number): number {
    const item = cart.value.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }
};
