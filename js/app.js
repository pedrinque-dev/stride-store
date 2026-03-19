/* === STRIDE STORE - MAIN APP === */

const StrideApp = (() => {

  /* ============================================================
     STATE
  ============================================================ */
  const state = {
    cart: [],
    wishlist: [],
    user: JSON.parse(localStorage.getItem('stride_user') || 'null'),
  };

  /* ============================================================
     UTILS - STORAGE KEYS
  ============================================================ */
  function getStorageKey(baseKey) {
    return state.user ? `${baseKey}_${state.user.email}` : baseKey;
  }

  /* ============================================================
     PERSIST
  ============================================================ */
  function saveCart() {
    const key = getStorageKey('stride_cart');
    localStorage.setItem(key, JSON.stringify(state.cart));
  }

  function saveWishlist() {
    const key = getStorageKey('stride_wishlist');
    localStorage.setItem(key, JSON.stringify(state.wishlist));
  }

  function loadUserData() {
    if (state.user) {
      const cartKey = getStorageKey('stride_cart');
      const wishlistKey = getStorageKey('stride_wishlist');
      
      state.cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      state.wishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
    } else {
      state.cart = [];
      state.wishlist = [];
    }
    
    updateCartUI();
    renderCartItems();
    renderWishlistItems();
    syncWishlistButtons();
  }

  function saveUser(user) {
    state.user = user;
    loadUserData();
    localStorage.setItem('stride_user', JSON.stringify(user));
  }

  function logout() {
    state.user = null;
    localStorage.removeItem('stride_user');
    
    // Limpar carrinho e wishlist ao deslogar
    state.cart = [];
    state.wishlist = [];
    
    // Fechar drawers se estiverem abertos
    closeDrawer('cart-drawer');
    closeDrawer('wishlist-drawer');
    
    // Atualizar todas as interfaces
    updateUserUI();
    updateCartUI();
    renderCartItems();
    renderWishlistItems();
    syncWishlistButtons();
    
    showToast('Até logo! Você saiu da conta.', 'info');
  }

  /* ============================================================
     AUTH GUARD
  ============================================================ */
  function requireAuth(action) {
    if (state.user) {
      action();
    } else {
      showToast('Faça login para continuar.', 'error');
      openModal('auth-modal');
    }
  }

  /* ============================================================
     CART
  ============================================================ */
  function addToCart(product) {
    const existing = state.cart.find(
      item => item.id === product.id && item.size === product.size
    );
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({ ...product, qty: 1 });
    }
    saveCart();
    updateCartUI();
    showToast(`${product.name} adicionado ao carrinho!`, 'success');
  }

  function removeFromCart(id, size) {
    state.cart = state.cart.filter(
      item => !(item.id === id && item.size === size)
    );
    saveCart();
    updateCartUI();
    renderCartItems();
  }

  function changeQty(id, size, delta) {
    const item = state.cart.find(
      i => i.id === id && i.size === size
    );
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    saveCart();
    updateCartUI();
    renderCartItems();
  }

  function cartTotal() {
    return state.cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
      return sum + price * item.qty;
    }, 0);
  }

  function cartCount() {
    return state.cart.reduce((sum, i) => sum + i.qty, 0);
  }

  /* ============================================================
     WISHLIST
  ============================================================ */
  function toggleWishlist(product) {
    const idx = state.wishlist.findIndex(i => i.id === product.id);
    if (idx > -1) {
      state.wishlist.splice(idx, 1);
      saveWishlist();
      showToast(`${product.name} removido dos favoritos.`, 'info');
      return false;
    } else {
      state.wishlist.push(product);
      saveWishlist();
      showToast(`${product.name} adicionado aos favoritos!`, 'success');
      return true;
    }
  }

  function isWishlisted(id) {
    return state.wishlist.some(i => i.id === id);
  }

  /* ============================================================
     UI - CART BADGE & COUNTER
  ============================================================ */
  function updateCartUI() {
    const badges = document.querySelectorAll('.js-cart-count');
    const count = cartCount();
    badges.forEach(b => {
      b.textContent = count;
      b.classList.toggle('cart-badge--visible', count > 0);
    });
  }

  function updateUserUI() {
    const loginBtn = document.querySelector('.js-login-btn');
    const userMenu = document.querySelector('.js-user-menu');
    const userName = document.querySelector('.js-user-name');

    if (!loginBtn || !userMenu) return;

    if (state.user) {
      loginBtn.classList.add('hidden');
      userMenu.classList.remove('hidden');
      if (userName) userName.textContent = state.user.name.split(' ')[0];
    } else {
      loginBtn.classList.remove('hidden');
      userMenu.classList.add('hidden');
    }
  }

  /* ============================================================
     RENDER CART DRAWER
  ============================================================ */
  function renderCartItems() {
    const container = document.querySelector('.js-cart-items');
    const totalEl = document.querySelector('.js-cart-total');
    if (!container) return;

    if (state.cart.length === 0) {
      container.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.</p>';
      if (totalEl) totalEl.textContent = 'R$ 0,00';
      return;
    }

    container.innerHTML = state.cart.map(item => `
            <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
                <img src="${item.img}" alt="${item.name}" class="cart-item__img">
                <div class="cart-item__info">
                    <p class="cart-item__name">${item.name}</p>
                    <p class="cart-item__size">Tam: ${item.size}</p>
                    <p class="cart-item__price">${item.price}</p>
                </div>
                <div class="cart-item__qty">
                    <button class="qty-btn js-qty-minus" data-id="${item.id}" data-size="${item.size}" aria-label="Diminuir">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="qty-value">${item.qty}</span>
                    <button class="qty-btn js-qty-plus" data-id="${item.id}" data-size="${item.size}" aria-label="Aumentar">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="cart-item__remove js-remove-item" data-id="${item.id}" data-size="${item.size}" aria-label="Remover">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

    if (totalEl) {
      totalEl.textContent = `R$ ${cartTotal().toFixed(2).replace('.', ',')}`;
    }

    bindCartItemEvents();
  }

  function bindCartItemEvents() {
    document.querySelectorAll('.js-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        changeQty(btn.dataset.id, btn.dataset.size, -1);
      });
    });
    document.querySelectorAll('.js-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        changeQty(btn.dataset.id, btn.dataset.size, 1);
      });
    });
    document.querySelectorAll('.js-remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFromCart(btn.dataset.id, btn.dataset.size);
      });
    });
  }

  /* ============================================================
     RENDER WISHLIST DRAWER
  ============================================================ */
  function renderWishlistItems() {
    const container = document.querySelector('.js-wishlist-items');
    if (!container) return;

    if (state.wishlist.length === 0) {
      container.innerHTML = '<p class="cart-empty">Nenhum item nos favoritos.</p>';
      return;
    }

    container.innerHTML = state.wishlist.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}" class="cart-item__img">
                <div class="cart-item__info">
                    <p class="cart-item__name">${item.name}</p>
                    <p class="cart-item__price">${item.price}</p>
                </div>
                <button class="cart-item__remove js-remove-wishlist" data-id="${item.id}" aria-label="Remover dos favoritos">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

    document.querySelectorAll('.js-remove-wishlist').forEach(btn => {
      btn.addEventListener('click', () => {
        state.wishlist = state.wishlist.filter(i => i.id !== btn.dataset.id);
        saveWishlist();
        renderWishlistItems();
        syncWishlistButtons();
      });
    });
  }

  /* ============================================================
     TOAST NOTIFICATIONS
  ============================================================ */
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('toast--visible'));

    setTimeout(() => {
      toast.classList.remove('toast--visible');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  /* ============================================================
     MODAL SYSTEM (Cart, Wishlist, Auth)
  ============================================================ */
  function openDrawer(id) {
    const drawer = document.getElementById(id);
    if (!drawer) return;
    drawer.classList.add('drawer--open');
    document.body.classList.add('overlay--active');
  }

  function closeDrawer(id) {
    const drawer = document.getElementById(id);
    if (!drawer) return;
    drawer.classList.remove('drawer--open');
    if (!document.querySelector('.drawer--open')) {
      document.body.classList.remove('overlay--active');
    }
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('modal--open');
    document.body.classList.add('overlay--active');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('modal--open');
    if (!document.querySelector('.modal--open') && !document.querySelector('.drawer--open')) {
      document.body.classList.remove('overlay--active');
    }
  }

  /* ============================================================
     AUTH
  ============================================================ */
  function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('stride_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);

    if (!found) {
      showFormError('login-error', 'E-mail ou senha incorretos.');
      return;
    }

    saveUser({ name: found.name, email: found.email });
    closeModal('auth-modal');
    updateUserUI();
    showToast(`Bem-vindo de volta, ${found.name.split(' ')[0]}!`, 'success');
  }

  function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    if (password !== confirm) {
      showFormError('reg-error', 'As senhas não coincidem.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('stride_users') || '[]');
    if (users.find(u => u.email === email)) {
      showFormError('reg-error', 'Este e-mail já está cadastrado.');
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem('stride_users', JSON.stringify(users));

    saveUser({ name, email });
    closeModal('auth-modal');
    updateUserUI();
    showToast(`Conta criada! Bem-vindo, ${name.split(' ')[0]}!`, 'success');
  }

  function showFormError(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.classList.add('visible');
    setTimeout(() => el.classList.remove('visible'), 4000);
  }

  /* ============================================================
     SIZE SELECTION (detail pages)
  ============================================================ */
  function initSizeSelection() {
    const sizeGrid = document.querySelector('.detalhe__size-grid');
    if (!sizeGrid) return;

    sizeGrid.querySelectorAll('.detalhe__size-btn:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        sizeGrid.querySelectorAll('.detalhe__size-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  }

  /* ============================================================
     BUY / ADD TO CART (detail pages)
  ============================================================ */
  function initDetailActions() {
    const buyBtn = document.querySelector('.js-buy-now');
    const addBtn = document.querySelector('.js-add-cart');
    if (!buyBtn && !addBtn) return;

    function getSelectedSize() {
      const selected = document.querySelector('.detalhe__size-btn.selected');
      return selected ? selected.textContent.trim() : null;
    }

    function getProductData() {
      return {
        id: document.body.dataset.productId || 'unknown',
        name: document.querySelector('.detalhe__title')?.textContent.trim() || '',
        price: document.querySelector('.detalhe__price--current')?.textContent.trim() || '',
        img: document.querySelector('.detalhe__img')?.getAttribute('src') || '',
      };
    }

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        requireAuth(() => {
          const size = getSelectedSize();
          if (!size) {
            showToast('Selecione um tamanho antes de continuar.', 'error');
            highlightSizeGrid();
            return;
          }
          addToCart({ ...getProductData(), size });
        });
      });
    }

    if (buyBtn) {
      buyBtn.addEventListener('click', () => {
        requireAuth(() => {
          const size = getSelectedSize();
          if (!size) {
            showToast('Selecione um tamanho antes de continuar.', 'error');
            highlightSizeGrid();
            return;
          }
          addToCart({ ...getProductData(), size });
          openDrawer('cart-drawer');
          renderCartItems();
        });
      });
    }
  }

  function highlightSizeGrid() {
    const grid = document.querySelector('.detalhe__size-grid');
    if (!grid) return;
    grid.classList.add('size-grid--error');
    setTimeout(() => grid.classList.remove('size-grid--error'), 1500);
  }

  /* ============================================================
     WISHLIST BUTTONS (detail & cards)
  ============================================================ */
  function initWishlistButtons() {
    document.querySelectorAll('.js-wishlist-btn').forEach(btn => {
      const id = btn.dataset.productId;
      if (isWishlisted(id)) btn.classList.add('wishlisted');

      btn.addEventListener('click', () => {
        requireAuth(() => {
          const product = {
            id,
            name: btn.dataset.productName || '',
            price: btn.dataset.productPrice || '',
            img: btn.dataset.productImg || '',
          };
          const added = toggleWishlist(product);
          btn.classList.toggle('wishlisted', added);
          const icon = btn.querySelector('i');
          if (icon) {
            icon.className = added ? 'fas fa-heart' : 'far fa-heart';
          }
        });
      });
    });
  }

  function syncWishlistButtons() {
    document.querySelectorAll('.js-wishlist-btn').forEach(btn => {
      const id = btn.dataset.productId;
      const active = isWishlisted(id);
      btn.classList.toggle('wishlisted', active);
      const icon = btn.querySelector('i');
      if (icon) icon.className = active ? 'fas fa-heart' : 'far fa-heart';
    });
  }

  /* ============================================================
     AUTH TAB SWITCHING
  ============================================================ */
  function initAuthTabs() {
    const tabs = document.querySelectorAll('.js-auth-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.dataset.tab;
        document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById(`panel-${target}`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ============================================================
     GLOBAL EVENT BINDINGS
  ============================================================ */
  function bindGlobalEvents() {
    /* Cart drawer toggle */
    document.querySelectorAll('.js-open-cart').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        renderCartItems();
        openDrawer('cart-drawer');
      });
    });

    /* Wishlist drawer toggle */
    document.querySelectorAll('.js-open-wishlist').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        renderWishlistItems();
        openDrawer('wishlist-drawer');
      });
    });

    /* Close drawers */
    document.querySelectorAll('.js-close-drawer').forEach(el => {
      el.addEventListener('click', () => {
        closeDrawer(el.dataset.drawer);
      });
    });

    /* Auth modal open */
    document.querySelectorAll('.js-open-auth').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        openModal('auth-modal');
      });
    });

    /* Auth modal close */
    document.querySelectorAll('.js-close-modal').forEach(el => {
      el.addEventListener('click', () => {
        closeModal(el.dataset.modal);
      });
    });

    /* Overlay click to close */
    document.getElementById('overlay')?.addEventListener('click', () => {
      document.querySelectorAll('.drawer--open').forEach(d => d.classList.remove('drawer--open'));
      document.querySelectorAll('.modal--open').forEach(m => m.classList.remove('modal--open'));
      document.body.classList.remove('overlay--active');
    });

    /* Login form */
    document.getElementById('login-form')?.addEventListener('submit', handleLogin);

    /* Register form */
    document.getElementById('register-form')?.addEventListener('submit', handleRegister);

    /* Logout */
    document.querySelector('.js-logout')?.addEventListener('click', e => {
      e.preventDefault();
      logout();
    });

    /* User dropdown toggle */
    document.querySelector('.js-user-menu-toggle')?.addEventListener('click', e => {
      e.stopPropagation();
      document.querySelector('.user-dropdown')?.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      document.querySelector('.user-dropdown')?.classList.remove('open');
    });

    /* Checkout button */
    document.querySelector('.js-checkout')?.addEventListener('click', () => {
      if (state.cart.length === 0) {
        showToast('Seu carrinho está vazio.', 'error');
        return;
      }
      showToast('Redirecionando para o pagamento...', 'info');
    });
  }

  /* ============================================================
     INIT
  ============================================================ */
  function init() {
    // Carregar dados do usuário se estiver logado
    loadUserData();
    
    bindGlobalEvents();
    initSizeSelection();
    initDetailActions();
    initWishlistButtons();
    initAuthTabs();
    updateCartUI();
    updateUserUI();
  }

  return { init, showToast };

})();

document.addEventListener('DOMContentLoaded', StrideApp.init);
