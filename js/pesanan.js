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
    // Tambahkan produk baru
    if (pesanan.length > 0) {
        pesanan.forEach(product => {
            let newProduct = document.createElement('div'); // Membuat elemen div baru untuk produk
            newProduct.dataset.id = product.id; // Menambahkan id produk ke dataset elemen
            newProduct.classList.add('item'); // Menambahkan kelas item pada elemen
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">Rp${product.price.toLocaleString('id-ID', {minimumFractionDigits: 0})}</div>
                <button class="addCart">Add To Cart</button>`; // Format harga dalam Ribuan Rupiah
            listProductHTML.appendChild(newProduct); // Menambahkan produk ke dalam daftar produk
        });
    }
};

// Menambahkan produk ke keranjang saat tombol Add To Cart diklik
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target; // Mendapatkan elemen yang diklik
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id; // Mengambil id produk
        addToCart(id_product); // Memanggil fungsi untuk menambahkan produk ke keranjang
    }
});

// Logika untuk menambahkan produk ke keranjang
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex(value => value.product_id == product_id); // Cek apakah produk sudah ada di keranjang
    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }]; // Jika keranjang kosong, tambahkan produk dengan kuantitas 1
    } else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        }); // Jika produk belum ada di keranjang, tambahkan produk baru
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
    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity; // Tambahkan kuantitas produk ke total
            let newItem = document.createElement('div'); // Buat elemen baru untuk item keranjang
            newItem.classList.add('item'); // Tambahkan kelas item ke elemen
            newItem.dataset.id = item.product_id; // Simpan id produk di dataset elemen

            let positionProduct = pesanan.findIndex(value => value.id == item.product_id); // Cari posisi produk di array pesanan
            let info = pesanan[positionProduct]; // Ambil informasi produk dari pesanan
            newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">${info.name}</div>
                <div class="totalPrice">Rp${(info.price * item.quantity).toLocaleString('id-ID', {minimumFractionDigits: 0})}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>`; // Format subtotal dan harga dalam Ribuan Rupiah
            listCartHTML.appendChild(newItem); // Tambahkan item ke dalam daftar keranjang
        });
    }
    iconCartSpan.innerText = totalQuantity; // Tampilkan total kuantitas di ikon keranjang
};

// Mengubah kuantitas di keranjang
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target; // Mendapatkan elemen yang diklik
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id; // Ambil id produk
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus'; // Tentukan apakah itu plus atau minus
        changeQuantityCart(product_id, type); // Panggil fungsi untuk mengubah kuantitas
    }
});

const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex(value => value.product_id == product_id); // Cari posisi item di keranjang
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity += 1; // Tambah kuantitas jika plus
                break;
            case 'minus':
                cart[positionItemInCart].quantity -= 1; // Kurangi kuantitas jika minus
                if (cart[positionItemInCart].quantity <= 0) {
                    cart.splice(positionItemInCart, 1); // Hapus item jika kuantitas 0
                }
                break;
        }
    }
    addCartToHTML(); // Update tampilan keranjang
    addCartToMemory(); // Simpan perubahan ke localStorage
};

// Menghasilkan link WhatsApp dengan detail keranjang
const generateWhatsAppLink = () => {
    let message = 'Pesanan Saya:\n'; // Pesan awal untuk WhatsApp
    let totalHarga = 0; // Variabel untuk menyimpan total harga

    cart.forEach(item => {
        let positionProduct = pesanan.findIndex(value => value.id == item.product_id); // Cari posisi produk di pesanan
        let productInfo = pesanan[positionProduct]; // Ambil informasi produk
        let subTotal = productInfo.price * item.quantity; // Hitung subtotal

        message += `${productInfo.name} - Qty: ${item.quantity}, Subtotal: Rp${subTotal.toLocaleString('id-ID', {minimumFractionDigits: 0})}\n`; // Format subtotal dalam Ribuan Rupiah
        totalHarga += subTotal; // Tambahkan subtotal ke total harga
    });

    message += `\nTotal Harga: Rp${totalHarga.toLocaleString('id-ID', {minimumFractionDigits: 0})}`; // Tambahkan total harga ke pesan

    // Encode pesan agar sesuai untuk URL WhatsApp
    let encodedMessage = encodeURIComponent(message);
    let whatsappUrl = `https://wa.me/6288294606640?text=${encodedMessage}`; // Buat URL WhatsApp
    
    return whatsappUrl; // Kembalikan URL WhatsApp
};

// Tambahkan event listener ke tombol checkout
const checkoutBtn = document.getElementById('checkoutBtn'); // Ambil elemen tombol checkout
checkoutBtn.addEventListener('click', () => {
    let whatsappLink = generateWhatsAppLink(); // Buat link WhatsApp
    window.open(whatsappLink, '_blank'); // Buka link di tab baru
});

// Inisialisasi aplikasi
const initApp = () => {
    // Ambil data produk dari pesanan.json
    fetch('pesanan.json')
    .then(response => response.json())
    .then(data => {
        pesanan = data; // Simpan data produk ke variabel pesanan
        addDataToHTML(); // Tampilkan produk di HTML

        // Muat data keranjang dari localStorage jika ada
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart')); // Ambil data keranjang dari localStorage
            addCartToHTML(); // Tampilkan keranjang di HTML
        }
    });
};

initApp(); // Jalankan fungsi inisialisasi aplikasi
