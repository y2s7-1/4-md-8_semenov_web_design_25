// Логика для страницы товара
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация галереи изображений
    initImageGallery();
    
    // Инициализация вкладок
    initTabs();
    
    // Инициализация опций товара
    initProductOptions();
    
    // Инициализация счетчика количества
    initQuantitySelector();
    
    // Инициализация кнопок действий
    initActionButtons();
    
    // Инициализация похожих товаров
    initRelatedProducts();
    
    // Инициализация просмотренных товаров
    initViewedProducts();
    
    // Инициализация отзывов
    initReviews();
    
    // Инициализация увеличения изображения
    initZoom();
});

// Инициализация галереи изображений
function initImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    const zoomImage = document.getElementById('zoom-image');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const imageUrl = this.dataset.image;
            
            // Обновляем основное изображение
            mainImage.src = imageUrl;
            mainImage.alt = this.querySelector('img').alt;
            
            // Обновляем изображение для зума
            zoomImage.src = imageUrl;
            
            // Обновляем активную миниатюру
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Добавляем анимацию
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.style.opacity = '1';
            }, 100);
        });
    });
}

// Инициализация вкладок
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Убираем активный класс у всех кнопок и контента
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке и соответствующему контенту
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Прокручиваем к вкладкам
            const tabsSection = document.querySelector('.product-details-tabs');
            if (tabsSection && window.innerWidth < 768) {
                tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Инициализация опций товара
function initProductOptions() {
    const optionValues = document.querySelectorAll('.option-value');
    
    optionValues.forEach(option => {
        option.addEventListener('click', function() {
            const optionGroup = this.dataset.option;
            const value = this.dataset.value;
            
            // Убираем активный класс у всех опций в группе
            const groupOptions = document.querySelectorAll(`[data-option="${optionGroup}"]`);
            groupOptions.forEach(opt => opt.classList.remove('active'));
            
            // Добавляем активный класс выбранной опции
            this.classList.add('active');
            
            // Обновляем цену в зависимости от выбранных опций
            updatePriceBasedOnOptions();
            
            // Сохраняем выбор в локальное хранилище
            saveOptionSelection(optionGroup, value);
            
            showNotification(`Выбрано: ${this.textContent.trim()}`);
        });
    });
}

// Обновление цены на основе выбранных опций
function updatePriceBasedOnOptions() {
    const currentPriceElement = document.querySelector('.current-price');
    let basePrice = 45200; // Базовая цена
    
    // Получаем выбранные опции
    const selectedMaterial = document.querySelector('[data-option="material"].active');
    const selectedSize = document.querySelector('[data-option="size"].active');
    const selectedClasp = document.querySelector('[data-option="clasp"].active');
    
    // Коэффициенты цены в зависимости от опций
    const materialMultipliers = {
        'gold': 1.0,     // Белое золото - базовая цена
        'silver': 0.7,   // Серебро -30%
        'platinum': 1.5  // Платина +50%
    };
    
    const sizeMultipliers = {
        '8': 1.0,   // 8 мм - базовая цена
        '9': 1.15,  // 9 мм +15%
        '10': 1.3   // 10 мм +30%
    };
    
    const claspMultipliers = {
        'french': 1.0,   // Французский замок - базовая цена
        'english': 1.1,  // Английский замок +10%
        'clip': 0.9      // Клипсы -10%
    };
    
    // Вычисляем новую цену
    let newPrice = basePrice;
    
    if (selectedMaterial) {
        const material = selectedMaterial.dataset.value;
        newPrice *= materialMultipliers[material] || 1;
    }
    
    if (selectedSize) {
        const size = selectedSize.dataset.value;
        newPrice *= sizeMultipliers[size] || 1;
    }
    
    if (selectedClasp) {
        const clasp = selectedClasp.dataset.value;
        newPrice *= claspMultipliers[clasp] || 1;
    }
    
    // Округляем до ближайших 100 рублей
    newPrice = Math.round(newPrice / 100) * 100;
    
    // Обновляем цену на странице
    if (currentPriceElement) {
        currentPriceElement.textContent = `${newPrice.toLocaleString('ru-RU')} ₽`;
        
        // Также обновляем старую цену (с наценкой 25%)
        const oldPriceElement = document.querySelector('.old-price');
        if (oldPriceElement) {
            const oldPrice = Math.round(newPrice * 1.25 / 100) * 100;
            oldPriceElement.textContent = `${oldPrice.toLocaleString('ru-RU')} ₽`;
        }
    }
}

// Сохранение выбранных опций
function saveOptionSelection(option, value) {
    let selectedOptions = JSON.parse(localStorage.getItem('marialit-selected-options')) || {};
    selectedOptions[option] = value;
    localStorage.setItem('marialit-selected-options', JSON.stringify(selectedOptions));
}

// Инициализация счетчика количества
function initQuantitySelector() {
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const quantityInput = document.querySelector('.quantity-input');
    
    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            const max = parseInt(quantityInput.max);
            if (value < max) {
                quantityInput.value = value + 1;
            }
        });
        
        // Запрещаем ручной ввод некорректных значений
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            const min = parseInt(this.min);
            const max = parseInt(this.max);
            
            if (isNaN(value) || value < min) {
                this.value = min;
            } else if (value > max) {
                this.value = max;
            }
        });
    }
}

