
document.addEventListener('DOMContentLoaded', function() {
    // Данные товаров
    const products = [
        // СЕРЬГИ
        {
            id: 1,
            name: "Серьги с бриллиантами",
            category: "earrings",
            collection: "solo1920",
            price: 150000,
            image: "images/products/earrings1.jpg",
            description: "Элегантные серьги с бриллиантами",
            new: true
        },
        {
            id: 2,
            name: "Серьги-гвоздики с жемчугом",
            category: "earrings",
            collection: "wedding",
            price: 85000,
            image: "images/products/earrings2.jpg",
            description: "Классические серьги-гвоздики",
            new: false
        },
        {
            id: 3,
            name: "Серьги-подвески золотые",
            category: "earrings",
            collection: "royal",
            price: 120000,
            image: "images/products/earrings3.jpg",
            description: "Длинные серьги-подвески",
            new: true
        },
        // КОЛЬЦА
        {
            id: 4,
            name: "Обручальное кольцо",
            category: "rings",
            collection: "wedding",
            price: 75000,
            image: "images/products/ring1.jpg",
            description: "Классическое обручальное кольцо",
            new: false
        },
        {
            id: 5,
            name: "Кольцо с сапфиром",
            category: "rings",
            collection: "royal",
            price: 220000,
            image: "images/products/ring2.jpg",
            description: "Кольцо с натуральным сапфиром",
            new: true
        },
        {
            id: 6,
            name: "Коктейльное кольцо",
            category: "rings",
            collection: "solo1920",
            price: 180000,
            image: "images/products/ring3.jpg",
            description: "Яркое коктейльное кольцо",
            new: false
        },
        // ПОДВЕСКИ
        {
            id: 7,
            name: "Подвеска с жемчугом",
            category: "pendants",
            collection: "wedding",
            price: 95000,
            image: "images/products/pendant1.jpg",
            description: "Нежная подвеска с жемчугом",
            new: true
        },
        {
            id: 8,
            name: "Подвеска-сердце",
            category: "pendants",
            collection: "solo1920",
            price: 65000,
            image: "images/products/pendant2.jpg",
            description: "Подвеска в форме сердца",
            new: false
        },
        // БРАСЛЕТЫ
        {
            id: 9,
            name: "Браслет-цепочка",
            category: "bracelets",
            collection: "solo1920",
            price: 110000,
            image: "images/products/bracelet1.jpg",
            description: "Изящная цепочка-браслет",
            new: true
        },
        {
            id: 10,
            name: "Жемчужный браслет",
            category: "bracelets",
            collection: "wedding",
            price: 140000,
            image: "images/products/bracelet2.jpg",
            description: "Браслет с жемчугом",
            new: false
        },
        // ЖЕМЧУГ
        {
            id: 11,
            name: "Ожерелье из жемчуга",
            category: "pearls",
            collection: "royal",
            price: 250000,
            image: "images/products/pearl1.jpg",
            description: "Классическое жемчужное ожерелье",
            new: true
        },
        {
            id: 12,
            name: "Жемчужные серьги",
            category: "pearls",
            collection: "wedding",
            price: 125000,
            image: "images/products/pearl2.jpg",
            description: "Серьги с жемчугом",
            new: false
        },
        // ЧОКЕРЫ
        {
            id: 13,
            name: "Чокер с бриллиантом",
            category: "chokers",
            collection: "royal",
            price: 320000,
            image: "images/products/choker1.jpg",
            description: "Элегантный чокер",
            new: true
        },
        {
            id: 14,
            name: "Кружевной чокер",
            category: "chokers",
            collection: "solo1920",
            price: 89000,
            image: "images/products/choker2.jpg",
            description: "Нежный кружевной чокер",
            new: false
        }
    ];

    const productsGrid = document.getElementById('catalog-products');
    const productsCount = document.getElementById('products-count');
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    const collectionCheckboxes = document.querySelectorAll('input[name="collection"]');
    const priceSlider = document.querySelector('.price-slider');
    const minPriceSpan = document.getElementById('min-price');
    const maxPriceSpan = document.getElementById('max-price');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const sortSelect = document.getElementById('sort-by');

    let filteredProducts = [...products];
    let currentCategory = '';

    // Получаем категорию из URL
    function getCategoryFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('category');
    }

    // Форматирование цены
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    // Отображение товаров
    function renderProducts(productsToRender) {
        if (!productsGrid) return;
        
        productsGrid.innerHTML = '';
        
        if (productsToRender.length === 0) {
            productsGrid.innerHTML = '<p class="no-products">Товары не найдены</p>';
            productsCount.textContent = '0';
            return;
        }
        
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/default-product.jpg'">
                    ${product.new ? '<span class="product-badge">NEW</span>' : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">${formatPrice(product.price)} ₽</span>
                        <button class="btn-cart" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
        
        productsCount.textContent = productsToRender.length;
        
        // Добавляем обработчики для кнопок корзины
        document.querySelectorAll('.btn-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    }

    // Фильтрация товаров
    function filterProducts() {
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        const selectedCollections = Array.from(collectionCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        const maxPrice = parseInt(priceSlider.value);
        
        filteredProducts = products.filter(product => {
            // Фильтр по категории
            if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
                return false;
            }
            
            // Фильтр по коллекции
            if (selectedCollections.length > 0 && !selectedCollections.includes(product.collection)) {
                return false;
            }
            
            // Фильтр по цене
            if (product.price > maxPrice) {
                return false;
            }
            
            return true;
        });
        
        // Сортировка
        sortProducts();
        
        renderProducts(filteredProducts);
    }

    // Сортировка товаров
    function sortProducts() {
        const sortValue = sortSelect.value;
        
        switch(sortValue) {
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'new':
                filteredProducts.sort((a, b) => b.new - a.new);
                break;
            default: // popular
                // Здесь можно добавить логику популярности
                break;
        }
    }

    // Добавление в корзину
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Показываем уведомление
        showNotification(`"${product.name}" добавлен в корзину`);
        
        // Обновляем счетчик корзины (если есть в script.js)
        if (window.updateCartCount) {
            window.updateCartCount();
        }
    }

    // Уведомление
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Инициализация
    function init() {
        // Устанавливаем категорию из URL
        currentCategory = getCategoryFromURL();
        if (currentCategory) {
            // Автоматически выбираем чекбокс категории
            const categoryCheckbox = document.querySelector(`input[name="category"][value="${currentCategory}"]`);
            if (categoryCheckbox) {
                categoryCheckbox.checked = true;
            }
        }
        
        // Обновление цены на слайдере
        if (priceSlider) {
            priceSlider.addEventListener('input', function() {
                maxPriceSpan.textContent = formatPrice(this.value);
            });
        }
        
        // Обработчики фильтров
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', filterProducts);
        }
        
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', function() {
                categoryCheckboxes.forEach(cb => cb.checked = false);
                collectionCheckboxes.forEach(cb => cb.checked = false);
                if (priceSlider) {
                    priceSlider.value = 5000000;
                    maxPriceSpan.textContent = '5 000 000';
                }
                filterProducts();
            });
        }
        
        if (sortSelect) {
            sortSelect.addEventListener('change', filterProducts);
        }
        
        // Первоначальная загрузка товаров
        filterProducts();
    }
	
	// === ДОБАВЛЯЕМ ЭТИ ФУНКЦИИ ===

