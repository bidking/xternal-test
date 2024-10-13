let listProductHTML = document.querySelector('.listProduct'); // Ambil elemen daftar produk
let listCartHTML = document.querySelector('.listCart'); // Ambil elemen daftar keranjang
let iconCart = document.querySelector('.icon-cart'); // Ambil elemen ikon keranjang
let iconCartSpan = document.querySelector('.icon-cart span'); // Ambil elemen span di dalam ikon keranjang
let body = document.querySelector('body'); // Ambil elemen body
let closeCart = document.querySelector('.close'); // Ambil elemen tombol close
let pesanan = []; // Variabel untuk menyimpan data produk
let cart = []; // Variabel untuk menyimpan data keranjang

// Mengatur visibilitas keranjang saat ikon diklik
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart'); // Menambahkan atau menghapus kelas showCart pada body
});
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart'); // Menambahkan atau menghapus kelas showCart pada body
});

// Menampilkan produk pada daftar produk
const addDataToHTML = () => {
    if (pesanan.length > 0) {
        pesanan.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">Rp${product.price.toLocaleString('id-ID', {minimumFractionDigits: 0})}</div>
                <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
};

// Menambahkan produk ke keranjang saat tombol Add To Cart diklik
listProductHTML.addEventListener('click', (event) => {
    if (event.target.classList.contains('addCart')) {
        let id_product = event.target.parentElement.dataset.id; // Mengambil id produk
        addToCart(id_product); // Memanggil fungsi untuk menambahkan produk ke keranjang
    }
});

// Logika untuk menambahkan produk ke keranjang
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex(value => value.product_id == product_id);
    if (positionThisProductInCart < 0) {
        cart.push({ product_id: product_id, quantity: 1 }); // Jika produk belum ada di keranjang
    } else {
        cart[positionThisProductInCart].quantity += 1; // Jika produk sudah ada, tambahkan kuantitasnya
    }
    addCartToHTML(); // Update tampilan keranjang
    addCartToMemory(); // Simpan keranjang ke localStorage
};

// Menyimpan keranjang ke localStorage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart)); // Simpan keranjang dalam format JSON ke localStorage
};

// Menampilkan item keranjang ke dalam HTML
const addCartToHTML = () => {
    listCartHTML.innerHTML = ''; // Kosongkan daftar keranjang sebelum diisi
    let totalQuantity = 0; // Variabel untuk menyimpan total kuantitas
    let totalHarga = 0; // Variabel untuk menyimpan total harga

    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity; // Tambahkan kuantitas produk ke total
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = pesanan.findIndex(value => value.id == item.product_id);
            let info = pesanan[positionProduct];
            let subTotal = info.price * item.quantity; // Hitung subtotal untuk produk ini

            totalHarga += subTotal; // Tambahkan subtotal ke total harga
            
            newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">${info.name}</div>
                <div class="totalPrice">Rp${subTotal.toLocaleString('id-ID', {minimumFractionDigits: 0})}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>`;
            listCartHTML.appendChild(newItem);
        });
    }

    iconCartSpan.innerText = totalQuantity; // Tampilkan total kuantitas di ikon keranjang
    // Tampilkan total harga di dalam keranjang
    let totalPriceElement = document.querySelector('.totalPriceLabel');
    if (!totalPriceElement) {
        totalPriceElement = document.createElement('div');
        totalPriceElement.classList.add('totalPriceLabel');
        listCartHTML.appendChild(totalPriceElement);
    }
    totalPriceElement.innerHTML = `Total Harga: Rp${totalHarga.toLocaleString('id-ID', {minimumFractionDigits: 0})}`;
};

// Mengubah kuantitas di keranjang
listCartHTML.addEventListener('click', (event) => {
    if (event.target.classList.contains('minus') || event.target.classList.contains('plus')) {
        let product_id = event.target.parentElement.parentElement.dataset.id; // Ambil id produk
        let type = event.target.classList.contains('plus') ? 'plus' : 'minus'; // Tentukan apakah itu plus atau minus
        changeQuantityCart(product_id, type); // Panggil fungsi untuk mengubah kuantitas
    }
});

// Fungsi untuk mengubah kuantitas di keranjang
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex(value => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        if (type === 'plus') {
            cart[positionItemInCart].quantity += 1;
        } else {
            cart[positionItemInCart].quantity -= 1;
            if (cart[positionItemInCart].quantity <= 0) {
                cart.splice(positionItemInCart, 1); // Hapus item jika kuantitas 0
            }
        }
    }
    addCartToHTML(); // Update tampilan keranjang
    addCartToMemory(); // Simpan perubahan ke localStorage
};

// Menghasilkan link WhatsApp dengan detail keranjang
const generateWhatsAppLink = () => {
    let message = 'Pesanan Saya:\n';
    let totalHarga = 0;

    cart.forEach(item => {
        let positionProduct = pesanan.findIndex(value => value.id == item.product_id);
        let productInfo = pesanan[positionProduct];
        let subTotal = productInfo.price * item.quantity;

        message += `${productInfo.name} - Qty: ${item.quantity}, Subtotal: Rp${subTotal.toLocaleString('id-ID', {minimumFractionDigits: 0})}\n`;
        totalHarga += subTotal; // Tambahkan subtotal ke total harga
    });

    message += `\nTotal Harga: Rp${totalHarga.toLocaleString('id-ID', {minimumFractionDigits: 0})}`;

    let encodedMessage = encodeURIComponent(message);
    let whatsappUrl = `https://wa.me/6288294606640?text=${encodedMessage}`;
    
    return whatsappUrl; // Kembalikan URL WhatsApp
};

// Tambahkan event listener ke tombol checkout
const checkoutBtn = document.getElementById('checkoutBtn');
checkoutBtn.addEventListener('click', () => {
    let whatsappLink = generateWhatsAppLink();
    window.open(whatsappLink, '_blank'); // Buka link di tab baru
});

// Inisialisasi aplikasi
const initApp = () => {
    fetch('pesanan.json')
    .then(response => response.json())
    .then(data => {
        pesanan = data;
        addDataToHTML();

        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML(); // Tampilkan keranjang di HTML
        }
    });
};

initApp(); // Jalankan fungsi inisialisasi aplikasi