// Инициализация кнопок действий
function initActionButtons() {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    const wishlistBtn = document.getElementById('wishlist-btn');
    
    // Данные текущего товара
    const productData = {
        id: 101, // ID товара
        name: "Серьги с жемчугом Aurora",
        price: 45200,
        oldPrice: 56500,
        discount: 20,
        image: "https://images.unsplash.com/photo-1594576722512-582d5577dc56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        collection: "Ocean Pearl",
        category: "earrings"
    };
    
    // Добавление в корзину
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(document.querySelector('.quantity-input').value);
            
            // Получаем выбранные опции
            const selectedOptions = getSelectedOptions();
            
            // Создаем объект товара с опциями
            const productWithOptions = {
                ...productData,
                ...selectedOptions,
                quantity: quantity,
                totalPrice: productData.price * quantity
            };
            
            addToCart(productWithOptions);
            showNotification('Товар добавлен в корзину!');
            
            // Показываем модальное окно корзины
            const cartModal = document.getElementById('cart-modal');
            if (cartModal) {
                cartModal.classList.add('active');
                updateCartModal();
            }
        });
    }
    
    // Купить сейчас
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            const quantity = parseInt(document.querySelector('.quantity-input').value);
            
            // Получаем выбранные опции
            const selectedOptions = getSelectedOptions();
            
            // Создаем объект товара с опциями
            const productWithOptions = {
                ...productData,
                ...selectedOptions,
                quantity: quantity,
                totalPrice: productData.price * quantity
            };
            
            addToCart(productWithOptions);
            
            // Показываем уведомление
            showNotification('Товар добавлен в корзину! Переходим к оформлению...');
            
            // В реальном проекте здесь переход к оформлению заказа
            setTimeout(() => {
                alert('Переход к оформлению заказа. В реальном проекте здесь будет страница оформления.');
            }, 1000);
        });
    }
    
    // Добавление в избранное
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            
            if (isActive) {
                this.classList.remove('active');
                this.innerHTML = '<i class="far fa-heart"></i> В избранное';
                showNotification('Товар удален из избранного');
                
                // Удаляем из локального хранилища
                removeFromWishlist(productData.id);
            } else {
                this.classList.add('active');
                this.innerHTML = '<i class="fas fa-heart"></i> В избранном';
                showNotification('Товар добавлен в избранное');
                
                // Добавляем в локальное хранилище
                addToWishlist(productData);
            }
        });
        
        // Проверяем, есть ли товар в избранном
        checkWishlistStatus(productData.id);
    }
}

// Получение выбранных опций
function getSelectedOptions() {
    const options = {};
    
    // Материал
    const materialElement = document.querySelector('[data-option="material"].active');
    if (materialElement) {
        options.material = materialElement.dataset.value;
        options.materialName = materialElement.textContent.trim();
    }
    
    // Размер
    const sizeElement = document.querySelector('[data-option="size"].active');
    if (sizeElement) {
        options.size = sizeElement.dataset.value;
        options.sizeName = sizeElement.textContent.trim();
    }
    
    // Застежка
    const claspElement = document.querySelector('[data-option="clasp"].active');
    if (claspElement) {
        options.clasp = claspElement.dataset.value;
        options.claspName = claspElement.textContent.trim();
    }
    
    return options;
}

// Работа с избранным
function addToWishlist(product) {
    let wishlist = JSON.parse(localStorage.getItem('marialit-wishlist')) || [];
    
    // Проверяем, нет ли уже этого товара в избранном
    if (!wishlist.some(item => item.id === product.id)) {
        wishlist.push(product);
        localStorage.setItem('marialit-wishlist', JSON.stringify(wishlist));
    }
}

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('marialit-wishlist')) || [];
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('marialit-wishlist', JSON.stringify(wishlist));
}

function checkWishlistStatus(productId) {
    const wishlistBtn = document.getElementById('wishlist-btn');
    if (!wishlistBtn) return;
    
    const wishlist = JSON.parse(localStorage.getItem('marialit-wishlist')) || [];
    const isInWishlist = wishlist.some(item => item.id === productId);
    
    if (isInWishlist) {
        wishlistBtn.classList.add('active');
        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> В избранном';
    }
}