// Функция обновления счетчика корзины
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        if (el) {
            el.textContent = totalItems;
            el.style.display = totalItems > 0 ? 'inline-block' : 'none';
        }
    });
    
    console.log('Обновлен счетчик корзины. Товаров:', totalItems);
    return totalItems;
}

// Делаем функцию глобальной
window.updateCartCount = updateCartCount;

// === КОНЕЦ ДОБАВЛЕННЫХ ФУНКЦИЙ ===
// Отладочный код для проверки
console.log('Catalog.js загружен');

// Проверяем, есть ли localStorage
if (typeof localStorage !== 'undefined') {
    console.log('localStorage доступен');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Содержимое корзины:', cart);
} else {
    console.error('localStorage не доступен!');
}

// Принудительно инициализируем счетчик при загрузке
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        updateCartCount();
    }, 500);
});

    // Добавляем обработчики для корзины
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Клик по корзине');
            showCartModal();
        });
    }
    
    // Добавляем обработчики для закрытия модального окна
    const closeBtns = document.querySelectorAll('.modal-close');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = document.getElementById('cart-modal');
            if (modal) modal.style.display = 'none';
        });
    });
    
    // Инициализируем счетчик корзины
    updateCartCount();
	
	// Функция показа модального окна корзины
function showCartModal() {
    const modal = document.getElementById('cart-modal');
    if (!modal) {
        console.error('Модальное окно корзины не найдено!');
        return;
    }
    
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    console.log('Показываем корзину. Товаров:', cart.length);
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
        if (cartTotal) cartTotal.style.display = 'none';
    } else {
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" 
                         onerror="this.src='images/default-product.jpg'">
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${formatPrice(item.price)} ₽ × ${item.quantity}</p>
                    <p>Итого: ${formatPrice(item.price * item.quantity)} ₽</p>
                </div>
                <div class="cart-item-actions">
                    <button class="btn-remove" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(itemElement);
            total += item.price * item.quantity;
        });
        
        if (cartTotalPrice) cartTotalPrice.textContent = formatPrice(total);
        if (cartTotal) cartTotal.style.display = 'block';
    }
    
    modal.style.display = 'flex';
    
    // Добавляем обработчики удаления
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            removeFromCart(id);
            showCartModal(); // Обновляем корзину
        });
    });
}

// Функция удаления из корзины
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    console.log('Товар удален. Новая корзина:', cart);
}

// Делаем функции глобальными
window.showCartModal = showCartModal;
window.removeFromCart = removeFromCart;

    // Запуск
    init();
});

