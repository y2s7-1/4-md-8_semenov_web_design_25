// Данные о товарах
const productsData = [
    {
        id: 1,
        name: "Серьги-гвоздики с жемчугом",
        collection: "Solo 1920",
        price: 85000,
        oldPrice: 150000,
        discount: 65,
        category: "rings",
        material: "gold",
        isHit: true,
        isNew: false,
        image: "images/products/earrings2.jpg",
    },
    {
        id: 2,
        name: "Серьги с фианитами Millennium",
        collection: "Millennium",
        price: 47500,
        oldPrice: 94000,
        discount: 50,
        category: "earrings",
        material: "platinum",
        isHit: true,
        isNew: false,
        image: "images/products/earrings4.jpg",
    },
    {
        id: 3,
        name: "Подвеска с бриллиантом Royal",
        collection: "Royal",
        price: 329950,
        oldPrice: 659900,
        discount: 50,
        category: "necklaces",
        material: "gold",
        isHit: false,
        isNew: true,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Браслет Naomi",
        collection: "Naomi",
        price: 150650,
        oldPrice: 360100,
        discount: 65,
        category: "bracelets",
        material: "gold",
        isHit: true,
        isNew: true,
        image: "images/products/bracelet3.jpg"
    },
    {
        id: 5,
        name: "Кольцо помолвочное Wedding",
        collection: "Wedding",
        price: 41708,
        oldPrice: 54167,
        discount: 35,
        category: "rings",
        material: "gold",
        isHit: true,
        isNew: false,
        image: "images/products/ring4.jpg"
    },
    {
        id: 6,
        name: "Серьги золотые Festa",
        collection: "Festa",
        price: 34950,
        oldPrice: 69900,
        discount: 50,
        category: "earrings",
        material: "gold",
        isHit: false,
        isNew: false,
        image: "https://images.unsplash.com/photo-1594576722512-582d5577dc56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
];

// Корзина
let cart = JSON.parse(localStorage.getItem('miuz-cart')) || [];

// DOM элементы
const cartBtn = document.querySelector('.cart-btn');
const cartCount = document.querySelector('.cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const featuredProductsContainer = document.getElementById('featured-products');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Загрузка товаров на главной
    if (featuredProductsContainer) {
        loadFeaturedProducts();
    }
    
    // Инициализация модального окна
    initModal();
    
    // Инициализация меню
    initMobileMenu();
    
    // Инициализация форм
    initForms();
});

// Загрузка популярных товаров
function loadFeaturedProducts() {
    const featuredProducts = productsData.filter(p => p.isHit).slice(0, 4);
    
    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        featuredProductsContainer.appendChild(productCard);
    });
}

// Создание карточки товара
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    
    // Бейдж
    let badgeHtml = '';
    if (product.isHit) {
        badgeHtml = '<span class="product-badge hit">Хит</span>';
    } else if (product.isNew) {
        badgeHtml = '<span class="product-badge new">NEW</span>';
    }
    
    // Цена
    const priceHtml = product.oldPrice 
        ? `<div class="product-price">
                <span class="current-price">${formatPrice(product.price)} ₽</span>
                <span class="old-price">${formatPrice(product.oldPrice)} ₽</span>
                <span class="discount">-${product.discount}%</span>
            </div>`
        : `<div class="product-price">
                <span class="current-price">${formatPrice(product.price)} ₽</span>
            </div>`;
    
    card.innerHTML = `
        ${badgeHtml}
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h4 class="product-title">${product.name}</h4>
            ${priceHtml}
            <div class="product-actions">
                <button class="btn btn-outline add-to-cart-btn">В корзину</button>
                <button class="btn btn-primary buy-now-btn">Купить</button>
            </div>
        </div>
    `;
    
    // Обработчики событий
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    const buyNowBtn = card.querySelector('.buy-now-btn');
    
    addToCartBtn.addEventListener('click', () => {
        addToCart(product);
        showNotification('Товар добавлен в корзину!');
    });
    
    buyNowBtn.addEventListener('click', () => {
        addToCart(product);
        showNotification('Товар добавлен в корзину!');
        cartModal.classList.add('active');
        updateCartModal();
    });
    
    return card;
}

// Форматирование цены
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Работа с корзиной
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    saveCartToStorage();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    saveCartToStorage();
    
    if (cartItemsContainer) {
        updateCartModal();
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function saveCartToStorage() {
    localStorage.setItem('miuz-cart', JSON.stringify(cart));
}

// Модальное окно корзины
function initModal() {
    const modalCloseBtns = document.querySelectorAll('.modal-close');
    
    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
        updateCartModal();
    });
    
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });
    });
    
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });
    
    checkoutBtn.addEventListener('click', () => {
        alert('Спасибо за заказ! Мы свяжемся с вами в ближайшее время.');
        cart = [];
        updateCartCount();
        saveCartToStorage();
        updateCartModal();
        cartModal.classList.remove('active');
    });
}

function updateCartModal() {
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
        cartTotalPrice.textContent = '0';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">${formatPrice(item.price)} ₽ × ${item.quantity}</p>
                <button class="cart-item-remove" data-id="${item.id}">Удалить</button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
        
        // Обработчик удаления
        const removeBtn = cartItem.querySelector('.cart-item-remove');
        removeBtn.addEventListener('click', () => {
            removeFromCart(item.id);
        });
        
        totalPrice += item.price * item.quantity;
    });
    
    cartTotalPrice.textContent = formatPrice(totalPrice);
}

// Мобильное меню
function initMobileMenu() {
    if (!mobileMenuBtn || !navMenu) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Закрытие меню при клике на ссылку
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Формы
function initForms() {
    const subscriptionForm = document.querySelector('.subscription-form');
    
    if (subscriptionForm) {
        subscriptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Здесь должна быть отправка на сервер
            alert(`Спасибо за подписку! На адрес ${email} будут приходить новости и акции.`);
            this.reset();
        });
    }
}

// Уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--success-color);
        color: white;
        padding: 15px 20px;
        border-radius: var(--border-radius);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Добавляем стили для анимации уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

