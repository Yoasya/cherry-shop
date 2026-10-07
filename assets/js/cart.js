document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-cart]');
  if (!root) return;
  const products = window.CHERRY_PRODUCTS || [];

  function getDetailedCart() {
    return getCart().map(row => {
      const product = products.find(item => item.id === row.id);
      return product ? { ...product, quantity: row.quantity } : null;
    }).filter(Boolean);
  }

  function render() {
    const cart = getDetailedCart();
    root.replaceChildren();

    if (!cart.length) {
      root.innerHTML = `<section class="empty-state"><p class="eyebrow">Корзина</p><h1>Пока пусто</h1><p>Самое время выбрать сорт. Без давления, вишня терпеливая.</p><a class="button" href="catalog.html">Перейти в каталог</a></section>`;
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'cart-layout shell';
    const list = document.createElement('div');
    list.className = 'cart-list';

    cart.forEach(item => {
      const row = document.createElement('article');
      row.className = 'cart-item';
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}" width="140" height="140">
        <div class="cart-item__info">
          <p class="eyebrow">${item.type}</p>
          <h2><a href="product.html?id=${item.id}">${item.name}</a></h2>
          <p>${formatPrice(item.price)} / шт.</p>
        </div>
        <div class="quantity" aria-label="Количество товара ${item.name}">
          <button type="button" data-action="minus" data-id="${item.id}" aria-label="Уменьшить количество">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-action="plus" data-id="${item.id}" aria-label="Увеличить количество">+</button>
        </div>
        <strong class="cart-item__sum">${formatPrice(item.price * item.quantity)}</strong>
        <button class="icon-button" type="button" data-action="remove" data-id="${item.id}" aria-label="Удалить ${item.name}">×</button>`;
      list.appendChild(row);
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const summary = document.createElement('aside');
    summary.className = 'cart-summary';
    summary.innerHTML = `
      <p class="eyebrow">Итого</p>
      <div class="cart-summary__line"><span>Товары</span><strong>${formatPrice(total)}</strong></div>
      <div class="cart-summary__line"><span>Доставка</span><span>Рассчитывается отдельно</span></div>
      <hr>
      <div class="cart-summary__total"><span>К оплате</span><strong>${formatPrice(total)}</strong></div>
      <button class="button button--full" type="button" data-checkout>Оформить заказ</button>
      <p class="muted">Учебный проект: кнопка оформления демонстрационная.</p>`;

    wrapper.append(list, summary);
    root.appendChild(wrapper);
  }

  root.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (button) {
      const id = Number(button.dataset.id);
      const cart = getCart();
      const item = cart.find(row => row.id === id);
      if (!item) return;
      if (button.dataset.action === 'plus') item.quantity += 1;
      if (button.dataset.action === 'minus') item.quantity = Math.max(1, item.quantity - 1);
      if (button.dataset.action === 'remove') cart.splice(cart.indexOf(item), 1);
      saveCart(cart);
      render();
    }
    if (event.target.closest('[data-checkout]')) showToast('Это учебный магазин — заказ не отправлен');
  });

  render();
});
