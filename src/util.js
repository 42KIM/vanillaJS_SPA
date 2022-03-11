const formatPrice = (number) => {
  let price = String(number);
  let priceLength = price.length;
  let formattedPrice = '';
  for (let i = priceLength - 1; i >= 0; i--) {
    formattedPrice = price[i] + formattedPrice;
    if (i && (priceLength - i) % 3 === 0) {
      formattedPrice = ',' + formattedPrice;
    }
  }
  return formattedPrice;
};

export { formatPrice };
