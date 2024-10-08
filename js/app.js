/*=============== TAMPILKAN MENU ===============*/
const showMenu = (toggleId, navId) => {
	const toggle = document.getElementById(toggleId),
		nav = document.getElementById(navId)

	// Memastikan variabel ada
	if (toggle && nav) {
		toggle.addEventListener('click', () => {
			// Kita menambahkan kelas show-menu ke tag div dengan kelas nav__menu
			nav.classList.toggle('show-menu')
		})
	}
}
showMenu('nav-toggle', 'nav-menu')

/*=============== HAPUS MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
	const navMenu = document.getElementById('nav-menu')
	// Ketika kita mengklik setiap nav__link, kita menghapus kelas show-menu
	navMenu.classList.remove('show-menu')
}
navLink.forEach((n) => n.addEventListener('click', linkAction))

/*=============== SCROLL BAGIAN LINK AKTIF ===============*/
const sections = document.querySelectorAll('section[id]')

function scrollActive() {
	const scrollY = window.pageYOffset

	sections.forEach((current) => {
		const sectionHeight = current.offsetHeight
		const sectionTop = current.offsetTop - 50
		sectionId = current.getAttribute('id')

		if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
			document
				.querySelector('.nav__menu a[href*=' + sectionId + ']')
				.classList.add('active-link')
		} else {
			document
				.querySelector('.nav__menu a[href*=' + sectionId + ']')
				.classList.remove('active-link')
		}
	})
}
window.addEventListener('scroll', scrollActive)

/*=============== UBAH LATAR BELAKANG HEADER ===============*/
function scrollHeader() {
	const header = document.getElementById('header')
	// Ketika scroll lebih dari 80 viewport height, tambahkan kelas scroll-header ke tag header
	if (this.scrollY >= 80) header.classList.add('scroll-header')
	else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*=============== TAMPILKAN SCROLL UP ===============*/
function scrollUp() {
	const scrollUp = document.getElementById('scroll-up')
	// Ketika scroll lebih dari 560 viewport height, tambahkan kelas show-scroll ke tag a dengan kelas scroll-top
	if (this.scrollY >= 560) scrollUp.classList.add('show-scroll')
	else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== TEMA GELAP TERANG ===============*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'bx-sun'

// Topik yang dipilih sebelumnya (jika pengguna memilih)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// Kami mendapatkan tema saat ini yang dimiliki antarmuka dengan memvalidasi kelas dark-theme
const getCurrentTheme = () =>
	document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () =>
	themeButton.classList.contains(iconTheme) ? 'bx-moon' : 'bx-sun'

// Kami memvalidasi apakah pengguna sebelumnya memilih topik
if (selectedTheme) {
	// Jika validasi terpenuhi, kita menanyakan apa masalahnya untuk mengetahui apakah kita mengaktifkan atau menonaktifkan mode gelap
	document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](
		darkTheme
	)
	themeButton.classList[selectedIcon === 'bx-moon' ? 'add' : 'remove'](
		iconTheme
	)
}

// Mengaktifkan / menonaktifkan tema secara manual dengan tombol
themeButton.addEventListener('click', () => {
	// Tambahkan atau hapus tema gelap / ikon
	document.body.classList.toggle(darkTheme)
	themeButton.classList.toggle(iconTheme)
	// Kami menyimpan tema dan ikon saat ini yang dipilih pengguna
	localStorage.setItem('selected-theme', getCurrentTheme())
	localStorage.setItem('selected-icon', getCurrentIcon())
})
// JavaScript untuk membuat petir secara acak
function createRandomLightning() {
    const lightningContainer = document.getElementById('lightningContainer');
    const img = document.createElement('img');
    img.src = 'img/petir.png';
    img.classList.add('lightning');

    const randomSize = Math.floor(Math.random() * 100) + 50; // Ukuran acak
    img.style.width = randomSize + 'px';

    const randomX = getRandomPosition(lightningContainer.offsetWidth, true);
    const randomY = getRandomPosition(lightningContainer.offsetHeight, false);
    
    img.style.left = randomX + 'px';
    img.style.top = randomY + 'px';

    lightningContainer.appendChild(img);
}

function getRandomPosition(maxValue, isX) {
    const cornerBias = 0.2;
    if (Math.random() < cornerBias) {
        return Math.random() < 0.5 ? 0 : maxValue - 100; // Posisi di kiri atau kanan
    } else {
        return Math.floor(Math.random() * maxValue); // Posisi acak
    }
}

function generateRandomLightnings(count) {
    for (let i = 0; i < count; i++) {
        createRandomLightning();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    generateRandomLightnings(7); // Ubah jumlah petir menjadi 7
});







  // JavaScript untuk menggambar di canvas
  function initCanvas(canvasId) {
	const canvas = document.getElementById(canvasId);
	const ctx = canvas.getContext('2d');

	// Contoh menggambar lingkaran
	ctx.fillStyle = 'blue';
	ctx.beginPath();
	ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2, true);
	ctx.fill();
}

window.onload = () => {
	// Inisialisasi canvas
	initCanvas('canvasHome');
	initCanvas('canvasAbout');
	initCanvas('canvasServices');

	// Atur ukuran canvas
	const canvases = ['canvasHome', 'canvasAbout', 'canvasServices'];
	canvases.forEach(canvasId => {
		const canvas = document.getElementById(canvasId);
		canvas.width = canvas.offsetWidth; // Atur lebar canvas
		canvas.height = canvas.offsetHeight; // Atur tinggi canvas
	});
};