// Инициализация похожих товаров
function initRelatedProducts() {
    const relatedContainer = document.getElementById('related-products');
    if (!relatedContainer) return;
    
    // Фильтруем похожие товары (серьги из той же коллекции или категории)
    const relatedProducts = productsData.filter(p => 
        (p.category === 'earrings' || p.collection === 'Ocean Pearl') && 
        p.id !== 101 // Исключаем текущий товар
    ).slice(0, 4); // Берем максимум 4 товара
    
    if (relatedProducts.length === 0) {
        relatedContainer.innerHTML = '<p class="no-products">Похожих товаров не найдено</p>';
        return;
    }
    
    relatedProducts.forEach(product => {
        const productCard = createProductCard(product);
        relatedContainer.appendChild(productCard);
    });
}

// Инициализация просмотренных товаров
function initViewedProducts() {
    const viewedContainer = document.getElementById('viewed-products');
    if (!viewedContainer) return;
    
    // Получаем просмотренные товары из локального хранилища
    let viewedProducts = JSON.parse(localStorage.getItem('marialit-viewed')) || [];
    
    // Добавляем текущий товар в просмотренные
    const currentProduct = {
        id: 101,
        name: "Серьги с жемчугом Aurora",
        price: 45200,
        oldPrice: 56500,
        discount: 20,
        image: "https://images.unsplash.com/photo-1594576722512-582d5577dc56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "earrings"
    };
    
    // Удаляем текущий товар, если он уже есть в списке
    viewedProducts = viewedProducts.filter(p => p.id !== currentProduct.id);
    
    // Добавляем текущий товар в начало
    viewedProducts.unshift(currentProduct);
    
    // Ограничиваем список 4 товарами
    viewedProducts = viewedProducts.slice(0, 4);
    
    // Сохраняем обновленный список
    localStorage.setItem('marialit-viewed', JSON.stringify(viewedProducts));
    
    // Отображаем просмотренные товары (исключая текущий)
    const otherViewed = viewedProducts.filter(p => p.id !== currentProduct.id);
    
    if (otherViewed.length === 0) {
        viewedContainer.closest('.viewed-products').style.display = 'none';
        return;
    }
    
    otherViewed.forEach(product => {
        const productCard = createProductCard(product);
        viewedContainer.appendChild(productCard);
    });
}

// Инициализация отзывов
function initReviews() {
    const loadMoreBtn = document.getElementById('load-more-reviews');
    const addReviewBtn = document.getElementById('add-review-btn');
    const reviewModal = document.getElementById('review-modal');
    const reviewForm = document.getElementById('review-form');
    const ratingStars = document.querySelectorAll('#review-rating .fa-star');
    const ratingValue = document.getElementById('rating-value');
    
    // Загрузка дополнительных отзывов
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // В реальном проекте здесь загрузка с сервера
            showNotification('Загрузка дополнительных отзывов...');
            this.style.display = 'none';
            
            // Добавляем дополнительные отзывы
            const reviewsContainer = document.querySelector('.reviews-container');
            const additionalReviews = [
                {
                    author: "Ольга Николаева",
                    date: "28 апреля 2024",
                    rating: 5,
                    text: "Потрясающие серьги! Носить одно удовольствие. Все подруги спрашивают, где купила. Качество на высоте, жемчуг просто сияет."
                },
                {
                    author: "Ирина Козлова",
                    date: "20 апреля 2024",
                    rating: 4,
                    text: "Хорошие серьги, но ждала доставку почти неделю. Качество отличное, упаковка красивая. Рекомендую!"
                }
            ];
            
            additionalReviews.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review-item';
                reviewElement.innerHTML = `
                    <div class="review-header">
                        <div class="review-author">${review.author}</div>
                        <div class="review-date">${review.date}</div>
                    </div>
                    <div class="review-rating">
                        <div class="stars">
                            ${'<i class="fas fa-star"></i>'.repeat(review.rating)}
                            ${review.rating < 5 ? '<i class="far fa-star"></i>'.repeat(5 - review.rating) : ''}
                        </div>
                    </div>
                    <div class="review-text">
                        <p>${review.text}</p>
                    </div>
                `;
                
                reviewsContainer.insertBefore(reviewElement, loadMoreBtn);
            });
        });
    }
    
    // Добавление отзыва
    if (addReviewBtn) {
        addReviewBtn.addEventListener('click', function() {
            if (reviewModal) {
                reviewModal.classList.add('active');
            }
        });
    }
    
    // Оценка звездами
    if (ratingStars.length > 0) {
        ratingStars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = parseInt(this.dataset.rating);
                highlightStars(rating);
            });
            
            star.addEventListener('click', function() {
                const rating = parseInt(this.dataset.rating);
                ratingValue.value = rating;
                highlightStars(rating, true);
            });
        });
        
        // Сброс звезд при уходе мыши (если оценка не выбрана)
        const ratingContainer = document.getElementById('review-rating');
        if (ratingContainer) {
            ratingContainer.addEventListener('mouseleave', function() {
                const currentRating = parseInt(ratingValue.value);
                if (currentRating === 0) {
                    resetStars();
                } else {
                    highlightStars(currentRating, true);
                }
            });
        }
    }
    
    // Отправка формы отзыва
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.name.value;
            const rating = this.rating.value;
            const text = this.text.value;
            const email = this.email.value;
            
            if (rating === "0") {
                showNotification('Пожалуйста, поставьте оценку', 'error');
                return;
            }
            
            // В реальном проекте здесь отправка на сервер
            console.log('Новый отзыв:', { name, rating, text, email });
            
            // Закрываем модальное окно
            if (reviewModal) {
                reviewModal.classList.remove('active');
            }
            
            // Показываем уведомление
            showNotification('Спасибо за ваш отзыв! Он появится после модерации.');
            
            // Очищаем форму
            this.reset();
            ratingValue.value = "0";
            resetStars();
        });
    }
}

