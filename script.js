// Sample product data
const products = [
    {
        id: 1,
        name: "Premium Laptop",
        price: 899.99,
        originalPrice: 1199.99,
        image: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "electronics",
        description: "High-performance laptop perfect for work and gaming with latest processors and graphics card."
    },
    {
        id: 2,
        name: "Smart Phone",
        price: 599.99,
        originalPrice: 799.99,
        image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "electronics",
        description: "Latest smartphone with advanced camera system and long-lasting battery life."
    },
    {
        id: 3,
        name: "Wireless Headphones",
        price: 199.99,
        originalPrice: 299.99,
        image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "electronics",
        description: "Premium noise-canceling headphones with crystal clear sound quality."
    },
    {
        id: 4,
        name: "Designer T-Shirt",
        price: 29.99,
        originalPrice: 49.99,
        image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "fashion",
        description: "Comfortable cotton t-shirt with modern design and premium quality fabric."
    },
    {
        id: 5,
        name: "Running Shoes",
        price: 89.99,
        originalPrice: 129.99,
        image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "fashion",
        description: "Lightweight running shoes with advanced cushioning and breathable material."
    },
    {
        id: 6,
        name: "Coffee Maker",
        price: 149.99,
        originalPrice: 199.99,
        image: "https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "home",
        description: "Automatic coffee maker with programmable settings and thermal carafe."
    },
    {
        id: 7,
        name: "Smart Watch",
        price: 249.99,
        originalPrice: 349.99,
        image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "electronics",
        description: "Feature-rich smartwatch with health monitoring and GPS tracking."
    },
    {
        id: 8,
        name: "Backpack",
        price: 59.99,
        originalPrice: 89.99,
        image: "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "fashion",
        description: "Durable backpack with multiple compartments and water-resistant material."
    }
];

// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentSlide = 0;
let currentProduct = null;
let currentQuantity = 1;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
    updateCartDisplay();
    showPage('homepage');
    startSlider();
});

// Product functions
function loadProducts(category = 'all') {
    const productsGrid = document.getElementById('products-grid');
    const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="showProduct(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price}</div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts(category) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    loadProducts(category);
    
    // Close sidebar if open
    closeSidebar();
}

function showProduct(productId) {
    currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) return;
    
    document.getElementById('product-main-image').src = currentProduct.image;
    document.getElementById('product-title').textContent = currentProduct.name;
    document.getElementById('product-price').textContent = `$${currentProduct.price}`;
    document.getElementById('product-original-price').textContent = `$${currentProduct.originalPrice}`;
    document.getElementById('product-desc').textContent = currentProduct.description;
    
    currentQuantity = 1;
    document.getElementById('quantity').textContent = currentQuantity;
    
    showPage('product-page');
}

// Cart functions
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    
    // Show success message
    showNotification('Product added to cart!');
}

function addToCartFromProduct() {
    if (currentProduct) {
        addToCart(currentProduct.id, currentQuantity);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    loadCartPage();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

function updateCartDisplay() {
    const cartSidebarItems = document.getElementById('cart-sidebar-items');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cart.length === 0) {
        cartSidebarItems.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Your cart is empty</p>';
    } else {
        cartSidebarItems.innerHTML = cart.map(item => `
            <div class="cart-sidebar-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-sidebar-item-info">
                    <div class="cart-sidebar-item-name">${item.name}</div>
                    <div class="cart-sidebar-item-price">$${item.price} x ${item.quantity}</div>
                </div>
            </div>
        `).join('');
    }
    
    document.getElementById('cart-total-sidebar').textContent = `$${total.toFixed(2)}`;
}

function loadCartPage() {
    const cartItems = document.getElementById('cart-items');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-selector">
                        <button onclick="updateCartQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');
    }
    
    document.getElementById('cart-subtotal').textContent = `$${total.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDisplay();
            loadCartPage();
        }
    }
}

// Navigation functions
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.style.display = 'block';
        targetPage.classList.add('active');
        
        // Load specific page content
        if (pageId === 'cart-page') {
            loadCartPage();
        } else if (pageId === 'homepage') {
            loadProducts();
        }
        
        // Close menus
        closeAllMenus();
    }
}

// Menu functions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (cartSidebar.classList.contains('active')) {
        updateCartDisplay();
    }
}

function toggleUserMenu() {
    const userDropdown = document.getElementById('user-dropdown');
    userDropdown.classList.toggle('active');
}

function toggleMobileMenu() {
    toggleSidebar();
}

function closeAllMenus() {
    const sidebar = document.getElementById('sidebar');
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    const userDropdown = document.getElementById('user-dropdown');
    
    sidebar.classList.remove('active');
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    userDropdown.classList.remove('active');
}

// Product page functions
function changeQuantity(change) {
    currentQuantity += change;
    if (currentQuantity < 1) currentQuantity = 1;
    document.getElementById('quantity').textContent = currentQuantity;
}

// Slider functions
function startSlider() {
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide += direction;
    
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function currentSlideSet(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = n - 1;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Search function
document.getElementById('search-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const searchTerm = this.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        
        const productsGrid = document.getElementById('products-grid');
        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card" onclick="showProduct(${product.id})">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">$${product.price}</div>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); addToCart(${product.id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        showPage('homepage');
    }
});

// Notification function
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Close menus when clicking outside
document.addEventListener('click', function(e) {
    const userMenu = document.querySelector('.user-menu');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (!userMenu.contains(e.target)) {
        userDropdown.classList.remove('active');
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeSidebar();
    }
});