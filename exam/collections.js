// Логика для страницы салонов
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация поиска
    initSalonSearch();
    
    // Инициализация записи на примерку
    initAppointment();
    
    // Инициализация фильтров
    initSalonFilters();
});

// Инициализация поиска салонов
function initSalonSearch() {
    const searchInput = document.getElementById('salon-search');
    const searchBtn = document.getElementById('search-btn');
    const salonCards = document.querySelectorAll('.salon-card');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (!query) {
            // Показываем все салоны
            salonCards.forEach(card => {
                card.style.display = 'grid';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            });
            return;
        }
        
        salonCards.forEach(card => {
            const salonName = card.querySelector('h3').textContent.toLowerCase();
            const salonAddress = card.querySelector('.info-item:nth-child(1) span').textContent.toLowerCase();
            const salonMetro = card.querySelector('.info-item:nth-child(4) span').textContent.toLowerCase();
            
            if (salonName.includes(query) || salonAddress.includes(query) || salonMetro.includes(query)) {
                card.style.display = 'grid';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        showNotification(`Поиск: "${query}"`);
    }
}

// Инициализация фильтров салонов
function initSalonFilters() {
    const cityFilter = document.getElementById('city-filter');
    const serviceFilter = document.getElementById('service-filter');
    const salonCards = document.querySelectorAll('.salon-card');
    
    if (cityFilter) {
        cityFilter.addEventListener('change', applyFilters);
    }
    
    if (serviceFilter) {
        serviceFilter.addEventListener('change', applyFilters);
    }
    
    function applyFilters() {
        const cityValue = cityFilter ? cityFilter.value : '';
        const serviceValue = serviceFilter ? serviceFilter.value : '';
        
        salonCards.forEach(card => {
            const salonCity = getSalonCity(card);
            const salonServices = getSalonServices(card);
            
            let showCard = true;
            
            // Проверяем фильтр по городу
            if (cityValue && salonCity !== cityValue) {
                showCard = false;
            }
            
            // Проверяем фильтр по услугам
            if (serviceValue && !salonServices.includes(serviceValue)) {
                showCard = false;
            }
            
            if (showCard) {
                card.style.display = 'grid';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        showNotification('Фильтры применены');
    }
    
    function getSalonCity(card) {
        const address = card.querySelector('.info-item:nth-child(1) span').textContent.toLowerCase();
        if (address.includes('москва')) return 'moscow';
        if (address.includes('санкт-петербург') || address.includes('спб')) return 'spb';
        if (address.includes('екатеринбург')) return 'ekb';
        if (address.includes('казань')) return 'kazan';
        if (address.includes('сочи')) return 'sochi';
        return '';
    }
    
    function getSalonServices(card) {
        const serviceTags = card.querySelectorAll('.service-tag');
        const services = [];
        
        serviceTags.forEach(tag => {
            const text = tag.textContent.toLowerCase();
            if (text.includes('примерка')) services.push('fitting');
            if (text.includes('ремонт')) services.push('repair');
            if (text.includes('консультация')) services.push('consultation');
            if (text.includes('мероприятия')) services.push('events');
        });
        
        return services;
    }
}

// Инициализация записи на примерку
function initAppointment() {
    const appointmentForm = document.getElementById('appointment-form');
    const appointmentButtons = document.querySelectorAll('.salon-actions .btn-primary');
    const successModal = document.getElementById('appointment-success-modal');
    
    // Заполняем форму при нажатии на кнопку в карточке салона
    appointmentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const saloonId = this.dataset.saloon;
            const saloonCard = document.querySelector(`.salon-card [data-saloon="${saloonId}"]`).closest('.salon-card');
            const saloonName = saloonCard.querySelector('h3').textContent;
            
            // Устанавливаем выбранный салон в форме
            const saloonSelect = document.getElementById('appointment-saloon');
            if (saloonSelect) {
                for (let i = 0; i < saloonSelect.options.length; i++) {
                    if (saloonSelect.options[i].text.includes(saloonName)) {
                        saloonSelect.selectedIndex = i;
                        break;
                    }
                }
            }
            
            // Прокручиваем к форме
            const appointmentSection = document.querySelector('.appointment-section');
            if (appointmentSection) {
                appointmentSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            showNotification(`Выбран салон: ${saloonName}`);
        });
    });
    
    // Обработка формы записи
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // В реальном проекте здесь отправка формы на сервер
            console.log('Запись на примерку:', {
                name: this.name.value,
                phone: this.phone.value,
                saloon: this.saloon.value,
                date: this.date.value,
                time: this.time.value,
                comment: this.comment.value
            });
            
            // Показываем модальное окно успеха
            if (successModal) {
                successModal.classList.add('active');
            }
            
            // Очищаем форму
            this.reset();
            
            // Показываем уведомление
            showNotification('Запись на примерку оформлена! Мы свяжемся с вами для подтверждения.');
        });
    }
    
    // Настраиваем минимальную дату (сегодня)
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Устанавливаем дату по умолчанию (через 2 дня)
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 2);
        dateInput.value = defaultDate.toISOString().split('T')[0];
    }
}