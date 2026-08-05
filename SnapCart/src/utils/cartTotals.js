export const HANDLING_CHARGE = 5;

export const getItemPrice = (price) => {
  const parsedPrice = Number(String(price).replace(/[^\d.]/g, ""));
  return Number.isFinite(parsedPrice) ? parsedPrice : 0;
};

export const getCartTotal = (items = []) =>
  items.reduce(
    (total, item) => total + getItemPrice(item.price) * (Number(item.quantity) || 0),
    0,
  );

export const getCartCount = (items = []) =>
  items.reduce((total, item) => total + (Number(item.quantity) || 0), 0);

export const getDeliveryCharge = (subtotal) =>
  subtotal > 0 && subtotal < 99 ? 30 : 0;

export const getGrandTotal = (subtotal) =>
  subtotal + getDeliveryCharge(subtotal) + (subtotal > 0 ? HANDLING_CHARGE : 0);

export const formatCurrency = (amount = 0) =>
  `\u20B9${Number(amount || 0).toFixed(2)}`;
