// VARIAVEIS GLOBAIS
let currentTheme = 'dark';
let isLoading = true;

// CONTEÚDO DOM CARREGADO 
document.addEventListener('DOMContentLoaded', function() {
    // INICIALIZAR TODOS COMPONENTES
    initializeTheme();
    initializeNavigation();
    initializeHero();
    initializeScrollEffects();
    initializePortfolioFilter();
    initializeSkillsAnimation();
    initializeContactForm();
    initializeAOS();
    
    // Ocultar tela de carregamento após atraso
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
});

// TETLA DE CARREGAMENTO
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            isLoading = false;
        }, 500);
    }
}

// TEMA DE SISTEMA
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    // Carregar tema salvo ou definir como default o escuro
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    currentTheme = savedTheme;
    body.className = `${currentTheme}-theme`;
    updateThemeIcon();
    
    themeToggle?.addEventListener('click', toggleTheme);
    
    function toggleTheme() {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.className = `${currentTheme}-theme`;
        localStorage.setItem('portfolio-theme', currentTheme);
        updateThemeIcon();
        
        // ADD EFEITO DE TRANSICAO
        body.style.transition = 'all 0.3s ease-in-out';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    }
    
    function updateThemeIcon() {
        if (themeIcon) {
            themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// NAVEGACAO
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Efeito de rolagem para barra de navegação
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });
    
    // Alternar menu móvel
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu?.classList.toggle('active');
        document.body.style.overflow = navMenu?.classList.contains('active') ? 'hidden' : '';
    });
    
    // Navegação de rolagem suave
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Fechar menu móvel
                hamburger?.classList.remove('active');
                navMenu?.classList.remove('active');
                document.body.style.overflow = '';
                
                // Atualizar link de navegação ativo
                updateActiveNavLink(targetId);
            }
        });
    });
    
    // Atualizar link de navegação ativo com base na posição de rolagem
    function updateActiveNavLink(activeId = null) {
        const sections = document.querySelectorAll('section[id]');
        
        if (activeId) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === activeId);
            });
            return;
        }
        
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
                });
            }
        });
    }
    
    // Atualizar link ativo ao rolar
    window.addEventListener('scroll', () => updateActiveNavLink());
}

//  AREA DE DESTAQUE 
function initializeHero() {
    createParticles();
    initializeTypingEffect();
    
    // PARTICULAS FLUTUANTES
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;
        
        const particleCount = window.innerWidth < 768 ? 20 : 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }
    
    // Efeito de digitação para descrição do destaque
    function initializeTypingEffect() {
        const heroDescription = document.querySelector('.hero-description');
        if (!heroDescription) return;
        
        const originalText = heroDescription.innerHTML;
        const words = originalText.split(' ');
        let currentWordIndex = 0;
        
        // Limpar conteúdo inicial
        heroDescription.innerHTML = '';
        
        function typeWord() {
            if (currentWordIndex < words.length) {
                heroDescription.innerHTML += (currentWordIndex > 0 ? ' ' : '') + words[currentWordIndex];
                currentWordIndex++;
                setTimeout(typeWord, 150);
            }
        }
        
        // Efeito de digitação inicial após atraso
        setTimeout(typeWord, 1000);
    }
}

// EFEITOS DE SCROLL
function initializeScrollEffects() {
    // Efeito de paralaxe para fundo de herói
    window.addEventListener('scroll', () => {
        if (isLoading) return;
        
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-background');
        
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
        
        // Elementos flutuantes paralaxe
        const floatingElements = document.querySelectorAll('.float-element');
        floatingElements.forEach((element, index) => {
            const speed = scrolled * (0.1 + index * 0.05);
            element.style.transform = `translateY(${speed}px)`;
        });
    });
    
    // Revelar elementos no pergaminho
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Acionar animação de barras de habilidade
                if (entry.target.classList.contains('skills')) {
                    animateSkillBars();
                }
            }
        });
    }, observerOptions);
    
    // Observe as seções para animações de rolagem
    const sectionsToObserve = document.querySelectorAll('section, .timeline-item, .portfolio-item');
    sectionsToObserve.forEach(section => {
        observer.observe(section);
    });
}