// Подсветка звезд рейтинга
function highlightStars(rating, permanent = false) {
    const stars = document.querySelectorAll('#review-rating .fa-star');
    
    stars.forEach((star, index) => {
        star.classList.remove('fas', 'far');
        
        if (index < rating) {
            star.classList.add('fas');
        } else {
            star.classList.add('far');
        }
        
        if (permanent) {
            star.style.color = '#FFD700';
        } else {
            star.style.color = index < rating ? '#FFD700' : '#ccc';
        }
    });
}

function resetStars() {
    const stars = document.querySelectorAll('#review-rating .fa-star');
    stars.forEach(star => {
        star.classList.remove('fas');
        star.classList.add('far');
        star.style.color = '#ccc';
    });
}

// Инициализация увеличения изображения
function initZoom() {
    const zoomBtn = document.querySelector('.zoom-btn');
    const zoomModal = document.getElementById('zoom-modal');
    const zoomImage = document.getElementById('zoom-image');
    const zoomClose = document.querySelector('.zoom-close');
    const prevZoomBtn = document.querySelector('.prev-zoom');
    const nextZoomBtn = document.querySelector('.next-zoom');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    let currentZoomIndex = 0;
    const zoomImages = Array.from(thumbnails).map(t => t.dataset.image);
    
    // Открытие увеличенного изображения
    if (zoomBtn && zoomModal) {
        zoomBtn.addEventListener('click', function() {
            zoomModal.classList.add('active');
            currentZoomIndex = getCurrentImageIndex();
            updateZoomImage();
        });
    }
    
    // Закрытие увеличенного изображения
    if (zoomClose) {
        zoomClose.addEventListener('click', function() {
            zoomModal.classList.remove('active');
        });
    }
    
    // Закрытие по клику на фон
    if (zoomModal) {
        zoomModal.addEventListener('click', function(e) {
            if (e.target === zoomModal) {
                zoomModal.classList.remove('active');
            }
        });
    }
    
    // Навигация по изображениям
    if (prevZoomBtn) {
        prevZoomBtn.addEventListener('click', function() {
            currentZoomIndex = (currentZoomIndex - 1 + zoomImages.length) % zoomImages.length;
            updateZoomImage();
        });
    }
    
    if (nextZoomBtn) {
        nextZoomBtn.addEventListener('click', function() {
            currentZoomIndex = (currentZoomIndex + 1) % zoomImages.length;
            updateZoomImage();
        });
    }
    
    // Навигация с клавиатуры
    document.addEventListener('keydown', function(e) {
        if (!zoomModal || !zoomModal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            zoomModal.classList.remove('active');
        } else if (e.key === 'ArrowLeft') {
            currentZoomIndex = (currentZoomIndex - 1 + zoomImages.length) % zoomImages.length;
            updateZoomImage();
        } else if (e.key === 'ArrowRight') {
            currentZoomIndex = (currentZoomIndex + 1) % zoomImages.length;
            updateZoomImage();
        }
    });
    
    // Получение индекса текущего изображения
    function getCurrentImageIndex() {
        const mainImage = document.getElementById('main-product-image').src;
        return zoomImages.findIndex(img => img === mainImage);
    }
    
    // Обновление увеличенного изображения
    function updateZoomImage() {
        if (zoomImage && zoomImages[currentZoomIndex]) {
            zoomImage.src = zoomImages[currentZoomIndex];
            
            // Обновляем основное изображение и миниатюры
            const mainImage = document.getElementById('main-product-image');
            if (mainImage) {
                mainImage.src = zoomImages[currentZoomIndex];
            }
            
            thumbnails.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === currentZoomIndex);
            });
        }
    }
}