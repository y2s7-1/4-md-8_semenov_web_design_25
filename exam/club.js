// Логика для страницы клубной карты
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация формы
    initClubForm();
    
    // Инициализация FAQ
    initFAQ();
    
    // Инициализация выбора уровня
    initLevelSelection();
});

// Инициализация формы
function initClubForm() {
    const clubForm = document.getElementById('club-form');
    const joinClubBtn = document.getElementById('join-club-btn');
    const successModal = document.getElementById('success-modal');
    
    if (clubForm) {
        clubForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // В реальном проекте здесь отправка формы на сервер
            console.log('Форма отправлена:', {
                name: this.name.value,
                email: this.email.value,
                phone: this.phone.value,
                level: this.level.value,
                message: this.message.value
            });
            
            // Показываем модальное окно успеха
            if (successModal) {
                successModal.classList.add('active');
            }
            
            // Очищаем форму
            this.reset();
            
            // Показываем уведомление
            showNotification('Заявка отправлена успешно!');
        });
    }
    
    if (joinClubBtn) {
        joinClubBtn.addEventListener('click', function() {
            // Прокручиваем к форме
            const formSection = document.querySelector('.club-form-section');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Инициализация FAQ
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            faqItem.classList.toggle('active');
        });
    });
}

// Инициализация выбора уровня
function initLevelSelection() {
    const levelButtons = document.querySelectorAll('.level-select');
    
    levelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const level = this.dataset.level;
            
            // Устанавливаем выбранный уровень в форме
            const levelSelect = document.getElementById('level');
            if (levelSelect) {
                levelSelect.value = level;
                
                // Прокручиваем к форме
                const formSection = document.querySelector('.club-form-section');
                if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Показываем уведомление
                showNotification(`Выбран уровень: ${this.closest('.level-card').querySelector('h3').textContent}`);
            }
        });
    });
}