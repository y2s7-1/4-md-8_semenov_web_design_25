// Логика для страницы мероприятий
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация фильтров
    initEventFilters();
    
    // Инициализация регистрации
    initEventRegistration();
    
    // Инициализация формы подписки
    initEventsSubscription();
});

// Инициализация фильтров мероприятий
function initEventFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Показываем/скрываем карточки мероприятий
            eventCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
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
            
            showNotification(`Показаны мероприятия: ${this.textContent}`);
        });
    });
}

// Инициализация регистрации на мероприятия
function initEventRegistration() {
    const registerButtons = document.querySelectorAll('.register-btn');
    const registrationModal = document.getElementById('registration-modal');
    const successModal = document.getElementById('event-success-modal');
    const eventNameInput = document.getElementById('event-name');
    const registrationForm = document.getElementById('event-registration-form');
    
    if (registerButtons.length > 0 && registrationModal) {
        registerButtons.forEach(button => {
            button.addEventListener('click', function() {
                const eventCard = this.closest('.event-card');
                const eventTitle = eventCard.querySelector('h3').textContent;
                
                // Устанавливаем название мероприятия в форму
                if (eventNameInput) {
                    eventNameInput.value = eventTitle;
                }
                
                // Показываем модальное окно
                registrationModal.classList.add('active');
            });
        });
    }
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // В реальном проекте здесь отправка формы на сервер
            console.log('Регистрация на мероприятие:', {
                event: this.event.value,
                name: this.name.value,
                email: this.email.value,
                phone: this.phone.value,
                guests: this.guests.value
            });
            
            // Закрываем модальное окно регистрации
            registrationModal.classList.remove('active');
            
            // Показываем модальное окно успеха
            if (successModal) {
                successModal.classList.add('active');
            }
            
            // Очищаем форму
            this.reset();
            
            // Показываем уведомление
            showNotification('Регистрация на мероприятие прошла успешно!');
        });
    }
}

// Инициализация подписки на мероприятия
function initEventsSubscription() {
    const subscriptionForm = document.querySelector('.events-subscription-form');
    
    if (subscriptionForm) {
        subscriptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // В реальном проекте здесь отправка на сервер
            console.log('Подписка на мероприятия:', email);
            
            // Показываем уведомление
            showNotification('Вы подписались на рассылку о мероприятиях!');
            
            // Очищаем форму
            this.reset();
        });
    }
}