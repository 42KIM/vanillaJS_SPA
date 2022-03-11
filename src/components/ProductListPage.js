import { request } from '../api.js';
import { formatPrice } from '../util.js';
import { pushState } from '../router.js';

function ProductListPage({ $target }) {
  const $ProductListPage = document.createElement('div');
  $ProductListPage.className = 'ProductListPage';

  this.state = [];

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  const fetchProductList = async () => {
    const productList = await request('/products');
    this.setState(productList);
  };

  this.render = () => {
    $target.appendChild($ProductListPage);

    if (this.state.length) {
      $ProductListPage.innerHTML = `
      <h1>상품목록</h1>
      <ul>
        ${this.state
          .map(
            (product) => `
        <li data-id=${product.id} class="Product">
          <img src=${product.imageUrl}>
          <div class="Product__info">
            <div>${product.name}</div>
            <div>${formatPrice(product.price)}원~</div>
          </div>
        </li>
        `
          )
          .join('')}
      </ul>
    `;
    }
  };

  $ProductListPage.addEventListener('click', (e) => {
    const $product = e.target.closest('li');

    if ($product) {
      const { id } = $product.dataset;
      pushState(`/web/products/${id}`);
    }
  });

  fetchProductList();
}

export default ProductListPage;
