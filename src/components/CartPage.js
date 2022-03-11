import { request } from '../api.js';
import { pushState } from '../router.js';
import { clearItem, getItem } from '../storage.js';

function CartPage({ $target }) {
  const $CartPage = document.createElement('div');
  $CartPage.className = 'CartPage';

  this.state = [];

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.getStorageItems = async () => {
    const cartItems = getItem('products_cart', []);

    if (!cartItems.length) {
      alert('장바구니가 비어 있습니다!');
      pushState('/web/');
    } else {
      const nextState = await Promise.all(
        cartItems.map(async (item) => {
          const product = await request(`/products/${item.productId}`);
          const option = product.productOptions.find(
            (option) => option.id === item.optionId
          );

          return {
            imageUrl: product.imageUrl,
            id: product.id,
            name: product.name,
            optionName: option.name,
            price: option.price ? product.price + option.price : product.price,
            quantity: item.quantity,
          };
        })
      );

      this.setState(nextState);
    }
  };

  this.onClickOrder = (e) => {
    if (e.target.className !== 'OrderButton') return;

    clearItem('products_cart');
    alert('주문되었습니다');
    pushState('/web/');
  };

  this.render = () => {
    $target.appendChild($CartPage);

    $CartPage.innerHTML = `
    <h1>장바구니</h1>
    <div class="Cart">
      <ul>
        ${this.state
          .map(
            (product) => `
          <li class="Cart_item">
            <img src=${product.imageUrl} />
            <div class="Cart__itemDesription">
              <div>${product.name} ${product.optionName} ${product.quantity}개</div>
              <div>${product.price}</div>
            </div>
          </li>
        `
          )
          .join('')}
      </ul>
      <div class="Cart__totalPrice">
        총 상품가격 ${this.state.reduce(
          (acc, product) => acc + product.price * product.quantity,
          0
        )}원
      </div>
      <button class="OrderButton">주문하기</button>
    </div>
    `;
  };

  $CartPage.addEventListener('click', this.onClickOrder);

  this.getStorageItems();
}

export default CartPage;
