// Base de datos temporal
let products = [
    {
        id: 1,
        name: "Mochila Urbana Premium",
        price: 189.99,
        category: "urbana",
        stock: 15,
        image: "https://ejemplo.com/mochila1.jpg",
        description: "Mochila elegante para uso diario"
    },
    {
        id: 2,
        name: "Mochila de Viaje XL",
        price: 249.99,
        category: "viaje",
        stock: 8,
        image: "https://ejemplo.com/mochila2.jpg",
        description: "Perfecta para tus aventuras"
    }
];

// Elementos del DOM
const productsTable = document.getElementById('products-table-body');
const productForm = document.getElementById('product-form');
const productModal = document.getElementById('product-modal');
const addProductBtn = document.getElementById('add-product-btn');
const closeModal = document.querySelector('.close-modal');
const cancelBtn = document.getElementById('cancel-btn');
const modalTitle = document.getElementById('modal-title');
const imagePreview = document.getElementById('image-preview');

// Mostrar productos en la tabla
function renderProducts() {
    productsTable.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image || 'placeholder.jpg'}" alt="${product.name}" style="width:50px;height:50px;object-fit:cover;"></td>
            <td>${product.name}</td>
            <td>S/ ${product.price.toFixed(2)}</td>
            <td>${product.category}</td>
            <td>${product.stock}</td>
            <td class="table-actions">
                <button class="btn btn-secondary edit-btn" data-id="${product.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger delete-btn" data-id="${product.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        productsTable.appendChild(row);
    });
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editProduct(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
    });
}

// Abrir modal para agregar producto
function openAddModal() {
    productForm.reset();
    document.getElementById('product-id').value = '';
    modalTitle.textContent = 'Agregar Nueva Mochila';
    imagePreview.src = '';
    productModal.style.display = 'flex';
}

// Editar producto
function editProduct(id) {
    const product = products.find(p => p.id == id);
    
    if (product) {
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-image').value = product.image;
        document.getElementById('product-description').value = product.description;
        
        imagePreview.src = product.image || '';
        modalTitle.textContent = 'Editar Mochila';
        productModal.style.display = 'flex';
    }
}

// Eliminar producto
function deleteProduct(id) {
    if (confirm('¿Estás seguro de eliminar esta mochila?')) {
        products = products.filter(p => p.id != id);
        renderProducts();
        alert('Mochila eliminada correctamente');
    }
}

// Guardar producto (crear o actualizar)
productForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const productData = {
        id: document.getElementById('product-id').value || Date.now(),
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        stock: parseInt(document.getElementById('product-stock').value),
        image: document.getElementById('product-image').value,
        description: document.getElementById('product-description').value
    };
    
    if (document.getElementById('product-id').value) {
        // Editar producto existente
        const index = products.findIndex(p => p.id == productData.id);
        products[index] = productData;
    } else {
        // Agregar nuevo producto
        products.push(productData);
    }
    
    renderProducts();
    productModal.style.display = 'none';
    alert('Mochila guardada correctamente');
});

// Vista previa de imagen
document.getElementById('product-image').addEventListener('input', function() {
    imagePreview.src = this.value;
});

// Event listeners
addProductBtn.addEventListener('click', openAddModal);
closeModal.addEventListener('click', () => productModal.style.display = 'none');
cancelBtn.addEventListener('click', () => productModal.style.display = 'none');

// Cerrar modal al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.style.display = 'none';
    }
});

// Inicializar
renderProducts();
