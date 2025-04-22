// Añadir producto al carrito
async function addToCart(productId) {
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, cantidad: 1 })
    });
    return await response.json();
  }
  
  // Obtener carrito
  async function loadCart() {
    const response = await fetch('/api/cart');
    const { items, total } = await response.json();
    // Actualiza la interfaz (ej. muestra items y total)
  }