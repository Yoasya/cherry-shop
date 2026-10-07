(() => {
  const root = document.documentElement;
  const saved = localStorage.getItem('cherry-theme');
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = saved || preferred;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
})();

function getCart() {
  try { return JSON.parse(localStorage.getItem('cherry-cart')) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem('cherry-cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const total = getCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = total);
  document.querySelectorAll('.cart-link').forEach(link => link.classList.toggle('has-items', total > 0));
}

function addToCart(productId, quantity = 1) {
  const products = window.CHERRY_PRODUCTS || [];
  const product = products.find(item => item.id === Number(productId));
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity += quantity;
  else cart.push({ id: product.id, quantity });
  saveCart(cart);
  showToast(`${product.name} добавлена в корзину`);
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(window.__cherryToastTimer);
  window.__cherryToastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
}

function initThemeToggle() {
  const button = document.querySelector('[data-theme-toggle]');
  if (!button) return;
  const refreshLabel = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    button.setAttribute('aria-label', dark ? 'Включить светлую тему' : 'Включить тёмную тему');
    button.querySelector('[data-theme-icon]').textContent = dark ? '☀' : '◐';
  };
  refreshLabel();
  button.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    localStorage.setItem('cherry-theme', next);
    refreshLabel();
  });
}

function initMobileNav() {
  const button = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-main-nav]');
  if (!button || !nav) return;
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(open));
  });
}

function setActiveNav() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-main-nav] a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === 'product.html' && href === 'catalog.html')) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  setActiveNav();
  updateCartCount();
});
