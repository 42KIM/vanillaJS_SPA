import { request } from '../api.js';
import { getItem, setItem } from '../storage.js';
import { formatPrice } from '../util.js';
import { pushState } from '../router.js';

function ProductDetailPage({ $target }) {
  const $ProductDetailPage = document.createElement('div');
  $ProductDetailPage.className = 'ProductDetailPage';

  this.state = {
    product: {},
    selectedOptions: [],
  };

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.getTotalPrice = () => {
    const { product, selectedOptions } = this.state;
    const { price: productPrice } = product;

    return selectedOptions.length
      ? selectedOptions.reduce(
          (acc, option) =>
            acc + (productPrice + option.price) * option.selectedQuantity,
          0
        )
      : 0;
  };

  this.fetchProductDetail = async () => {
    const productId = location.pathname.split('/')[3];
    const product = await request(`/products/${productId}`);

    this.setState({
      ...this.state,
      product,
    });
  };

  this.onSelectChange = (e) => {
    if (e.target.tagName === 'SELECT') {
      const { value } = e.target;
      const optionId = Number(value);

      if (this.state.selectedOptions.some((option) => option.id === optionId))
        return;

      const selectedOption = this.state.product.productOptions.find(
        (option) => option.id === Number(value)
      );

      this.setState({
        ...this.state,
        selectedOptions: [
          ...this.state.selectedOptions,
          { ...selectedOption, selectedQuantity: 1 },
        ],
      });
    }
  };

  this.onInputChange = (e) => {
    if (e.target.tagName !== 'INPUT' || e.target.type !== 'number') return;

    const { value } = e.target;
    const { id: changedOptionId } = e.target.dataset;

    this.setState({
      ...this.state,
      selectedOptions: this.state.selectedOptions.map((option) => {
        if (option.id === Number(changedOptionId)) {
          option.selectedQuantity = Number(value);
        }
        return option;
      }),
    });
  };

  this.onClickOrder = (e) => {
    if (e.target.className !== 'OrderButton') return;

    const currentCart = getItem('products_cart', []);
    const selectedProducts = this.state.selectedOptions.map((option) => {
      return {
        productId: this.state.product.id,
        optionId: option.id,
        quantity: option.selectedQuantity,
      };
    });

    setItem('products_cart', currentCart.concat(selectedProducts));
    pushState('/web/cart');
  };

  this.render = async () => {
    $target.appendChild($ProductDetailPage);

    const { id, name, price, imageUrl, productOptions } = this.state.product;

    $ProductDetailPage.innerHTML = `
    <h1>커피잔 상품 정보</h1>
    <div class="ProductDetail">
      <img src=${imageUrl}>
      <div class="ProductDetail__info">
        <h2>${name}</h2>
        <div class="ProductDetail__price">${formatPrice(price)}원~</div>
        <select>
          <option>선택하세요</option>
          ${productOptions
            .map(
              (option) => `
            <option value=${option.id} ${option.stock ? '' : 'disabled'}>${
                option.stock ? '' : '(품절)'
              } ${name} ${option.name} ${
                option.price ? `+${formatPrice(option.price)}원` : ''
              }</option>
          `
            )
            .join('')}
        </select>
        <div class="ProductDetail__selectedOptions">
          <h3>선택된 상품</h3>
          <ul>
            ${this.state.selectedOptions
              .map(
                (option) => `
              <li>
                ${option.name} ${
                  option.price ? `${formatPrice(price + option.price)}원` : ''
                }
                <div><input data-id=${option.id} type="number" value=${
                  option.selectedQuantity
                } min="0" max=${option.stock}>개</div>
              </li>
            `
              )
              .join('')}
          </ul>
          <div class="ProductDetail__totalPrice">${formatPrice(
            this.getTotalPrice()
          )}원</div>
          <button class="OrderButton">주문하기</button>
        </div>
      </div>
    </div>
  </div>
    `;
  };

  $ProductDetailPage.addEventListener('change', this.onSelectChange);
  $ProductDetailPage.addEventListener('change', this.onInputChange);
  $ProductDetailPage.addEventListener('click', this.onClickOrder);

  this.fetchProductDetail();
}

export default ProductDetailPage;
