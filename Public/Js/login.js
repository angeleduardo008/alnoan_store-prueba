document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validación simple
    if (!email || !password) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    // Simular autenticación
    if (email === 'admin@alnoan.com' && password === 'admin123') {
        // Guardar en localStorage si marcó "Recuérdame"
        if (remember) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
        
        // Guardar sesión
        sessionStorage.setItem('isAuthenticated', 'true');
        
        // CAMBIO PRINCIPAL: Redirigir a la página principal (index.html)
        window.location.href = 'index.html';
    } else {
        alert('Credenciales incorrectas. Intenta nuevamente.');
    }
});

// Rellenar email si estaba guardado
window.addEventListener('DOMContentLoaded', function() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('remember').checked = true;
    }
});
