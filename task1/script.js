// Переключение светлой/темной темы
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Проверяем сохраненную тему
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Анимация набора текста
const typingText = document.getElementById('typing-text');
const texts = ['Графический дизайнер', 'Веб-дизайнер', 'Разработчик C++'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeText() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        // Пауза в конце текста
        isDeleting = true;
        typingSpeed = 1500;
    } else if (isDeleting && charIndex === 0) {
        // Переход к следующему тексту
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeText, typingSpeed);
}

// Запускаем анимацию после загрузки страницы
setTimeout(typeText, 1000);

// Анимация появления элементов при прокрутке
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Наблюдаем только за элементами с классом animate-on-scroll
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем класс animate-on-scroll к секциям (кроме hero)
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        section.classList.add('animate-on-scroll');
    });
    
    // Наблюдаем за всеми элементами с классом animate-on-scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));
});

// Обработка формы обратной связи
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Простая валидация
    if (!name || !email || !message) {
        showFormMessage('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    // Эмуляция отправки формы
    showFormMessage('Сообщение отправлено! Я свяжусь с вами в ближайшее время.', 'success');
    
    // Очистка формы
    contactForm.reset();
    
    // Скрываем сообщение через 5 секунд
    setTimeout(() => {
        formMessage.style.display = 'none';
        formMessage.className = 'form-message';
    }, 5000);
});

function showFormMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
}

// Мобильное меню
const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');

menuToggle.addEventListener('click', () => {
    const isDisplayed = navList.style.display === 'flex';
    navList.style.display = isDisplayed ? 'none' : 'flex';
    
    if (!isDisplayed) {
        navList.style.flexDirection = 'column';
        navList.style.position = 'absolute';
        navList.style.top = '100%';
        navList.style.left = '0';
        navList.style.right = '0';
        navList.style.backgroundColor = 'var(--bg-color)';
        navList.style.padding = '1rem';
        navList.style.boxShadow = '0 5px 10px var(--shadow)';
        navList.style.gap = '1rem';
        navList.style.zIndex = '1000';
    }
});

// Закрываем меню при клике на ссылку
document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            navList.style.display = 'none';
        }
    });
});

// Закрываем меню при изменении размера окна
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        navList.style.display = '';
        navList.style.position = '';
        navList.style.flexDirection = '';
    } else {
        navList.style.display = 'none';
    }
});

// Обновляем время выполнения (можно изменить на реальное)
document.getElementById('completion-time').textContent = '90 минут';