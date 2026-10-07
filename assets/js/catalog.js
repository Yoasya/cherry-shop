document.addEventListener('DOMContentLoaded', () => {
  const products = window.CHERRY_PRODUCTS || [];
  const grid = document.querySelector('[data-product-grid]');
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const sort = document.querySelector('[data-sort]');
  const empty = document.querySelector('[data-empty]');
  if (!grid) return;

  const params = new URLSearchParams(location.search);
  let activeFilter = ['sour', 'sweet'].includes(params.get('type')) ? params.get('type') : 'all';

  function render() {
    let list = activeFilter === 'all' ? [...products] : products.filter(p => p.category === activeFilter);
    const sortValue = sort?.value || 'default';
    if (sortValue === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sortValue === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortValue === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

    grid.replaceChildren();
    empty.hidden = list.length > 0;

    list.forEach(product => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <a class="product-card__image" href="product.html?id=${product.id}" aria-label="Открыть ${product.name}">
          <img src="${product.image}" alt="${product.name}" loading="lazy" width="640" height="640">
          <span class="product-card__badge">${product.badge}</span>
        </a>
        <div class="product-card__body">
          <div>
            <p class="eyebrow">${product.type}</p>
            <h2><a href="product.html?id=${product.id}">${product.name}</a></h2>
          </div>
          <p class="product-card__desc">${product.short}</p>
          <div class="product-card__footer">
            <strong>${formatPrice(product.price)}</strong>
            <button class="button button--small" type="button" data-add="${product.id}">В корзину</button>
          </div>
        </div>`;
      grid.appendChild(card);
    });
  }

  filterButtons.forEach(button => {
    if (button.dataset.filter === activeFilter) button.classList.add('is-active');
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach(btn => btn.classList.toggle('is-active', btn === button));
      const url = new URL(location.href);
      if (activeFilter === 'all') url.searchParams.delete('type'); else url.searchParams.set('type', activeFilter);
      history.replaceState({}, '', url);
      render();
    });
  });

  sort?.addEventListener('change', render);
  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-add]');
    if (button) addToCart(Number(button.dataset.add));
  });

  render();
});
