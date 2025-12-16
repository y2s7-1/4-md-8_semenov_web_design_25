// Space Defender - Основной игровой движок
class SpaceDefender {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        
        // Игровые параметры
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.score = 0;
        this.wave = 1;
        this.lives = 3;
        this.combo = 1;
        this.comboTimer = 0;
        
        // Игровые объекты
        this.player = null;
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.powerUps = [];
        this.stars = [];
        
        // Управление
        this.keys = {};
        this.mouse = { x: 0, y: 0, pressed: false };
        
        // Время и дельта
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // Загрузка ресурсов
        this.images = {};
        this.sounds = {};
        this.loaded = false;
        this.audioEnabled = true;
        
        // Инициализация
        this.init();
    }
    
    init() {
        this.createStarfield();
        this.loadResources();
        this.setupEventListeners();
        this.gameLoop();
    }
    
    createStarfield() {
        this.stars = [];
        for (let i = 0; i < 200; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 0.5 + 0.1,
                brightness: Math.random() * 0.8 + 0.2
            });
        }
    }
    
    loadResources() {
        // Загрузка изображений
        const imageSources = {
            player: 'player_ship.png',
            enemies: 'enemy_ships.png',
            background: 'space_background.png',
            powerups: 'powerups.png'
        };
        
        // Загрузка звуков
        const soundSources = {
            laser: 'laser_shot.mp3',
            explosion: 'explosion.mp3',
            powerup: 'powerup.mp3',
            music: 'background_music.mp3'
        };
        
        let loadedCount = 0;
        const totalResources = Object.keys(imageSources).length + Object.keys(soundSources).length;
        
        // Загрузка изображений
        for (const [key, src] of Object.entries(imageSources)) {
            this.images[key] = new Image();
            this.images[key].onload = () => {
                loadedCount++;
                if (loadedCount === totalResources) {
                    this.loaded = true;
                    console.log('Все ресурсы загружены');
                    this.initializeAudio();
                }
            };
            this.images[key].src = src;
        }
        
        // Загрузка звуков
        for (const [key, src] of Object.entries(soundSources)) {
            this.sounds[key] = new Audio();
            this.sounds[key].oncanplaythrough = () => {
                loadedCount++;
                if (loadedCount === totalResources) {
                    this.loaded = true;
                    console.log('Все ресурсы загружены');
                    this.initializeAudio();
                }
            };
            this.sounds[key].src = src;
        }
    }
    
    initializeAudio() {
        // Настройка фоновой музыки
        if (this.sounds.music) {
            this.sounds.music.loop = true;
            this.sounds.music.volume = 0.3;
        }
    }
    
    playSound(soundName) {
        if (!this.audioEnabled || !this.sounds[soundName]) return;
        
        try {
            const sound = this.sounds[soundName].cloneNode();
            sound.volume = soundName === 'music' ? 0.3 : 0.5;
            sound.play().catch(e => console.log('Ошибка воспроизведения звука:', e));
        } catch (e) {
            console.log('Ошибка воспроизведения звука:', e);
        }
    }
    
    setupEventListeners() {
        // Клавиатура
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key === 'Escape') {
                this.togglePause();
            } else if (e.key === ' ' && this.gameState === 'playing') {
                this.useBomb();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Мышь
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.pressed = true;
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            this.mouse.pressed = false;
        });
        
        // Предотвращение контекстного меню
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.wave = 1;
        this.lives = 3;
        this.combo = 1;
        this.comboTimer = 0;
        
        // Создание игрока
        this.player = new Player(this.width / 2, this.height / 2, this);
        
        // Очистка объектов
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.powerUps = [];
        
        // Начальная волна врагов
        this.spawnWave();
        
        // Обновление UI
        this.updateUI();
        
        // Воспроизведение фоновой музыки
        this.playSound('music');
        
        console.log('Игра началась');
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseMenu').classList.remove('hidden');
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseMenu').classList.add('hidden');
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalWave').textContent = this.wave;
        document.getElementById('gameOverMenu').classList.remove('hidden');
        
        // Сохранение рекорда
        const highScore = localStorage.getItem('spaceDefenderHighScore') || 0;
        if (this.score > highScore) {
            localStorage.setItem('spaceDefenderHighScore', this.score);
            localStorage.setItem('spaceDefenderBestWave', this.wave);
        }
        
        // Остановка фоновой музыки
        if (this.sounds.music) {
            this.sounds.music.pause();
        }
    }
    
    spawnWave() {
        const enemyCount = Math.min(5 + this.wave * 2, 20);
        const enemyTypes = ['basic', 'fast', 'heavy'];
        
        for (let i = 0; i < enemyCount; i++) {
            setTimeout(() => {
                if (this.gameState === 'playing') {
                    const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.max(this.width, this.height) * 0.8;
                    
                    const x = this.width / 2 + Math.cos(angle) * distance;
                    const y = this.height / 2 + Math.sin(angle) * distance;
                    
                    this.enemies.push(new Enemy(x, y, type, this));
                }
            }, i * 200);
        }
        
        // Уведомление о волне
        this.showWaveNotification();
    }
    
    showWaveNotification() {
        const notification = document.createElement('div');
        notification.className = 'wave-notification';
        notification.textContent = `ВОЛНА ${this.wave}`;
        document.querySelector('.game-container').appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        this.deltaTime = deltaTime;
        
        // Обновление комбо таймера
        if (this.comboTimer > 0) {
            this.comboTimer -= deltaTime;
            if (this.comboTimer <= 0) {
                this.combo = 1;
            }
        }
        
        // Обновление звездного фона
        this.updateStarfield();
        
        // Обновление игрока
        if (this.player) {
            this.player.update(deltaTime);
        }
        
        // Обновление врагов
        this.enemies.forEach(enemy => enemy.update(deltaTime));
        
        // Обновление снарядов
        this.projectiles.forEach(proj => proj.update(deltaTime));
        
        // Обновление частиц
        this.particles.forEach(particle => particle.update(deltaTime));
        
        // Обновление бонусов
        this.powerUps.forEach(powerUp => powerUp.update(deltaTime));
        
        // Обработка коллизий
        this.handleCollisions();
        
        // Очистка мертвых объектов
        this.cleanupObjects();
        
        // Проверка на завершение волны
        if (this.enemies.length === 0) {
            this.nextWave();
        }
        
        // Обновление UI
        this.updateUI();
    }
    
    updateStarfield() {
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.height) {
                star.y = 0;
                star.x = Math.random() * this.width;
            }
        });
    }
    
    handleCollisions() {
        // Коллизии снарядов с врагами
        this.projectiles.forEach(proj => {
            if (proj.owner === 'player') {
                this.enemies.forEach(enemy => {
                    if (!enemy.dead && this.checkCollision(proj, enemy)) {
                        enemy.takeDamage(proj.damage);
                        proj.destroy();
                        
                        if (enemy.dead) {
                            this.addScore(enemy.scoreValue);
                            this.createExplosion(enemy.x, enemy.y, enemy.size);
                            this.comboTimer = 2000; // 2 секунды
                            this.combo = Math.min(this.combo + 1, 10);
                        }
                    }
                });
            } else if (proj.owner === 'enemy' && this.player) {
                if (this.checkCollision(proj, this.player)) {
                    this.player.takeDamage(proj.damage);
                    proj.destroy();
                    this.updateHealthBar();
                }
            }
        });
        
        // Коллизии врагов с игроком
        if (this.player) {
            this.enemies.forEach(enemy => {
                if (!enemy.dead && this.checkCollision(enemy, this.player)) {
                    this.player.takeDamage(enemy.damage);
                    enemy.takeDamage(enemy.maxHealth);
                    this.createExplosion(enemy.x, enemy.y, enemy.size);
                    this.updateHealthBar();
                }
            });
        }
        
        // Коллизии игрока с бонусами
        if (this.player) {
            this.powerUps.forEach(powerUp => {
                if (this.checkCollision(powerUp, this.player)) {
                    powerUp.apply(this.player);
                    powerUp.destroy();
                }
            });
        }
    }
    
    checkCollision(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (obj1.size + obj2.size) * 0.8;
    }
    
    cleanupObjects() {
        this.enemies = this.enemies.filter(e => !e.dead);
        this.projectiles = this.projectiles.filter(p => !p.destroyed);
        this.particles = this.particles.filter(p => p.life > 0);
        this.powerUps = this.powerUps.filter(p => !p.destroyed);
        
        // Проверка смерти игрока
        if (this.player && this.player.dead) {
            this.lives--;
            if (this.lives <= 0) {
                this.gameOver();
            } else {
                this.player = new Player(this.width / 2, this.height / 2, this);
            }
        }
    }
    
    nextWave() {
        this.wave++;
        this.spawnWave();
        
        // Шанс появления бонуса между волнами
        if (Math.random() < 0.3) {
            this.spawnPowerUp();
        }
    }
    
    spawnPowerUp() {
        const types = ['health', 'weapon', 'shield', 'speed'];
        const type = types[Math.floor(Math.random() * types.length)];
        const x = Math.random() * (this.width - 100) + 50;
        const y = Math.random() * (this.height - 100) + 50;
        
        this.powerUps.push(new PowerUp(x, y, type, this));
    }
    
    addScore(points) {
        this.score += Math.floor(points * this.combo);
    }
    
    createExplosion(x, y, size) {
        // Воспроизведение звука взрыва
        this.playSound('explosion');
        
        const particleCount = Math.floor(size * 2);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(x, y, this));
        }
    }
    
    useBomb() {
        if (!this.player || this.enemies.length === 0) return;
        
        // Создание большого взрыва, уничтожающего всех врагов
        this.enemies.forEach(enemy => {
            if (!enemy.dead) {
                this.addScore(enemy.scoreValue);
                this.createExplosion(enemy.x, enemy.y, enemy.size * 3);
                enemy.dead = true;
            }
        });
        
        // Добавление визуального эффекта бомбы
        for (let i = 0; i < 50; i++) {
            this.particles.push(new Particle(
                this.width / 2, this.height / 2, this
            ));
        }
        
        console.log('Бомба использована!');
    }
    
    updateUI() {
        document.getElementById('score').textContent = `СЧЕТ: ${this.score}`;
        document.getElementById('wave').textContent = `ВОЛНА: ${this.wave}`;
        document.getElementById('lives').textContent = `ЖИЗНИ: ${this.lives}`;
        document.getElementById('combo').textContent = `КОМБО: x${this.combo}`;
    }
    
    updateHealthBar() {
        if (this.player) {
            const healthPercent = (this.player.health / this.player.maxHealth) * 100;
            document.getElementById('healthFill').style.width = `${healthPercent}%`;
        }
    }
    
    render() {
        // Очистка canvas
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Рендеринг звездного фона
        this.renderStarfield();
        
        // Рендеринг игровых объектов (в оптимизированном порядке)
        this.renderObjects(this.particles);
        this.renderObjects(this.powerUps);
        this.renderObjects(this.projectiles);
        this.renderObjects(this.enemies);
        
        if (this.player) {
            this.player.render(this.ctx);
        }
        
        // Добавление эффекта размытия при движении
        if (this.gameState === 'playing') {
            this.renderMotionBlur();
        }
    }
    
    renderObjects(objects) {
        objects.forEach(obj => {
            if (!obj.destroyed && !obj.dead) {
                obj.render(this.ctx);
            }
        });
    }
    
    renderMotionBlur() {
        // Простой эффект размытия движения
        this.ctx.fillStyle = 'rgba(0, 0, 17, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    renderStarfield() {
        this.ctx.save();
        this.stars.forEach(star => {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.restore();
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Класс игрока
class Player {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.size = 20;
        this.speed = 0.3;
        this.health = 100;
        this.maxHealth = 100;
        this.damage = 25;
        this.fireRate = 200; // миллисекунды
        this.lastShot = 0;
        this.angle = 0;
        this.dead = false;
        
        // Бонусы
        this.weaponLevel = 1;
        this.shield = 0;
        this.speedBoost = 1;
    }
    
    update(deltaTime) {
        if (this.dead) return;
        
        // Движение
        this.handleMovement(deltaTime);
        
        // Поворот к мыши
        this.angle = Math.atan2(
            this.game.mouse.y - this.y,
            this.game.mouse.x - this.x
        );
        
        // Стрельба
        if (this.game.mouse.pressed) {
            this.shoot(deltaTime);
        }
        
        // Проверка границ экрана
        this.x = Math.max(this.size, Math.min(this.game.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(this.game.height - this.size, this.y));
    }
    
    handleMovement(deltaTime) {
        const moveSpeed = this.speed * this.speedBoost * deltaTime;
        
        if (this.game.keys['w'] || this.game.keys['arrowup']) {
            this.y -= moveSpeed;
        }
        if (this.game.keys['s'] || this.game.keys['arrowdown']) {
            this.y += moveSpeed;
        }
        if (this.game.keys['a'] || this.game.keys['arrowleft']) {
            this.x -= moveSpeed;
        }
        if (this.game.keys['d'] || this.game.keys['arrowright']) {
            this.x += moveSpeed;
        }
    }
    
    shoot(deltaTime) {
        const currentTime = Date.now();
        if (currentTime - this.lastShot > this.fireRate) {
            this.lastShot = currentTime;
            
            // Воспроизведение звука выстрела
            this.game.playSound('laser');
            
            // Создание снарядов в зависимости от уровня оружия
            const projectileSpeed = 0.8;
            
            if (this.weaponLevel === 1) {
                // Один снаряд
                this.game.projectiles.push(new Projectile(
                    this.x, this.y, this.angle, projectileSpeed, this.damage, 'player', this.game
                ));
            } else if (this.weaponLevel === 2) {
                // Два снаряда
                const spread = 0.2;
                this.game.projectiles.push(new Projectile(
                    this.x, this.y, this.angle - spread, projectileSpeed, this.damage, 'player', this.game
                ));
                this.game.projectiles.push(new Projectile(
                    this.x, this.y, this.angle + spread, projectileSpeed, this.damage, 'player', this.game
                ));
            } else {
                // Три снаряда
                const spread = 0.3;
                this.game.projectiles.push(new Projectile(
                    this.x, this.y, this.angle - spread, projectileSpeed, this.damage, 'player', this.game
                ));
                this.game.projectiles.push(new Projectile(
                    this.x, this.y, this.angle, projectileSpeed, this.damage, 'player', this.game
                ));
                this.game.projectiles.push(new Projectile(
                    this.x, this.y, this.angle + spread, projectileSpeed, this.damage, 'player', this.game
                ));
            }
        }
    }
    
    takeDamage(damage) {
        if (this.shield > 0) {
            this.shield -= damage;
            if (this.shield < 0) {
                this.health += this.shield; // оставшийся урон
                this.shield = 0;
            }
        } else {
            this.health -= damage;
        }
        
        if (this.health <= 0) {
            this.dead = true;
        }
    }
    
    heal(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
    }
    
    upgradeWeapon() {
        this.weaponLevel = Math.min(this.weaponLevel + 1, 3);
    }
    
    addShield(amount) {
        this.shield += amount;
    }
    
    boostSpeed(amount, duration) {
        this.speedBoost = amount;
        setTimeout(() => {
            this.speedBoost = 1;
        }, duration);
    }
    
    render(ctx) {
        if (this.dead) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Отрисовка щита
        if (this.shield > 0) {
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, this.size + 5, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Отрисовка корабля
        if (this.game.images.player) {
            ctx.drawImage(
                this.game.images.player,
                -this.size, -this.size,
                this.size * 2, this.size * 2
            );
        } else {
            // Запасная отрисовка если изображение не загружено
            ctx.fillStyle = '#00d4ff';
            ctx.beginPath();
            ctx.moveTo(this.size, 0);
            ctx.lineTo(-this.size, -this.size/2);
            ctx.lineTo(-this.size/2, 0);
            ctx.lineTo(-this.size, this.size/2);
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Класс врага
class Enemy {
    constructor(x, y, type, game) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.type = type;
        this.dead = false;
        
        // Параметры в зависимости от типа
        switch (type) {
            case 'basic':
                this.size = 15;
                this.speed = 0.15;
                this.health = 50;
                this.maxHealth = 50;
                this.damage = 20;
                this.scoreValue = 100;
                this.color = '#ff0040';
                break;
            case 'fast':
                this.size = 10;
                this.speed = 0.25;
                this.health = 25;
                this.maxHealth = 25;
                this.damage = 15;
                this.scoreValue = 150;
                this.color = '#8b00ff';
                break;
            case 'heavy':
                this.size = 25;
                this.speed = 0.1;
                this.health = 100;
                this.maxHealth = 100;
                this.damage = 35;
                this.scoreValue = 250;
                this.color = '#00ff88';
                break;
        }
        
        this.angle = Math.atan2(
            game.player.y - this.y,
            game.player.x - this.x
        );
        this.lastShot = 0;
        this.fireRate = 1000 + Math.random() * 1000;
    }
    
    update(deltaTime) {
        if (this.dead) return;
        
        // Движение к игроку
        if (this.game.player && !this.game.player.dead) {
            this.angle = Math.atan2(
                this.game.player.y - this.y,
                this.game.player.x - this.x
            );
            
            this.x += Math.cos(this.angle) * this.speed * deltaTime;
            this.y += Math.sin(this.angle) * this.speed * deltaTime;
        }
        
        // Стрельба
        const currentTime = Date.now();
        if (currentTime - this.lastShot > this.fireRate) {
            this.lastShot = currentTime;
            this.shoot();
        }
    }
    
    shoot() {
        // Воспроизведение звука выстрела врага
        this.game.playSound('laser');
        
        const projectileSpeed = 0.4;
        this.game.projectiles.push(new Projectile(
            this.x, this.y, this.angle, projectileSpeed, this.damage, 'enemy', this.game
        ));
    }
    
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.dead = true;
        }
    }
    
    render(ctx) {
        if (this.dead) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Простая отрисовка врага (заменить на спрайты)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.size, 0);
        ctx.lineTo(-this.size, -this.size/2);
        ctx.lineTo(-this.size/2, 0);
        ctx.lineTo(-this.size, this.size/2);
        ctx.closePath();
        ctx.fill();
        
        // Полоса здоровья
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
        ctx.fillRect(-this.size, -this.size - 8, this.size * 2 * healthPercent, 4);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.strokeRect(-this.size, -this.size - 8, this.size * 2, 4);
        
        ctx.restore();
    }
}

// Класс снаряда
class Projectile {
    constructor(x, y, angle, speed, damage, owner, game) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.damage = damage;
        this.owner = owner; // 'player' или 'enemy'
        this.game = game;
        this.size = 3;
        this.destroyed = false;
        
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }
    
    update(deltaTime) {
        if (this.destroyed) return;
        
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        
        // Удаление за границами экрана
        if (this.x < 0 || this.x > this.game.width || 
            this.y < 0 || this.y > this.game.height) {
            this.destroy();
        }
    }
    
    destroy() {
        this.destroyed = true;
    }
    
    render(ctx) {
        if (this.destroyed) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        const color = this.owner === 'player' ? '#00d4ff' : '#ff0040';
        ctx.fillStyle = color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        
        ctx.fillRect(-this.size, -this.size/2, this.size * 2, this.size);
        
        ctx.restore();
    }
}

// Класс частиц
class Particle {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.life = 1000; // 1 секунда
        this.maxLife = 1000;
        this.size = Math.random() * 3 + 1;
        this.color = `hsl(${Math.random() * 60 + 15}, 100%, 50%)`;
    }
    
    update(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.life -= deltaTime;
        this.size *= 0.98;
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Класс бонусов
class PowerUp {
    constructor(x, y, type, game) {
        this.x = x;
        this.y = y;
        this.type = type; // 'health' | 'weapon' | 'shield' | 'speed'
        this.game = game;
        this.size = 12;
        this.destroyed = false;
        this.rotation = 0;
        this.pulse = 0;

        switch (type) {
            case 'health':
                this.color = '#00ff88';
                this.effectValue = 25;
                break;
            case 'weapon':
                this.color = '#ffaa00';
                this.effectValue = 1;
                break;
            case 'shield':
                this.color = '#0088ff';
                this.effectValue = 50;
                break;
            case 'speed':
            default:
                this.type = 'speed';
                this.color = '#ff00ff';
                this.effectValue = 1.25; // множитель скорости
                break;
        }
    }

    update(deltaTime) {
        if (this.destroyed) return;
        this.rotation += 0.003 * deltaTime;
        this.pulse += 0.005 * deltaTime;
    }

    apply(player) {
        if (this.destroyed) return;
        switch (this.type) {
            case 'health':
                if (typeof player.heal === 'function') {
                    player.heal(this.effectValue);
                } else {
                    player.health = Math.min(player.maxHealth || 100, (player.health || 100) + this.effectValue);
                }
                break;
            case 'weapon':
                if (typeof player.upgradeWeapon === 'function') {
                    player.upgradeWeapon();
                } else {
                    player.weaponLevel = (player.weaponLevel || 1) + this.effectValue;
                }
                break;
            case 'shield':
                if (typeof player.addShield === 'function') {
                    player.addShield(this.effectValue);
                } else {
                    player.shield = Math.min((player.shield || 0) + this.effectValue, 100);
                }
                break;
            case 'speed':
                if (typeof player.boostSpeed === 'function') {
                    player.boostSpeed(this.effectValue, 5000);
                } else {
                    player.speed = (player.speed || 3) * this.effectValue;
                    setTimeout(() => { player.speed = (player.speed || 3) / this.effectValue; }, 5000);
                }
                break;
        }
        this.destroy();
    }

    destroy() {
        this.destroyed = true;
    }

    render(ctx) {
        if (this.destroyed) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Свечение
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;

        // Основной диск
        const r = this.size * (1 + 0.05 * Math.sin(this.pulse));
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // Иконка типа (минимальная)
        ctx.fillStyle = '#0b1120';
        ctx.font = 'bold 12px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const icon = this.type === 'health' ? '+' :
                     this.type === 'weapon' ? 'W' :
                     this.type === 'shield' ? 'S' : 'V';
        ctx.fillText(icon, 0, 0);

        ctx.restore();
    }
}

