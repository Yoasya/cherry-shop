document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('[data-featured-products]');
  if (!grid) return;
  (window.CHERRY_PRODUCTS || []).slice(0, 4).forEach((product) => {
    const card = document.createElement('article');
    card.className = 'mini-product';
    card.innerHTML = `
      <a href="product.html?id=${product.id}" class="mini-product__media">
        <img src="${product.image}" alt="${product.name}" loading="lazy" width="640" height="640">
      </a>
      <div class="mini-product__meta">
        <p class="eyebrow">${product.type}</p>
        <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
        <strong>${formatPrice(product.price)}</strong>
      </div>`;
    grid.appendChild(card);
  });
});
