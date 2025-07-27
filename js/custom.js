const swiper = new Swiper('.swiper-container', {
  slidesPerView: 1,
  spaceBetween: 10,

  pagination: {
    el: '.swiper-pagination',
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  // using "ratio" endpoints
  breakpoints: {
    // '@0.75': {
    //   slidesPerView: 2,
    //   spaceBetween: 20,
    // },
    // '@1.00': {
    //   slidesPerView: 3,
    //   spaceBetween: 40,
    // },
    // '@1.50': {
    //   slidesPerView: 4,
    //   spaceBetween: 50,
    // },
  },
});

function leftNavFilterToggle(event, $sideNavItems) {
  $sideNavItems.forEach(($navItem) => {
    $navItem.classList.remove('side-nav__item--active');
    event.currentTarget.classList.add('side-nav__item--active');
  });
}

// Количество Товаров
function countAllProductQuantity() {
  const allProducts = document.querySelectorAll(
    '.main-jlsntwn .main-block .main-block__item'
  );
  const totalInput = document.querySelector(
    '.main-jlsntwn .main-block .main-block__total .total__wrap div'
  );
  let countNumber = allProducts.length;
  if (totalInput) {
    totalInput.textContent = countNumber;
  }
}

//=====СОРТИРОВКА=======
function sortItemsBy(sortType) {
  const container = document.querySelector('.main-block-items__container');
  const items = Array.from(container.querySelectorAll('.main-block__item'));

  let sortedItems = items;

  if (sortType === 'expensive') {
    sortedItems = items.sort((a, b) => {
      const priceA = parseInt(
        a.querySelector('.block-item__cost').textContent.replace(/\D/g, '')
      );
      const priceB = parseInt(
        b.querySelector('.block-item__cost').textContent.replace(/\D/g, '')
      );
      return priceB - priceA;
    });
  } else if (sortType === 'cheap') {
    sortedItems = items.sort((a, b) => {
      const priceA = parseInt(
        a.querySelector('.block-item__cost').textContent.replace(/\D/g, '')
      );
      const priceB = parseInt(
        b.querySelector('.block-item__cost').textContent.replace(/\D/g, '')
      );
      return priceA - priceB;
    });
  } else if (sortType === 'popular') {
    sortedItems = items.sort((a, b) => {
      const popA = parseInt(a.dataset.popular || 0);
      const popB = parseInt(b.dataset.popular || 0);
      return popB - popA;
    });
  } else if (sortType === 'new') {
    sortedItems = items.sort((a, b) => {
      const dateA = parseInt(a.dataset.new || 0);
      const dateB = parseInt(b.dataset.new || 0);
      return dateB - dateA;
    });
  }

  container.innerHTML = '';
  sortedItems.forEach((item) => container.appendChild(item));
}
//=====СЕЛЕКТОР=========
function selectorFirstChoise($nodes) {
  // ПРОВЕРКА - опции как дочерний элемент
  $nodes.forEach(($selector) => {
    const selectorOptionsList = $selector.querySelector('.selector__options');
    if (!selectorOptionsList) return false;
    // Конец проверки
    const selectorOptions =
      selectorOptionsList.querySelectorAll('.selector__option');

    selectorOptions.forEach(($opt, $index) => {
      $opt.classList.remove('option--active');
      if ($index === 0) {
        $opt.classList.add('option--active');
        const selectorElt = $opt.closest('.custom-selector');
        const selectorTextElt = selectorElt.querySelector('.selected-txt');
        selectorTextElt.textContent = $opt.textContent;
        //Сортировка
        const sortType = $opt.dataset.sort;
        sortItemsBy(sortType);
      }
    });
  });
}

function operateBlackWindow(addWindow = true) {
  const blackWindow = document.querySelector(
    '.main-jlsntwn .pop-up__black-window'
  );
  if (addWindow) {
    blackWindow.classList.add('black-window__active');
  } else {
    blackWindow.classList.remove('black-window__active');
  }
}

function selectorInputChosen($selectedOption) {
  if (!$selectedOption) return false;
  const $selector = $selectedOption.closest('.custom-selector');
  const $optionsList = $selector.querySelector('.selector__options');
  const $options = $optionsList.querySelectorAll('.selector__option');
  const $selectorText = $selector.querySelector('.selected-txt');

  $options.forEach(($opt) => $opt.classList.remove('option--active'));
  $selectedOption.classList.add('option--active');
  const $optionText = $selectedOption.textContent;
  $selectorText.textContent = $optionText;
  operateBlackWindow(false);
  $optionsList.classList.remove('options_activate');
  //Сортировка
  const sortType = $selectedOption.dataset.sort;
  sortItemsBy(sortType);
}

function closeAllOptionLists() {
  document.querySelectorAll('.selector__options').forEach(($list) => {
    $list.classList.remove('options_activate');
  });
}

// ВИДИМОСТЬ
function selectorOptionsVisibility(event) {
  event.stopPropagation(); // чтобы не закрылось мгновенно
  const clickButton = event.currentTarget;
  const clickedSelector = clickButton.closest('.drop-down-list');
  const selectorOptions = clickedSelector.querySelector('.selector__options');

  const isOpened = selectorOptions.classList.contains('options_activate');

  // Закрыть все, затем открыть только нужный
  closeAllOptionLists();
  if (!isOpened) {
    selectorOptions.classList.add('options_activate');
  }

  operateBlackWindow(true); // добавить темное
}

// ФЕТЧ БЭКЭНД ДАННЫХ
const API_PREFIX = 'https://6884f738745306380a39f891.mockapi.io/cl1';

async function loadProducts() {
  const res = await fetch(`${API_PREFIX}/products`);
  const products = await res.json();
  window.allProducts = products; // сохраняем в глобальную переменную
  renderProducts(products);
}

function renderProducts(products) {
  const container = document.querySelector('.main-block-items__container');
  container.innerHTML = '';

  products.forEach((product) => {
    const el = document.createElement('div');
    el.className = 'main-block__item';

    el.dataset.type = product.type.join(',');
    el.dataset.popular = product.type.includes('popular') ? 1 : 0;
    el.dataset.new = product.type.includes('new') ? 1 : 0;

    el.innerHTML = `
      <img src="${product.image}" alt="product pic">
      <div class="block-item__desc">
        <div class="block-item__text">${product.title}</div>
        <div class="block-item__cost">${product.price} ₽</div>
        <button class="product-plus" type="button">+</button>
      </div>
    `;
    container.appendChild(el);
  });

  countAllProductQuantity();
}

// ФИЛЬТР ПО ТИПАМ (в том числе если их несколько)
function leftNavFilterToggle(event, $sideNavItems) {
  const clickedItem = event.currentTarget.closest('.side-nav__item');
  $sideNavItems.forEach((item) =>
    item.classList.remove('side-nav__item--active')
  );
  clickedItem.classList.add('side-nav__item--active');

  const selectedType = clickedItem.dataset.type;

  const filtered = window.allProducts.filter((prod) =>
    prod.type.includes(selectedType)
  );

  renderProducts(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
  const $mainBlock = document.querySelector('.main-jlsntwn .main-block');
  const $sideNav = $mainBlock.querySelector('.side-nav');
  const $sideNavItems = $sideNav.querySelectorAll('.side-nav__item');

  if (!$mainBlock) return false;

  $sideNavItems.forEach(($navItem) => {
    $navItem.addEventListener('click', (event) =>
      leftNavFilterToggle(event, $sideNavItems)
    );
  });

  countAllProductQuantity();

  // SELECTOR: ДЕФОЛТ
  const customSelector = document.querySelectorAll(
    '.main-jlsntwn .custom-selector'
  );
  selectorFirstChoise(customSelector);

  // SELECTOR: ОПЦИИ
  const selectorsList = document.querySelectorAll(
    '.main-jlsntwn .drop-down-list'
  );
  selectorsList.forEach(($selectorElt) => {
    $selectorElt.addEventListener('click', selectorOptionsVisibility);

    const $options = $selectorElt.querySelectorAll('.selector__option');
    $options.forEach(($option) => {
      $option.addEventListener('click', (e) => {
        e.stopPropagation();
        selectorInputChosen(e.currentTarget);
      });
    });
  });

  // ЗАГРУЗКА
  loadProducts();

  // Клик вне селектора — закрытие списков
  document.addEventListener('click', (e) => {
    closeAllOptionLists();
  });

  const mobileRightFilter = document.querySelector(
    '.main-jlsntwn .mobile-block__info'
  );
  mobileRightFilter.addEventListener('click', () => {});

  window.addEventListener('resize', (e) => {
    const blackWindowAct = document.querySelector(
      '.main-jlsntwn .black-window__active'
    );
    const popUpActive = document.querySelector(
      '.main-jlsntwn .side-nav--mobile-version.pop-up-activate'
    );
    if (e.currentTarget.innerWidth > 760 && blackWindowAct && popUpActive) {
      blackWindowAct.classList.remove('black-window__active');
      popUpActive.classList.remove('pop-up-activate');
      popUpActive.classList.remove('side-nav--mobile-version');
    }
  });

  const mobileLeftFilter = document.querySelector(
    '.main-jlsntwn .mobile-block__info'
  );
  mobileLeftFilter.addEventListener('click', (e) => {
    operateBlackWindow(true);
    const mobileLeftPopUp = document.querySelector('.main-jlsntwn .side-nav');
    mobileLeftPopUp.classList.add(
      'side-nav--mobile-version',
      'pop-up-activate'
    );

    const popupNavItems = mobileLeftPopUp.querySelectorAll('.side-nav__item');
    popupNavItems.forEach(($navItem) => {
      $navItem.addEventListener('click', (event) =>
        leftNavFilterToggle(event, popupNavItems)
      );
    });

    const mobileSlideDown = mobileLeftPopUp.querySelector('.slide-down-button');
    mobileSlideDown.addEventListener('click', (e) => {
      const mobileLeftPopUp = e.currentTarget.closest(
        '.side-nav--mobile-version'
      );
      if (mobileLeftPopUp) {
        operateBlackWindow(false);
        mobileLeftPopUp.classList.remove('side-nav--mobile-version');
        mobileLeftPopUp.classList.remove('pop-up-activate');
      }
    });
  });

  const blackWindow = document.querySelector(
    '.main-jlsntwn .pop-up__black-window'
  );
  blackWindow.addEventListener('click', (e) => {
    const blackWindow = e.currentTarget;
    const popUpNodes = document.querySelectorAll('.pop-up-activate');
    popUpNodes.forEach(($popUp) => {
      const isMobile = $popUp.classList.contains('side-nav--mobile-version');
      if (isMobile) $popUp.classList.remove('side-nav--mobile-version');
      $popUp.classList.remove('pop-up-activate');
    });
    blackWindow.classList.remove('black-window__active');
  });

  const popUpNodes = document.querySelectorAll('.pop-up-activate');
  popUpNodes.forEach(($popUp) => {
    $popUp.addEventListener('click', (e) => {
      const slideDownBtn = document.querySelector(
        '.side-nav--mobile-version.pop-up-activate .slide-down-button'
      );
      if (slideDownBtn && e.currentTarget === slideDownBtn) {
        slideDownBtn.classList.remove(
          'side-nav--mobile-version',
          'pop-up-activate'
        );
      }
    });
  });

  // BUSKET
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const cartBtn = document.querySelector('.header-cart-btn');
  const cartPopup = document.querySelector('.cart-popup');
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartTotalPrice = document.querySelector('.cart-total-price');
  const checkoutBtn = document.querySelector('.checkout-btn');
  const closeCartBtn = document.querySelector('.cart-close-btn');
  const cartCountEl = document.querySelector('.cart-count');
  const clearCartBtn = document.querySelector('.clear-cart-btn');

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function updateCartCounter() {
    const totalCount = cart
      .filter((item) => !item.removed)
      .reduce((sum, item) => sum + item.quantity, 0);
    cartBtn.textContent = totalCount;
  }

  function updateCartTotal() {
    const total = cart
      .filter((item) => !item.removed)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalPrice.textContent = `${total.toFixed(2)} ₽`;
  }

  function renderCart() {
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      if (item.removed) div.classList.add('removed');

      div.innerHTML = `
      <img src="${item.image}" alt="product pic">
      <div class="busket-desc">
        <div class="block-item__text">${item.title}</div>
        <div class="block-item__cost">${(item.price * item.quantity).toFixed(
          2
        )} ₽</div>
      </div>

  ${
    item.removed
      ? ''
      : `
    <div class="cart-quantity">
      <button class="quantity-minus">-</button>
      <span class="quantity">${item.quantity}</span>
      <button class="quantity-plus">+</button>
    </div>`
  }

  <button class="remove-btn">
    <img src="${
      item.removed ? 'media/repeat.png' : 'media/close-x.png'
    }" alt="${item.removed ? 'Вернуть' : 'Удалить'}">
  </button>
`;

      // Удалить/вернуть
      div.querySelector('.remove-btn').addEventListener('click', () => {
        if (item.removed) {
          cart[index].removed = false;
          cart[index].quantity = 1;
        } else {
          cart[index].removed = true;
        }
        saveCart();
        renderCart();
      });

      // + и -
      if (!item.removed) {
        div.querySelector('.quantity-plus').addEventListener('click', () => {
          cart[index].quantity++;
          saveCart();
          renderCart();
        });

        div.querySelector('.quantity-minus').addEventListener('click', () => {
          cart[index].quantity--;
          if (cart[index].quantity <= 0) {
            cart[index].removed = true;
          }
          saveCart();
          renderCart();
        });
      }

      cartItemsContainer.appendChild(div);
    });

    // Обновить количество
    const count = cart
      .filter((item) => !item.removed)
      .reduce((sum, item) => sum + item.quantity, 0);
    let word = 'товаров';
    if (count === 1) word = 'товар';
    else if (count >= 2 && count <= 4) word = 'товара';
    cartCountEl.textContent = `${count} ${word}`;

    updateCartCounter();
    updateCartTotal();
  }

  function addToCart(product) {
    const existing = cart.find(
      (item) => item.title === product.title && !item.removed
    );
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...product, quantity: 1, removed: false });
    }
    saveCart();
    renderCart();
  }

  function operateBlackWindow(show = true) {
    blackWindow.classList.toggle('black-window__active', show);
  }

  function closeCart() {
    cart = cart.filter((item) => !item.removed);
    saveCart();
    renderCart();
    cartPopup.classList.add('hidden');
    operateBlackWindow(false);
  }

  // Открытие корзины
  cartBtn.addEventListener('click', () => {
    cartPopup.classList.remove('hidden');
    operateBlackWindow(true);
  });

  // Кнопка оформления
  checkoutBtn.addEventListener('click', () => {
    closeCart();
  });

  // Закрытие по крестику и клику на фон
  closeCartBtn.addEventListener('click', closeCart);
  blackWindow.addEventListener('click', closeCart);

  // Кнопка "Очистить всё"
  clearCartBtn.addEventListener('click', () => {
    cart = [];
    saveCart();
    renderCart();
  });

  // Навешивание на product-plus
  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('product-plus')) {
      const productEl = e.target.closest('.main-block__item');
      const title = productEl.querySelector('.block-item__text').textContent;
      const image = productEl.querySelector('img').src;
      const priceText =
        productEl.querySelector('.block-item__cost').textContent;
      const price = parseFloat(priceText.replace('₽', '').replace(',', '.'));

      addToCart({ title, image, price });
    }
  });

  // При загрузке
  renderCart();
});
