document.addEventListener('DOMContentLoaded', function () {

  // ===== ELEMENTS =====
  const tabs = document.querySelectorAll('#tabs .tab');
  const allCards = document.querySelectorAll('#watchesList .watch-card');
  const watchesList = document.getElementById('watchesList');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const curIdx = document.getElementById('curIdx');
  const totalCount = document.getElementById('totalCount');
  const barFill = document.getElementById('barFill');

  const popup = document.getElementById('popupOverlay');
  const popImg = document.getElementById('popImg');
  const popTitle = document.getElementById('popTitle');
  const popPrice = document.getElementById('popPrice');
  const popMeta = document.getElementById('popMeta');
  const popSpec = document.getElementById('popSpec');
  const CAT_NAMES = { men: "Men's Collection", women: "Women's Collection", luxury: 'Luxury', smart: 'Smart Watches', vintage: 'Vintage', wall: 'Wall & Desk Clock' };
  const addBtn = document.getElementById('addToCartBtn');
  const buyNowBtn = document.getElementById('buyNowBtn');
  const whatsappOrderBtn = document.getElementById('whatsappOrderBtn');
  const popQty = document.getElementById('popQty');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const popSku = document.getElementById('popSku');
  const clearBtn = document.getElementById('clearCartBtn');
  const closeBtn = document.querySelector('.pclose');
  const cartCount = document.querySelector('.cart-count');
  const cartIcon = document.getElementById('cartIcon');

  // ===== CART STATE =====
  const STORAGE_KEY = 'albertoCart';
  let cart = [];
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) cart = saved;
  } catch (e) { cart = []; }

  let mode = 'product'; // 'product' or 'cart'

  // Cart list shown when the cart icon is clicked
  const cartList = document.createElement('div');
  cartList.id = 'cartList';
  cartList.style.cssText = 'display:none;text-align:left;max-height:260px;overflow:auto;margin:10px 0 14px;font-size:14px;color:#1A130E;';
  popPrice.insertAdjacentElement('afterend', cartList);

  function parsePrice(text) {
    return parseInt(String(text).replace(/[^\d]/g, ''), 10) || 0;
  }

  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
  }

  function updateCartUI() {
    if (cartCount) cartCount.textContent = cart.length;
    if (clearBtn) clearBtn.style.display = cart.length > 0 ? 'block' : 'none';
  }

  function openPopup() { popup.classList.add('open'); }
  function closePopup() { popup.classList.remove('open'); }

  function renderCartView() {
    mode = 'cart';
    popImg.style.display = 'none';
    const popupGallery = document.querySelector('.popup-gallery');
    if (popupGallery) popupGallery.style.display = 'none';
    addBtn.style.display = 'none';
    if (buyNowBtn) buyNowBtn.style.display = 'none';
    if (whatsappOrderBtn) whatsappOrderBtn.style.display = 'none';
    const quantityControl = document.querySelector('.popup-quantity');
    const benefits = document.querySelector('.popup-benefits');
    const sku = document.getElementById('popSku');
    if (quantityControl) quantityControl.style.display = 'none';
    if (benefits) benefits.style.display = 'none';
    if (sku) sku.style.display = 'none';
    cartList.style.display = 'block';
    popTitle.textContent = 'Your Cart (' + cart.length + ')';
    if (popMeta) popMeta.textContent = '';
    if (popSpec) popSpec.textContent = '';
    if (cart.length === 0) {
      popPrice.textContent = '';
      cartList.innerHTML = '<p style="font-size:14px;margin:0;text-align:center;">Your cart is empty.</p>';
    } else {
      const total = cart.reduce(function (sum, item) { return sum + parsePrice(item.price); }, 0);
      popPrice.textContent = 'Total: PKR ' + total.toLocaleString('en-US');
      cartList.innerHTML = '';
      cart.forEach(function (item, i) {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(0,0,0,.1);';
        const label = document.createElement('span');
        label.textContent = item.name + ' — ' + item.price;
        const rm = document.createElement('button');
        rm.type = 'button';
        rm.textContent = '✕';
        rm.setAttribute('aria-label', 'Remove ' + item.name);
        rm.style.cssText = 'background:none;border:0;cursor:pointer;color:#8A6D2B;font-size:14px;';
        rm.addEventListener('click', function (e) {
          e.stopPropagation();
          cart.splice(i, 1);
          saveCart();
          renderCartView();
        });
        row.appendChild(label);
        row.appendChild(rm);
        cartList.appendChild(row);
      });
    }
    updateCartUI();
    openPopup();
  }

  function renderProductView(card) {
    mode = 'product';
    cartList.style.display = 'none';
    popImg.style.display = '';
    const popupGallery = document.querySelector('.popup-gallery');
    if (popupGallery) popupGallery.style.display = '';
    addBtn.style.display = '';
    if (buyNowBtn) buyNowBtn.style.display = '';
    if (whatsappOrderBtn) whatsappOrderBtn.style.display = '';
    const quantityControl = document.querySelector('.popup-quantity');
    const benefits = document.querySelector('.popup-benefits');
    if (quantityControl) quantityControl.style.display = 'flex';
    if (benefits) benefits.style.display = 'block';
    if (popSku) {
      popSku.style.display = 'block';
      popSku.textContent = 'SKU: ' + (card.dataset.sku || 'Available on request');
    }
    if (popQty) popQty.value = '1';
    popTitle.textContent = card.querySelector('h3').textContent;
    popPrice.textContent = card.querySelector('.price b').textContent;
    const specEl = card.querySelector('.spec');
    const badgeEl = card.querySelector('.badge');
    if (popMeta) popMeta.textContent = 'ALBERTO';
    if (popSpec) popSpec.textContent = (specEl ? specEl.textContent : '') + (badgeEl ? '  ·  ' + badgeEl.textContent : '');
    const img = card.querySelector('.watch-pic img') || card.querySelector('img');
    popImg.src = img ? img.src : '';
    addBtn.textContent = 'Add to Cart';
    addBtn.style.background = '';
    if (whatsappOrderBtn) {
      const message = 'Hello Alberto, I would like to order: ' + popTitle.textContent + ' (' + popPrice.textContent + '), Quantity: 1';
      whatsappOrderBtn.href = 'https://wa.me/923001234567?text=' + encodeURIComponent(message);
    }
    updateCartUI();
    openPopup();
  }

  updateCartUI();

  // ===== FILTER TABS =====
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('on'); });
      this.classList.add('on');
      const filter = this.getAttribute('data-filter');
      let count = 0;
      allCards.forEach(function (card) {
        if (filter === 'all' || card.getAttribute('data-cat') === filter) {
          card.style.display = '';
          count++;
        } else {
          card.style.display = 'none';
        }
      });
      if (totalCount) totalCount.textContent = String(count).padStart(2, '0');
      if (curIdx) curIdx.textContent = '01';
      if (watchesList) watchesList.scrollLeft = 0;
      if (barFill) barFill.style.width = '10%';
    });
  });

  // ===== ARROWS =====
  function getCardWidth() {
    const firstCard = Array.prototype.find.call(allCards, function (c) { return c.style.display !== 'none'; });
    if (!firstCard) return 320;
    let gap = 20;
    if (watchesList) gap = parseInt(getComputedStyle(watchesList).gap) || 20;
    return firstCard.offsetWidth + gap;
  }

  if (nextBtn && watchesList) {
    nextBtn.addEventListener('click', function () {
      watchesList.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
    });
  }
  if (prevBtn && watchesList) {
    prevBtn.addEventListener('click', function () {
      watchesList.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
    });
  }
  if (watchesList) {
    watchesList.addEventListener('scroll', function () {
      const index = Math.round(watchesList.scrollLeft / getCardWidth()) + 1;
      if (curIdx) curIdx.textContent = String(index).padStart(2, '0');
      const max = watchesList.scrollWidth - watchesList.clientWidth;
      if (max > 0 && barFill) barFill.style.width = (watchesList.scrollLeft / max * 100) + '%';
    });
  }

  // ===== CARD CLICK -> PRODUCT POPUP =====
  if (popup) {
    allCards.forEach(function (card) {
      card.addEventListener('click', function () { renderProductView(this); });
    });

    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    popup.addEventListener('click', function (e) { if (e.target === popup) closePopup(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePopup(); });
  }

  // ===== NAVBAR CART ICON -> CART VIEW =====
  if (cartIcon && popup) {
    cartIcon.addEventListener('click', function (e) {
      e.preventDefault();
      renderCartView();
    });
  }

  // ===== ADD TO CART =====
  if (addBtn) {
    addBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (mode !== 'product') return;
      const name = popTitle.textContent;
      const price = popPrice.textContent;
      for (let i = 0; i < currentQuantity(); i++) cart.push({ name: name, price: price });
      saveCart();
      this.textContent = 'Added to Cart ✓';
      this.style.background = '#C9A86A';
    });
  }

