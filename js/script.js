// NPHere - client-side logic for product listing, cart, reviews, interactions
(() => {
  // -------------------------
  // Data (sample products)
  // -------------------------
  const PRODUCTS = [
    { id: 'c1', name: 'Vanilla Luxe', price: 499, desc: 'Creamy vanilla with warm amber notes.', img: 'https://images.unsplash.com/photo-1542986183-7850b5f8f3c4?w=900&q=60&auto=format&fit=crop' },
    { id: 'c2', name: 'Rose & Oud', price: 699, desc: 'Floral rose with woody oud accents.', img: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=900&q=60&auto=format&fit=crop' },
    { id: 'c3', name: 'Citrus Zest', price: 399, desc: 'Fresh citrus perfect for daytime.', img: 'https://images.unsplash.com/photo-1526318472351-c75fcf0700f9?w=900&q=60&auto=format&fit=crop' },
    { id: 'c4', name: 'Lavender Calm', price: 549, desc: 'Relaxing lavender to soothe your evening.', img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=900&q=60&auto=format&fit=crop' },
    { id: 'c5', name: 'Sandalwood Classic', price: 649, desc: 'Warm sandalwood for cozy nights.', img: 'https://images.unsplash.com/photo-1519058081285-90d0f2f7b0c6?w=900&q=60&auto=format&fit=crop' }
  ];

  // -------------------------
  // Utility
  // -------------------------
  function $(sel, root = document) { return root.querySelector(sel); }
  function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  // -------------------------
  // Cart (localStorage)
  // -------------------------
  const CART_KEY = 'nphere_cart_v1';
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || {};
    } catch (e) {
      return {};
    }
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  }

  function addToCart(id, qty = 1) {
    const cart = getCart();
    cart[id] = (cart[id] || 0) + qty;
    saveCart(cart);
    flashMsg('Added to cart');
  }
  function removeFromCart(id) {
    const cart = getCart();
    delete cart[id];
    saveCart(cart);
  }
  function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartCount();
  }
  function cartTotal() {
    const cart = getCart();
    let total = 0;
    for (const id in cart) {
      const p = PRODUCTS.find(x => x.id === id);
      if (p) total += p.price * cart[id];
    }
    return total;
  }
  function cartCount() {
    const cart = getCart();
    return Object.values(cart).reduce((s,v)=>s+v,0);
  }

  // -------------------------
  // UI Rendering
  // -------------------------
  function renderFeatured() {
    const el = $('#featuredProducts');
    if(!el) return;
    const featured = PRODUCTS.slice(0, 3);
    el.innerHTML = featured.map(p => productCardHtml(p)).join('');
    // attach events
    $all('.add-cart-btn', el).forEach(btn => {
      btn.addEventListener('click', e => {
        addToCart(btn.dataset.id, 1);
      });
    });
  }

  function renderProductsPage() {
    const list = $('#productList');
    if (!list) return;
    list.innerHTML = PRODUCTS.map(p => productCardHtml(p, true)).join('');
    $all('.add-cart-btn', list).forEach(btn=>{
      btn.addEventListener('click', e => addToCart(btn.dataset.id, 1));
    });
    $all('.quick-view', list).forEach(btn=>{
      btn.addEventListener('click', e => {
        const pid = btn.dataset.id;
        const product = PRODUCTS.find(p=>p.id===pid);
        if (!product) return;
        openQuickView(product);
      });
    });
  }

  function productCardHtml(p, showView=false) {
    return `
      <div class="product" data-id="${p.id}">
        <img src="${p.img}" alt="${escapeHtml(p.name)}" />
        <h4>${escapeHtml(p.name)}</h4>
        <p class="muted">${escapeHtml(p.desc)}</p>
        <div class="price">₹${formatPrice(p.price)}</div>
        <div class="actions">
          <button class="btn add-cart-btn" data-id="${p.id}">Add to Cart</button>
          ${showView ? `<button class="btn outline quick-view" data-id="${p.id}">Quick View</button>` : ''}
        </div>
      </div>
    `.trim();
  }

  function escapeHtml(s='') {
    return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }
  function formatPrice(n){ return Number(n).toFixed(0); }

  // -------------------------
  // Quick view (simple)
  // -------------------------
  function openQuickView(product) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="close">×</button>
        <h3>${escapeHtml(product.name)}</h3>
        <img style="width:100%;max-height:300px;object-fit:cover;border-radius:8px" src="${product.img}">
        <p class="muted">${escapeHtml(product.desc)}</p>
        <div class="price">₹${formatPrice(product.price)}</div>
        <div style="margin-top:12px;">
          <button class="btn quick-add" data-id="${product.id}">Add to cart</button>
          <button class="btn outline close-btn">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.close').addEventListener('click', ()=>modal.remove());
    modal.querySelector('.close-btn').addEventListener('click', ()=>modal.remove());
    modal.querySelector('.quick-add').addEventListener('click', (e)=>{
      addToCart(product.id,1);
      modal.remove();
    });
  }

  // -------------------------
  // Cart modal UI
  // -------------------------
  function buildCartHtml(containerId, totalId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const cart = getCart();
    if (Object.keys(cart).length === 0) {
      container.innerHTML = '<p>Your cart is empty.</p>';
      document.getElementById(totalId).innerText = '0.00';
      return;
    }
    let html = '<div>';
    for (const id in cart) {
      const p = PRODUCTS.find(x=>x.id===id);
      if (!p) continue;
      html += `
        <div class="review" style="display:flex;gap:12px;align-items:center;justify-content:space-between">
          <div style="flex:1">
            <strong>${escapeHtml(p.name)}</strong>
            <div class="muted">₹${formatPrice(p.price)} × ${cart[id]}</div>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <button class="btn outline dec" data-id="${id}">−</button>
            <button class="btn outline inc" data-id="${id}">+</button>
            <button class="btn outline rm" data-id="${id}">Remove</button>
          </div>
        </div>
      `;
    }
    html += '</div>';
    container.innerHTML = html;

    // events
    $all('.inc', container).forEach(b=>{
      b.addEventListener('click', ()=> {
        const id = b.dataset.id;
        const c = getCart();
        c[id] = (c[id]||0)+1;
        saveCart(c);
        buildCartHtml(containerId, totalId);
      });
    });
    $all('.dec', container).forEach(b=>{
      b.addEventListener('click', ()=> {
        const id = b.dataset.id;
        const c = getCart();
        c[id] = (c[id]||0)-1;
        if (c[id] <= 0) delete c[id];
        saveCart(c);
        buildCartHtml(containerId, totalId);
      });
    });
    $all('.rm', container).forEach(b=>{
      b.addEventListener('click', ()=> {
        removeFromCart(b.dataset.id);
        buildCartHtml(containerId, totalId);
      });
    });

    document.getElementById(totalId).innerText = cartTotal().toFixed(2);
  }

  // -------------------------
  // Flash message helper
  // -------------------------
  function flashMsg(txt, time=1800) {
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;right:20px;bottom:20px;background:var(--gold);color:#2b1708;padding:10px 14px;border-radius:8px;box-shadow:var(--shadow);z-index:9999;font-weight:700';
    el.innerText = txt;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(), time);
  }

  // -------------------------
  // Reviews (persist in localStorage)
  // -------------------------
  const REV_KEY = 'nphere_reviews_v1';
  function getReviews() {
    try { return JSON.parse(localStorage.getItem(REV_KEY)) || [
      {name:'Anjali',text:'Lovely scent! Long lasting.'},
      {name:'Ravi',text:'Packaging was beautiful.'}
    ]; } catch (e) { return []; }
  }
  function saveReview(rev) {
    const all = getReviews();
    all.unshift(rev);
    localStorage.setItem(REV_KEY, JSON.stringify(all));
  }
  function renderReviews() {
    const el = $('#reviewList');
    if (!el) return;
    const list = getReviews();
    if (list.length === 0) el.innerHTML = '<p>No reviews yet.</p>';
    else el.innerHTML = list.map(r => `<div class="review"><strong>${escapeHtml(r.name)}</strong><p>${escapeHtml(r.text)}</p></div>`).join('');
  }

  // -------------------------
  // Generic DOM interactions
  // -------------------------
  function updateCartCount() {
    const count = cartCount();
    $all('#cartCount,#cartCount2,#cartCount3,#cartCount4,#cartCount5,#cartCount6,#cartCount7,#cartCount8,#cartCount9').forEach(el => el.innerText = count);
  }

  function wireCartButtons() {
    // open cart modals on various pages
    const modalMap = [
      {btn:'#cartBtn', modal:'#cartModal', items:'#cartItems', total:'#cartTotal', close:'#closeCart', checkout:'#checkoutBtn', clear:'#clearCart'},
      {btn:'#cartBtn2', modal:'#cartModal2', items:'#cartItems2', total:'#cartTotal2', close:'#closeCart2', checkout:'#checkoutBtn2', clear:'#clearCart2'},
      {btn:'#cartBtn3', modal:'#cartModal', items:'#cartItems', total:'#cartTotal', close:'#closeCart', checkout:'#checkoutBtn', clear:'#clearCart'},
      {btn:'#cartBtn4', modal:'#cartModal', items:'#cartItems', total:'#cartTotal', close:'#closeCart', checkout:'#checkoutBtn', clear:'#clearCart'},
      {btn:'#cartBtn5', modal:'#cartModal', items:'#cartItems', total:'#cartTotal', close:'#closeCart', checkout:'#checkoutBtn', clear:'#clearCart'},
      {btn:'#cartBtn6', modal:'#cartModal', items:'#cartItems', total:'#cartTotal', close:'#closeCart', checkout:'#checkoutBtn', clear:'#clearCart'},
      {btn:'#cartBtn7', modal:'#cartModal', items:'#cartItems', total:'#cartTotal', close:'#closeCart', checkout:'#checkoutBtn', clear:'#clearCart'},
      {btn:'#cartBtn8', modal:'#cartModal', items:'#cartItems', total:'#cartTotal', close:'#closeCart', checkout:'#checkoutBtn', clear:'#clearCart'},
      {btn:'#cartBtn9', modal:'#cartModal', items:'#cartItems', total:'#cartTotal', close:'#closeCart', checkout:'#checkoutBtn', clear:'#clearCart'},
    ];
    modalMap.forEach(cfg=>{
      const btn = document.querySelector(cfg.btn);
      const modal = document.querySelector(cfg.modal);
      if (!btn || !modal) return;
      btn.addEventListener('click', ()=>{
        modal.classList.remove('hidden');
        buildCartHtml(cfg.items.replace('#',''), cfg.total.replace('#',''));
      });
      const closeEl = document.querySelector(cfg.close);
      if (closeEl) closeEl.addEventListener('click', ()=> modal.classList.add('hidden'));
      const clearBtn = document.querySelector(cfg.clear);
      if (clearBtn) clearBtn.addEventListener('click', ()=> {
        clearCart();
        buildCartHtml(cfg.items.replace('#',''), cfg.total.replace('#',''));
      });
      const checkoutBtn = document.querySelector(cfg.checkout);
      if (checkoutBtn) checkoutBtn.addEventListener('click', ()=> {
        if (cartCount() === 0) { flashMsg('Cart is empty'); return; }
        // simulate checkout
        const total = cartTotal().toFixed(2);
        clearCart();
        buildCartHtml(cfg.items.replace('#',''), cfg.total.replace('#',''));
        flashMsg(`Thank you! Order placed (₹${total})`);
        modal.classList.add('hidden');
      });
    });
  }

  // -------------------------
  // Accordion (FAQ)
  // -------------------------
  function wireAccordion() {
    $all('.accordion .q').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const a = btn.nextElementSibling;
        const visible = a.style.display === 'block';
        $all('.accordion .a').forEach(el=>el.style.display='none');
        a.style.display = visible ? 'none' : 'block';
      });
    });
  }

  // -------------------------
  // Reviews form
  // -------------------------
  function wireReviewForm() {
    const form = $('#reviewForm');
    if (!form) return;
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const name = $('#reviewer').value.trim();
      const txt = $('#reviewText').value.trim();
      if (!name || !txt) { flashMsg('Please fill both fields'); return; }
      saveReview({name, text: txt});
      renderReviews();
      form.reset();
      flashMsg('Thanks for your review!');
    });
  }

  // -------------------------
  // Login (mock)
  // -------------------------
  function wireLogin() {
    const form = $('#loginForm');
    if (!form) return;
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const email = $('#email').value.trim();
      const pass = $('#password').value.trim();
      if (!email || !pass) { flashMsg('Provide credentials'); return; }
      // simple mock "validation"
      if (pass.length < 4) {
        flashMsg('Password too short');
        return;
      }
      // store "session" (not secure - demo)
      localStorage.setItem('nphere_user', JSON.stringify({email, loggedAt:Date.now()}));
      flashMsg('Logged in (demo)');
      setTimeout(()=> location.href = 'index.html', 700);
    });
  }

  // -------------------------
  // On load init
  // -------------------------
  function init() {
    // update year
    const y = new Date().getFullYear();
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.innerText = y;

    renderFeatured();
    renderProductsPage();
    renderReviews();
    updateCartCount();
    wireCartButtons();
    wireAccordion();
    wireReviewForm();
    wireLogin();

    // product list page uses productList id (rendered already)
    // wire quick interactions on dynamically added nodes
    // Add demo for any page-specific content
    // close global modals by clicking outside content
    document.addEventListener('click', (e)=>{
      if (e.target.classList.contains('modal')) e.target.classList.add('hidden');
    });

    // sample: if on products page, render product list (already done)
  }

  // run init once DOM ready
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
