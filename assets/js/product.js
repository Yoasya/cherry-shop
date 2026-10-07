document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('[data-product-page]');
  if (!container) return;
  const id = Number(new URLSearchParams(location.search).get('id'));
  const product = (window.CHERRY_PRODUCTS || []).find(item => item.id === id);

  if (!product) {
    container.innerHTML = `<section class="empty-state"><p class="eyebrow">Ошибка 404</p><h1>Такой ягоды здесь нет</h1><p>Возможно, ссылка устарела. Каталог на месте и никуда не делся.</p><a class="button" href="catalog.html">Вернуться в каталог</a></section>`;
    return;
  }

  document.title = `${product.name} — CHERRY?`;
  container.innerHTML = `
    <section class="product-detail shell">
      <div class="product-detail__media">
        <a class="back-link" href="catalog.html">← В каталог</a>
        <img src="${product.image}" alt="${product.name}" width="720" height="960">
      </div>
      <div class="product-detail__content">
        <p class="eyebrow">${product.type} · ${product.latin}</p>
        <h1>${product.name}</h1>
        <p class="lead">${product.short}</p>
        <div class="product-specs">
          <div><span>Вкус</span><strong>${product.taste}</strong></div>
          <div><span>Размер</span><strong>${product.size}</strong></div>
          <div><span>Назначение</span><strong>${product.purpose}</strong></div>
          <div><span>Вес плода</span><strong>${product.fruitWeight}</strong></div>
        </div>
        <div class="product-buy">
          <strong>${formatPrice(product.price)}</strong>
          <button class="button" type="button" data-add="${product.id}">Добавить в корзину</button>
        </div>
      </div>
    </section>
    <section class="shell product-story">
      <div>
        <p class="eyebrow">О сорте</p>
        <h2>Характер в деталях</h2>
      </div>
      <div>
        <p>${product.description}</p>
        <ul>${product.features.map(item => `<li>${item}</li>`).join('')}</ul>
      </div>
    </section>`;

  container.querySelector('[data-add]').addEventListener('click', () => addToCart(product.id));
});
