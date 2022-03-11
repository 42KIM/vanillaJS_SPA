import ProductListPage from './ProductListPage.js';
import ProductDetailPage from './ProductDetailPage.js';
import CartPage from './CartPage.js';

function App({ $target }) {
  console.log(window.location.pathname.split('/'));
  this.route = () => {
    const [, , pathname, id] = window.location.pathname.split('/');
    const { firstChild } = $target;

    if (firstChild) {
      $target.removeChild(firstChild);
    }

    if (pathname === '') {
      new ProductListPage({ $target });
    } else if (pathname === 'products' && id) {
      new ProductDetailPage({ $target });
    } else if (pathname === 'cart') {
      new CartPage({ $target });
    }
  };

  window.addEventListener('urlChange', this.route);
  window.addEventListener('popstate', this.route);

  this.route();
}

export default App;