// ===== PORTFOLIO FILTER =====
function initializePortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const shouldShow = filter === 'all' || item.classList.contains(filter);
                
                if (shouldShow) {
                    item.style.display = 'block';
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

// ===== SKILLS ANIMATION =====
function initializeSkillsAnimation() {
    let skillsAnimated = false;
    
    window.animateSkillBars = function() {
        if (skillsAnimated) return;
        skillsAnimated = true;
        
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            const targetWidth = bar.getAttribute('data-width');
            
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, index * 200);
        });
    };
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const formObject = Object.fromEntries(formData.entries());
        
        // Simple validation
        if (!formObject.nome || !formObject.email || !formObject.assunto || !formObject.mensagem) {
            showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        if (!isValidEmail(formObject.email)) {
            showNotification('Por favor, insira um email válido.', 'error');
            return;
        }
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;
        
        try {
            // Simulate API call (replace with actual endpoint)
            await simulateAPICall(formObject);
            
            showNotification('Mensagem enviada com sucesso! Obrigado pelo contato.', 'success');
            contactForm.reset();
            
        } catch (error) {
            showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
        } finally {
            // Reset button
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    });
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    async function simulateAPICall(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (90% chance)
                if (Math.random() > 0.1) {
                    console.log('Contact form submission:', data);
                    resolve(data);
                } else {
                    reject(new Error('Simulated API error'));
                }
            }, 2000);
        });
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
    
    function getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }
    
    function getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: 1rem;
        border-radius: 0.25rem;
        transition: background-color 0.2s;
    }
    
    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(style);

// ===== AOS INITIALIZATION =====
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            delay: 100,
            disable: function() {
                return window.innerWidth < 768;
            }
        });
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Optimized scroll handler
const optimizedScrollHandler = throttle(() => {
    if (isLoading) return;
    
    const scrolled = window.pageYOffset;
    const navbar = document.getElementById('navbar');
    
    // Navbar scroll effect
    if (scrolled > 50) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
    
    // Parallax effects (only on desktop)
    if (window.innerWidth >= 1024) {
        const parallax = document.querySelector('.hero-background');
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translate3d(0, ${speed}px, 0)`;
        }
        
        const floatingElements = document.querySelectorAll('.float-element');
        floatingElements.forEach((element, index) => {
            const speed = scrolled * (0.1 + index * 0.05);
            element.style.transform = `translate3d(0, ${speed}px, 0)`;
        });
    }
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.error);
    // Could implement error tracking here
});

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (navMenu?.classList.contains('active')) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// ===== RESIZE HANDLER =====
const optimizedResizeHandler = debounce(() => {
    // Reinitialize particles on resize
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        particlesContainer.innerHTML = '';
        if (window.innerWidth >= 768) {
            // Recreate particles only on larger screens
            setTimeout(() => {
                const particleCount = window.innerWidth < 1024 ? 30 : 50;
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.top = Math.random() * 100 + '%';
                    particle.style.animationDelay = Math.random() * 6 + 's';
                    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
                    particlesContainer.appendChild(particle);
                }
            }, 100);
        }
    }
    
    // Reinitialize AOS on resize
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}, 250);

window.addEventListener('resize', optimizedResizeHandler);

// ===== CONSOLE SIGNATURE =====
console.log(`
╔═══════════════════════════════════════╗
║     Fernando Marques da Cruz          ║
║     Portfolio Website                 ║
║     Desenvolvido com ❤️ e JavaScript   ║
╚═══════════════════════════════════════╝
`);

// ===== EXPORT FOR TESTING (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeTheme,
        initializeNavigation,
        showNotification,
        debounce,
        throttle
    };
}