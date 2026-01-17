// Логика для страницы жемчуга
document.addEventListener('DOMContentLoaded', function() {
    // Загрузка жемчужных изделий
    loadPearlProducts();
    
    // Инициализация информации о жемчуге
    initPearlInfo();
});

// Загрузка жемчужных изделий
function loadPearlProducts() {
    const pearlContainer = document.getElementById('pearl-products');
    if (!pearlContainer) return;
    
    // Фильтруем товары с жемчугом
    const pearlProducts = productsData.filter(p => 
        p.category === 'pearls' || 
        p.name.toLowerCase().includes('жемчуг') ||
        p.collection.toLowerCase().includes('pearl')
    );
    
    if (pearlProducts.length === 0) {
        // Если нет специальных жемчужных товаров, показываем все
        productsData.forEach(product => {
            const productCard = createProductCard(product);
            pearlContainer.appendChild(productCard);
        });
    } else {
        pearlProducts.forEach(product => {
            const productCard = createProductCard(product);
            pearlContainer.appendChild(productCard);
        });
    }
}

// Инициализация информации о жемчуге
function initPearlInfo() {
    // Можно добавить интерактивные элементы на странице жемчуга
    const pearlTypes = document.querySelectorAll('.type-card');
    
    pearlTypes.forEach(type => {
        type.addEventListener('click', function() {
            const pearlName = this.querySelector('h3').textContent;
            showNotification(`Выбран жемчуг: ${pearlName}`);
            
            // Можно добавить дополнительную информацию
            let info = '';
            switch(pearlName) {
                case 'Акойя':
                    info = 'Японский жемчуг с идеальным блеском. Размер: 2-10 мм. Цвет: белый, кремовый, розовый.';
                    break;
                case 'Таити':
                    info = 'Черный жемчуг с экзотическими переливами. Размер: 8-18 мм. Цвет: черный, серый, зеленый, фиолетовый.';
                    break;
                case 'Южных морей':
                    info = 'Крупный жемчуг с золотистым оттенком. Размер: 10-20 мм. Цвет: золотой, серебристый, белый.';
                    break;
            }
            
            if (info) {
                const modal = document.createElement('div');
                modal.className = 'modal active';
                modal.innerHTML = `
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>${pearlName}</h3>
                            <button class="modal-close">&times;</button>
                        </div>
                        <div class="modal-body">
                            <p>${info}</p>
                            <div class="pearl-characteristics">
                                <p><strong>Происхождение:</strong> ${getPearlOrigin(pearlName)}</p>
                                <p><strong>Особенности:</strong> ${getPearlFeatures(pearlName)}</p>
                                <p><strong>Рекомендации:</strong> ${getPearlRecommendations(pearlName)}</p>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary modal-close">Понятно</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                const closeButtons = modal.querySelectorAll('.modal-close');
                closeButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        modal.remove();
                    });
                });
                
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.remove();
                    }
                });
            }
        });
    });
}

// Вспомогательные функции для информации о жемчуге
function getPearlOrigin(name) {
    switch(name) {
        case 'Акойя': return 'Япония, Китай, Вьетнам';
        case 'Таити': return 'Французская Полинезия';
        case 'Южных морей': return 'Австралия, Индонезия, Филиппины';
        default: return 'Разные регионы';
    }
}

function getPearlFeatures(name) {
    switch(name) {
        case 'Акойя': return 'Идеально круглые, яркий блеск, тонкий слой перламутра';
        case 'Таити': return 'Крупные размеры, экзотические цвета, толстый слой перламутра';
        case 'Южных морей': return 'Самые крупные, естественные цвета, длительный период выращивания';
        default: return 'Уникальные характеристики каждого вида';
    }
}

function getPearlRecommendations(name) {
    switch(name) {
        case 'Акойя': return 'Идеален для повседневной носки и особых случаев';
        case 'Таити': return 'Для вечерних нарядов и создания смелых образов';
        case 'Южных морей': return 'Для важных событий и инвестиционных украшений';
        default: return 'Подходит для разных случаев и стилей';
    }
}