document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Cargar carrito al iniciar
    loadCart();
    
    // Función para cargar el carrito desde el servidor
    async function loadCart() {
        try {
            const response = await fetch('/api/cart');
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                renderCart(data.items);
            } else {
                renderEmptyCart();
            }
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            renderEmptyCart();
        }
    }
    
    // Función para renderizar el carrito con productos
    function renderCart(items) {
        let subtotal = 0;
        
        const cartHTML = items.map(item => {
            const itemTotal = item.precio_unitario * item.cantidad;
            subtotal += itemTotal;
            
            return `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.imagen || 'Img/default-product.jpg'}" alt="${item.nombre}">
                    <div class="item-details">
                        <h3>${item.nombre}</h3>
                        <p>S/. ${item.precio_unitario.toFixed(2)}</p>
                        <div class="quantity-control">
                            <button class="quantity-btn" data-action="decrease">-</button>
                            <span class="quantity">${item.cantidad}</span>
                            <button class="quantity-btn" data-action="increase">+</button>
                        </div>
                        <button class="remove-btn">Eliminar</button>
                        <div class="item-total">S/. ${itemTotal.toFixed(2)}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        cartItemsContainer.innerHTML = cartHTML;
        updateSummary(subtotal);
        setupEventListeners();
    }
    
    // Función para carrito vacío
    function renderEmptyCart() {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Tu carrito está vacío</p>
                <a href="productos.html" class="btn">Ver Productos</a>
            </div>
        `;
        updateSummary(0);
    }
    
    // Actualizar resumen
    function updateSummary(subtotal) {
        const shipping = 10.00;
        const total = subtotal + shipping;
        
        subtotalElement.textContent = `S/.${subtotal.toFixed(2)}`;
        totalElement.textContent = `S/.${total.toFixed(2)}`;
    }
    
    // Configurar event listeners
    function setupEventListeners() {
        // Botones de cantidad
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', async function() {
                const itemElement = this.closest('.cart-item');
                const itemId = itemElement.dataset.id;
                const quantityElement = itemElement.querySelector('.quantity');
                let quantity = parseInt(quantityElement.textContent);
                const action = this.dataset.action;
                
                if (action === 'increase') {
                    quantity++;
                } else if (action === 'decrease') {
                    quantity--;
                }
                
                try {
                    const response = await fetch('/api/cart/update', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 
                            item_id: itemId, 
                            cantidad: quantity 
                        })
                    });
                    
                    const result = await response.json();
                    if (result.success) {
                        if (quantity < 1) {
                            itemElement.remove();
                        } else {
                            quantityElement.textContent = quantity;
                            // Actualizar total del item
                            const price = parseFloat(itemElement.querySelector('.item-details p').textContent.replace('S/. ', ''));
                            itemElement.querySelector('.item-total').textContent = `S/. ${(price * quantity).toFixed(2)}`;
                        }
                        
                        // Recalcular subtotal
                        let newSubtotal = 0;
                        document.querySelectorAll('.cart-item').forEach(item => {
                            const itemTotal = parseFloat(item.querySelector('.item-total').textContent.replace('S/. ', ''));
                            newSubtotal += itemTotal;
                        });
                        
                        updateSummary(newSubtotal);
                        
                        // Actualizar contador en el header
                        updateCartCount();
                    }
                } catch (error) {
                    console.error('Error al actualizar cantidad:', error);
                }
            });
        });
        
        // Botones de eliminar
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', async function() {
                const itemElement = this.closest('.cart-item');
                const itemId = itemElement.dataset.id;
                
                try {
                    const response = await fetch('/api/cart/remove', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ item_id: itemId })
                    });
                    
                    const result = await response.json();
                    if (result.success) {
                        itemElement.remove();
                        
                        // Verificar si quedan items
                        if (document.querySelectorAll('.cart-item').length === 0) {
                            renderEmptyCart();
                        } else {
                            // Recalcular subtotal
                            let newSubtotal = 0;
                            document.querySelectorAll('.cart-item').forEach(item => {
                                const itemTotal = parseFloat(item.querySelector('.item-total').textContent.replace('S/. ', ''));
                                newSubtotal += itemTotal;
                            });
                            updateSummary(newSubtotal);
                        }
                        
                        // Actualizar contador en el header
                        updateCartCount();
                    }
                } catch (error) {
                    console.error('Error al eliminar item:', error);
                }
            });
        });
    }
    
    // Actualizar contador en el header
    async function updateCartCount() {
        try {
            const response = await fetch('/api/cart');
            const data = await response.json();
            const count = data.items ? data.items.reduce((total, item) => total + item.cantidad, 0) : 0;
            
            const cartCountElement = document.getElementById('cart-count');
            if (cartCountElement) {
                cartCountElement.textContent = count;
                cartCountElement.style.display = count > 0 ? 'inline' : 'none';
            }
        } catch (error) {
            console.error('Error al actualizar contador:', error);
        }
    }
    
    // Botón de pago
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // Aquí puedes implementar la integración con Plin, Yape o Visa
            alert('Redirigiendo a pasarela de pago...');
            // window.location.href = 'checkout.html';
        });
    }
});

// Función global para añadir al carrito desde otras páginas
async function addToCart(productId, quantity = 1) {
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ producto_id: productId, cantidad: quantity })
        });
        
        const result = await response.json();
        
        // Mostrar notificación
        showNotification('Producto añadido al carrito');
        
        // Actualizar contador
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const count = result.items.reduce((total, item) => total + item.cantidad, 0);
            cartCountElement.textContent = count;
            cartCountElement.style.display = count > 0 ? 'inline' : 'none';
        }
    } catch (error) {
        console.error('Error al añadir al carrito:', error);
        showNotification('Error al añadir al carrito', 'error');
    }
}

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