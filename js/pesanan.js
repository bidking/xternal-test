let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let pesanan = [];
let cart = [];

// Toggle cart visibility
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Display products in the product list
const addDataToHTML = () => {
    // Add new products
    if (pesanan.length > 0) {
        pesanan.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">${product.price}.000.00</div>
                <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
};

// Add product to cart when clicked
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
});

// Add to cart logic
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex(value => value.product_id == product_id);
    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
};

// Save cart to localStorage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Display cart items
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = pesanan.findIndex(value => value.id == item.product_id);
            let info = pesanan[positionProduct];
            newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">${info.name}</div>
                <div class="totalPrice">${info.price * item.quantity}.000</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>`;
            listCartHTML.appendChild(newItem);
        });
    }
    iconCartSpan.innerText = totalQuantity;
};

// Change quantity in cart
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(product_id, type);
    }
});

const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex(value => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity += 1;
                break;
            case 'minus':
                cart[positionItemInCart].quantity -= 1;
                if (cart[positionItemInCart].quantity <= 0) {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
};

// Generate WhatsApp link with cart details
const generateWhatsAppLink = () => {
    let message = 'Pesanan Saya:\n';
    let totalHarga = 0;

    cart.forEach(item => {
        let positionProduct = pesanan.findIndex(value => value.id == item.product_id);
        let productInfo = pesanan[positionProduct];
        let subTotal = productInfo.price * item.quantity;

        message += `${productInfo.name} - Qty: ${item.quantity}, Subtotal: $${subTotal}\n`;
        totalHarga += subTotal;
    });

    message += `\nTotal Harga: ${totalHarga}.000`;

    // Encode the message to be used in a WhatsApp URL
    let encodedMessage = encodeURIComponent(message);
    let whatsappUrl = `https://wa.me/6288294606640?text=${encodedMessage}`;
    
    return whatsappUrl;
};

// Add event listener to the checkout button
const checkoutBtn = document.getElementById('checkoutBtn');
checkoutBtn.addEventListener('click', () => {
    let whatsappLink = generateWhatsAppLink();
    window.open(whatsappLink, '_blank');
});

// Initialize app
const initApp = () => {
    // Fetch products from pesanan.json
    fetch('pesanan.json')
    .then(response => response.json())
    .then(data => {
        pesanan = data;
        addDataToHTML();

        // Load cart from localStorage if available
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    });
};
initApp();
