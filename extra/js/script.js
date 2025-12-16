/* ============================================
   10.GRAN - GLOBAL JAVASCRIPT
   ============================================ */

// Cart Management
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('10gran_cart')) || [];
        this.updateCartUI();
    }

    addItem(item) {
        const existingItem = this.cart.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...item, quantity: 1 });
        }
        this.saveCart();
        this.updateCartUI();
    }

    removeItem(itemId) {
        this.cart = this.cart.filter(i => i.id !== itemId);
        this.saveCart();
        this.updateCartUI();
    }

    saveCart() {
        localStorage.setItem('10gran_cart', JSON.stringify(this.cart));
    }

    updateCartUI() {
        const cartCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartButton = document.querySelector('.cart-button');
        if (cartButton) {
            let countBadge = cartButton.querySelector('.cart-count');
            if (cartCount > 0) {
                if (!countBadge) {
                    countBadge = document.createElement('span');
                    countBadge.className = 'cart-count';
                    cartButton.appendChild(countBadge);
                }
                countBadge.textContent = cartCount;
            } else if (countBadge) {
                countBadge.remove();
            }
        }
    }

    getCart() {
        return this.cart;
    }

    getTotalPrice() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
}

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }
}

// Cookie Banner
function initCookieBanner() {
    const banner = document.querySelector('.cookie-banner');
    if (!banner) return;

    const cookieConsent = localStorage.getItem('10gran_cookie_consent');
    if (cookieConsent) {
        banner.classList.add('hidden');
    }

    const acceptButton = banner.querySelector('button');
    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('10gran_cookie_consent', 'true');
            banner.classList.add('hidden');
        });
    }
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Lazy Loading Images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Cart Button Click Handler
function initCartButton() {
    const cartButton = document.querySelector('.cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            const cart = cartManager.getCart();
            if (cart.length === 0) {
                alert('Ваша корзина пуста');
            } else {
                const total = cartManager.getTotalPrice();
                alert(`В корзине ${cart.length} товаров на сумму ${total.toLocaleString('ru-RU')} ₽`);
            }
        });
    }
}

// Initialize Cart Manager
let cartManager;

// Main Initialization
document.addEventListener('DOMContentLoaded', () => {
    cartManager = new CartManager();
    initMobileMenu();
    initCookieBanner();
    initSmoothScroll();
    initLazyLoading();
    initCartButton();

    // Add animation to elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});

// Utility Functions
function formatPrice(price) {
    return price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('about')) return 'about';
    if (path.includes('certificates')) return 'certificates';
    if (path.includes('contacts')) return 'contacts';
    if (path.includes('gold')) return 'gold';
    if (path.includes('service')) return 'service';
    if (path.includes('stories')) return 'stories';
    return 'home';
}

// Highlight active navigation link
function highlightActiveNav() {
    const currentPage = getCurrentPage();
    document.querySelectorAll('.nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(currentPage) || 
            (currentPage === 'home' && link.getAttribute('href') === '/')) {
            link.classList.add('active');
        }
    });
}

// Call highlight on page load
document.addEventListener('DOMContentLoaded', highlightActiveNav);