// ===== GALLERY ADD TO CART =====

document.querySelectorAll('.g2-item').forEach(function (item) {

    const addGalleryBtn = item.querySelector('.g2-add-btn');
    const plusBtn = item.querySelector('[data-action="plus"]');
    const minusBtn = item.querySelector('[data-action="minus"]');
    const qtyDisplay = item.querySelector('.g2-qty-num');

    if (!addGalleryBtn || !qtyDisplay) return;

    // Increase gallery quantity
    if (plusBtn) {
        plusBtn.addEventListener('click', function (e) {
            e.stopPropagation();

            let qty = parseInt(qtyDisplay.textContent, 10) || 0;
            qtyDisplay.textContent = qty + 1;
        });
    }

    // Decrease gallery quantity
    if (minusBtn) {
        minusBtn.addEventListener('click', function (e) {
            e.stopPropagation();

            let qty = parseInt(qtyDisplay.textContent, 10) || 0;
            qtyDisplay.textContent = Math.max(0, qty - 1);
        });
    }

    // Add gallery product to the SAME cart
    addGalleryBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const name = item.querySelector('.g2-info b').textContent.trim();

        const image = item.querySelector('.g2-img img');
        const imageName = image.src.split('/').pop();

        // Find the matching product in the main collection
        const matchingCard = Array.from(allCards).find(function (card) {
            const cardImage = card.querySelector('.watch-pic img');
            return cardImage && cardImage.src.split('/').pop() === imageName;
        });

        if (!matchingCard) {
            alert('Product price not found: ' + name);
            return;
        }

        const price = matchingCard.querySelector('.price b').textContent.trim();
        const quantity = Math.max(
            1,
            parseInt(qtyDisplay.textContent, 10) || 1
        );

        // Add selected quantity
        for (let i = 0; i < quantity; i++) {
            cart.push({
                name: name,
                price: price
            });
        }

        saveCart();

        addGalleryBtn.textContent = 'Added ✓';

        setTimeout(function () {
            addGalleryBtn.textContent = 'Add to Cart';
        }, 1500);

        // Reset gallery quantity
        qtyDisplay.textContent = '0';
    });
});

  // ===== PRODUCT QUANTITY + BUY ACTIONS =====
  function currentQuantity() {
    return Math.max(1, parseInt(popQty && popQty.value, 10) || 1);
  }
  if (qtyMinus) qtyMinus.addEventListener('click', function () {
    if (popQty) popQty.value = String(Math.max(1, currentQuantity() - 1));
    updateWhatsAppLink();
  });
  if (qtyPlus) qtyPlus.addEventListener('click', function () {
    if (popQty) popQty.value = String(currentQuantity() + 1);
    updateWhatsAppLink();
  });
  if (popQty) popQty.addEventListener('change', function () {
    this.value = String(currentQuantity());
    updateWhatsAppLink();
  });
  function updateWhatsAppLink() {
    if (!whatsappOrderBtn || mode !== 'product') return;
    const message = 'Hello Alberto, I would like to order: ' + popTitle.textContent + ' (' + popPrice.textContent + '), Quantity: ' + currentQuantity();
    whatsappOrderBtn.href = 'https://wa.me/923001234567?text=' + encodeURIComponent(message);
  }
  if (buyNowBtn) buyNowBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (mode !== 'product') return;
    const quantity = currentQuantity();
    for (let i = 0; i < quantity; i++) {
      cart.push({ name: popTitle.textContent, price: popPrice.textContent });
    }
    saveCart();
    renderCartView();
  });

  // ===== CLEAR CART =====
  if (clearBtn) {
    clearBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (cart.length === 0) return;
      if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        if (mode === 'cart') renderCartView();
        else addBtn.textContent = 'Add to Cart';
      }
    });
  }

  // ===== NAVBAR: mobile dropdown + close menu after link click =====
  const mainMenu = document.getElementById('mainMenu');
  const productsLink = document.querySelector('.nav-links .dropdown > .nav-link');
  const dropdownMenu = document.querySelector('.nav-links .dropdown-menu');

  if (productsLink && dropdownMenu) {
    productsLink.addEventListener('click', function (e) {
      if (window.innerWidth < 1200) {
        e.preventDefault();
        dropdownMenu.classList.toggle('show-menu');
      }
    });
  }

  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (link === productsLink && window.innerWidth < 1200) return;
      if (mainMenu && mainMenu.classList.contains('show') && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(mainMenu).hide();
      }
    });
  });
});
