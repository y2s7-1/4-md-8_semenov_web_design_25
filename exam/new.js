// Логика для страницы новинок
document.addEventListener('DOMContentLoaded', function() {
    // Загрузка новинок
    loadNewProducts();
    
    // Инициализация фильтров
    initNewFilters();
    
    // Инициализация кнопок покупки
    initBuyButtons();
    
    // Инициализация формы подписки
    initNewSubscription();
});

// Загрузка новинок
function loadNewProducts() {
    const newContainer = document.getElementById('new-products');
    if (!newContainer) return;
    
    // Фильтруем товары с меткой "новинка"
    const newProducts = productsData.filter(p => p.isNew);
    
    if (newProducts.length === 0) {
        newContainer.innerHTML = '<p class="no-products">Новинок пока нет</p>';
        return;
    }
    
    newProducts.forEach(product => {
        const productCard = createProductCard(product);
        newContainer.appendChild(productCard);
    });
}

// Инициализация фильтров
function initNewFilters() {
    const filterButtons = document.querySelectorAll('.new-filter-btn');
    const newContainer = document.getElementById('new-products');
    
    if (!filterButtons.length || !newContainer) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Показываем соответствующие товары
            const allProducts = newContainer.querySelectorAll('.product-card');
            
            allProducts.forEach(product => {
                product.style.display = 'block';
                setTimeout(() => {
                    product.style.opacity = '1';
                    product.style.transform = 'translateY(0)';
                }, 10);
            });
            
            showNotification(`Фильтр: ${this.textContent}`);
        });
    });
}

// Инициализация кнопок покупки
function initBuyButtons() {
    const buyButtons = document.querySelectorAll('.limited-card .btn-primary');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.limited-card');
            const productName = card.querySelector('h3').textContent;
            const productPrice = card.querySelector('.limited-price').textContent;
            
            // Создаем объект товара для корзины
            const limitedProduct = {
                id: Date.now(), // Временный ID
                name: productName,
                price: parseInt(productPrice.replace(/\s/g, '').replace('₽', '')),
                image: card.querySelector('img').src,
                quantity: 1
            };
            
            addToCart(limitedProduct);
            showNotification(`Лимитированное изделие "${productName}" добавлено в корзину!`);
            
            // Обновляем количество оставшихся товаров
            const countElement = card.querySelector('.limited-count');
            const currentCount = countElement.textContent.match(/\d+/)[0];
            const newCount = parseInt(currentCount) - 1;
            
            if (newCount > 0) {
                countElement.textContent = `Осталось ${newCount} шт`;
                
                // Обновляем бейдж
                const badge = card.querySelector('.limited-badge');
                const total = badge.textContent.split('/')[1];
                badge.textContent = `${newCount}/${total}`;
                
                if (newCount <= 5) {
                    countElement.style.color = 'var(--discount-color)';
                    countElement.style.fontWeight = '700';
                }
            } else {
                countElement.textContent = 'Раскуплено';
                countElement.style.color = 'var(--discount-color)';
                this.textContent = 'Раскуплено';
                this.disabled = true;
                this.classList.remove('btn-primary');
                this.classList.add('btn-outline');
            }
        });
    });
}

// Инициализация формы подписки
function initNewSubscription() {
    const subscriptionForm = document.querySelector('.new-subscription-form');
    
    if (subscriptionForm) {
        subscriptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // В реальном проекте здесь отправка на сервер
            console.log('Подписка на новинки:', email);
            
            // Показываем уведомление
            showNotification('Вы подписались на уведомления о новинках!');
            
            // Очищаем форму
            this.reset();
        });
    }
}