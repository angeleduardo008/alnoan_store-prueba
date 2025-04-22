document.addEventListener('DOMContentLoaded', function() {
    // Animación de la barra de navegación al hacer scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Botón para volver arriba
        const backToTop = document.getElementById('back-to-top');
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Botón para volver arriba
    document.getElementById('back-to-top').addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Animación de aparición de elementos al hacer scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.product-card, .service-card, .testimonial-card, .about-content, .contact-grid').forEach((el) => {
        observer.observe(el);
    });
    
    // Menú desplegable en móviles
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Sistema de Modo Oscuro Mejorado
    const themeToggle = document.getElementById('theme-toggle');
    const darkModeModal = document.getElementById('dark-mode-modal');
    const enableDarkModeBtn = document.getElementById('enable-dark-mode');
    const disableDarkModeBtn = document.getElementById('disable-dark-mode');
    
    // Función para aplicar el modo oscuro
    function applyDarkMode(enable) {
        if (enable) {
            document.body.classList.add('dark-mode');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    }
    
    // Verificar preferencias del sistema
    function checkSystemPreferences() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Verificar si es de noche (entre 6PM y 6AM)
    function isNightTime() {
        const hour = new Date().getHours();
        return hour >= 18 || hour < 6;
    }
    
    // Función CORREGIDA - Reemplaza tu manageTheme() actual
function manageTheme() {
    // 1. Verificar estado de cookies primero
    const cookieDecision = localStorage.getItem('cookies_aceptadas');
    
    // 2. Si no hay decisión sobre cookies, usar modo claro y salir
    if (cookieDecision === null) {
        applyDarkMode(false);
        return;
    }
    
    // 3. Si rechazó cookies, usar modo claro
    if (cookieDecision === 'false') {
        applyDarkMode(false);
        return;
    }
    
    // 4. Solo si aceptó cookies, proceder con la lógica del tema:
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isNightTime = new Date().getHours() >= 18 || new Date().getHours() < 6;
    
    // Lógica de prioridades:
    if (savedTheme) {
        // Usar preferencia guardada
        applyDarkMode(savedTheme === 'dark');
    } else if (systemPrefersDark || isNightTime) {
        // Auto-detectar si no hay preferencia guardada
        applyDarkMode(true);
        
        // Mostrar modal solo si es por preferencia del sistema (no por hora)
        if (darkModeModal && systemPrefersDark) {
            darkModeModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    } else {
        // Default: modo claro
        applyDarkMode(false);
    }
}
    
    // Event listeners para el modo oscuro
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-mode');
            applyDarkMode(!isDark);
        });
    }
    
    if (enableDarkModeBtn) {
        enableDarkModeBtn.addEventListener('click', () => {
            applyDarkMode(true);
            if (darkModeModal) {
                darkModeModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    
    if (disableDarkModeBtn) {
        disableDarkModeBtn.addEventListener('click', () => {
            applyDarkMode(false);
            if (darkModeModal) {
                darkModeModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    
    // Cerrar modal al hacer clic fuera del contenido
    if (darkModeModal) {
        darkModeModal.addEventListener('click', (e) => {
            if (e.target === darkModeModal) {
                darkModeModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    
    // Sistema de Cookies Mejorado - Versión corregida
const cookieBanner = document.getElementById('cookie-banner');
const acceptCookiesBtn = document.getElementById('accept-cookies');
const rejectCookiesBtn = document.getElementById('reject-cookies');

// Función mejorada para mostrar el banner
function showCookieBanner() {
    // Verificar si ya hay una decisión previa
    const decision = localStorage.getItem('cookies_aceptadas');
    
    // Solo mostrar si no hay decisión guardada
    if (cookieBanner && decision === null) {
        cookieBanner.style.display = 'block'; // Cambiado de classList.add a style.display
        console.log('Mostrando banner de cookies');
    }
}

// Función para manejar la decisión
function handleCookieConsent(accepted) {
    // Guardar la decisión
    localStorage.setItem('cookies_aceptadas', accepted.toString());
    
    // Ocultar el banner
    if (cookieBanner) {
        cookieBanner.style.display = 'none';
        console.log('Ocultando banner de cookies');
    }
    
    // Si aceptó, crear la cookie técnica
    if (accepted) {
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = `cookie_consent=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
        console.log('Cookie técnica creada:', document.cookie);
    }
    
    // Gestionar tema según preferencias
    manageTheme();
}

// Event listeners mejorados
if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', () => {
        console.log('Usuario aceptó cookies');
        handleCookieConsent(true);
    });
}

if (rejectCookiesBtn) {
    rejectCookiesBtn.addEventListener('click', () => {
        console.log('Usuario rechazó cookies');
        handleCookieConsent(false);
    });
}

// Inicialización modificada
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar banner solo si no hay decisión previa
    if (localStorage.getItem('cookies_aceptadas') === null) {
        showCookieBanner();
    } else {
        // Si ya hay decisión, gestionar tema directamente
        manageTheme();
    }
});
    // Quick View Modal - MODIFICADO PARA INTEGRAR CON BACKEND
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('.product-image').src;
            const productDesc = productCard.querySelector('.product-description').textContent;
            const productId = productCard.dataset.productId;
            
            // Crear modal de vista rápida
            const quickViewModal = document.createElement('div');
            quickViewModal.className = 'quick-view-modal active';
            quickViewModal.innerHTML = `
                <div class="quick-view-content">
                    <button class="close-quick-view">&times;</button>
                    <div class="quick-view-grid">
                        <div class="quick-view-image">
                            <img src="${productImage}" alt="${productName}">
                        </div>
                        <div class="quick-view-info">
                            <h3>${productName}</h3>
                            <div class="quick-view-price">${productPrice}</div>
                            <p class="quick-view-description">${productDesc}</p>
                            <div class="product-options">
                                <div class="quantity-selector">
                                    <button class="decrease">-</button>
                                    <input type="number" value="1" min="1">
                                    <button class="increase">+</button>
                                </div>
                                <button class="add-to-cart btn">Añadir al carrito <i class="fas fa-cart-plus"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(quickViewModal);
            document.body.style.overflow = 'hidden';
            
            // Cerrar modal
            document.querySelector('.close-quick-view').addEventListener('click', function() {
                document.body.removeChild(quickViewModal);
                document.body.style.overflow = '';
            });
            
            // Cerrar al hacer clic fuera
            quickViewModal.addEventListener('click', function(e) {
                if (e.target === quickViewModal) {
                    document.body.removeChild(quickViewModal);
                    document.body.style.overflow = '';
                }
            });
            
            // Selector de cantidad
            const decreaseBtn = quickViewModal.querySelector('.decrease');
            const increaseBtn = quickViewModal.querySelector('.increase');
            const quantityInput = quickViewModal.querySelector('input[type="number"]');
            
            decreaseBtn.addEventListener('click', () => {
                let value = parseInt(quantityInput.value);
                if (value > 1) {
                    quantityInput.value = value - 1;
                }
            });
            
            increaseBtn.addEventListener('click', () => {
                let value = parseInt(quantityInput.value);
                quantityInput.value = value + 1;
            });
            
            // Añadir al carrito desde el modal
            quickViewModal.querySelector('.add-to-cart').addEventListener('click', function() {
                const quantity = parseInt(quantityInput.value);
                addToCart(productId, quantity);
                document.body.removeChild(quickViewModal);
                document.body.style.overflow = '';
            });
        });
    });
    
    // Función para añadir al carrito (mejorada)
    async function addToCart(productId, quantity = 1) {
        try {
            console.log("Añadiendo al carrito - Producto ID:", productId, "Cantidad:", quantity);
            
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify({ 
                    producto_id: productId, 
                    cantidad: quantity 
                })
            });

            // Verificar si hay respuesta
            const responseText = await response.text();
            if (!responseText) {
                throw new Error('El servidor no devolvió ninguna respuesta');
            }

            // Intentar parsear JSON
            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (e) {
                console.error("Error parseando JSON:", e, "Respuesta:", responseText);
                throw new Error('Respuesta inválida del servidor');
            }

            if (!response.ok) {
                console.error("Error en la respuesta:", responseData);
                throw new Error(responseData.message || 'Error al añadir al carrito');
            }

            console.log("Producto añadido:", responseData);
            showNotification('Producto añadido al carrito');
            updateCartCount();
            
        } catch (error) {
            console.error('Error en addToCart:', error);
            showNotification(error.message || 'Error al añadir al carrito', 'error');
        }
    }

    // Función para actualizar el contador del carrito (mejorada)
    async function updateCartCount() {
        try {
            const response = await fetch('../js/cart', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            
            if (!response.ok) {
                // Si es 404, puede ser que no haya carrito aún
                if (response.status === 404) {
                    const cartCountElement = document.getElementById('cart-count');
                    if (cartCountElement) {
                        cartCountElement.textContent = '0';
                        cartCountElement.style.display = 'none';
                    }
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            const count = data.items?.reduce((total, item) => total + item.cantidad, 0) || 0;
            
            const cartCountElement = document.getElementById('cart-count');
            if (cartCountElement) {
                cartCountElement.textContent = count;
                cartCountElement.style.display = count > 0 ? 'inline' : 'none';
            }
        } catch (error) {
            console.error('Error actualizando contador del carrito:', error);
            // Mostrar 0 si hay error
            const cartCountElement = document.getElementById('cart-count');
            if (cartCountElement) {
                cartCountElement.textContent = '0';
                cartCountElement.style.display = 'none';
            }
        }
    }
    // Añadir al carrito desde las tarjetas de producto
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.productId;
            
            if (!productId) {
                console.error('No se encontró productId en la tarjeta de producto');
                return;
            }
            
            addToCart(productId);
            
            // Animación
            productCard.classList.add('added-to-cart');
            setTimeout(() => {
                productCard.classList.remove('added-to-cart');
            }, 1000);
        });
    });
    
    // Lista de deseos (se mantiene igual, solo usa localStorage)
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productImage = productCard.querySelector('.product-image').src;
            const productPrice = productCard.querySelector('.price').textContent;
            
            // Verificar si ya está en la lista
            const isInWishlist = wishlist.some(item => item.name === productName);
            
            if (isInWishlist) {
                showNotification(`${productName} ya está en tu lista de deseos`);
                return;
            }
            
            wishlist.push({
                name: productName,
                image: productImage,
                price: productPrice
            });
            
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            showNotification(`${productName} añadido a tu lista de deseos`);
            
            // Cambiar icono
            this.innerHTML = '<i class="fas fa-heart"></i>';
            this.style.color = 'var(--error)';
        });
    });
    
    // Mostrar notificaciones
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i> ${message}`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simular envío
            setTimeout(() => {
                showNotification('Mensaje enviado con éxito. Nos pondremos en contacto pronto.');
                contactForm.reset();
            }, 1000);
        });
    }
    
    // Formulario de newsletter
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            
            // Simular suscripción
            setTimeout(() => {
                showNotification('¡Gracias por suscribirte a nuestro newsletter!');
                emailInput.value = '';
            }, 1000);
        });
    });
    // Buscador de productos
const searchToggle = document.getElementById('search-toggle');
const searchBox = document.querySelector('.search-box');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// Alternar visibilidad del buscador
if (searchToggle) {
    searchToggle.addEventListener('click', () => {
        searchBox.classList.toggle('active');
        if (searchBox.classList.contains('active')) {
            searchInput.focus();
        }
    });
}

// Función de búsqueda
function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    let found = false;

    products.forEach(product => {
        const title = product.querySelector('h3').textContent.toLowerCase();
        const description = product.querySelector('.product-description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            product.style.display = 'block';
            found = true;
            // Destacar resultado
            product.animate([
                { backgroundColor: 'rgba(212, 175, 55, 0.3)' },
                { backgroundColor: 'transparent' }
            ], 1000);
        } else {
            product.style.display = 'none';
        }
    });

    if (!found && searchTerm.length > 0) {
        showNotification('No se encontraron productos', 'error');
    }
}

// Event listeners
if (searchButton) {
    searchButton.addEventListener('click', searchProducts);
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
}
// Verificar si el usuario está logueado
if (sessionStorage.getItem('isAuthenticated')) {
    // Mostrar opción de panel admin si es necesario
    const loginLink = document.getElementById('login-link'); // Asegúrate de tener este elemento
    if (loginLink) {
        loginLink.innerHTML = '<i class="fas fa-user-shield"></i> Panel Admin';
        loginLink.href = 'admin-mochilas.html';
    }
    
    // O mostrar un mensaje de bienvenida
    const welcomeMsg = document.createElement('div');
    welcomeMsg.className = 'welcome-admin';
    welcomeMsg.innerHTML = `
        <p>Bienvenido administrador | 
        <a href="admin-mochilas.html">Ir al panel</a> | 
        <a href="#" id="logout-btn">Cerrar sesión</a></p>
    `;
    document.body.prepend(welcomeMsg);
    
    // Manejar logout
    document.getElementById('logout-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('isAuthenticated');
        window.location.reload();
    });
}
    // Inicializar contador del carrito al cargar la página
    updateCartCount();
});