// Smooth scroll for navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href'))
            .scrollIntoView({ behavior: 'smooth' });
    });
});

// Console info (akademik)
console.log("Smart Nurse Call System - Robotika Medis");
console.log("Micro-ROS | ROS 2 | ESP32 | IoT");

// Klik foto dokumentasi untuk tampilan penuh
document.querySelectorAll('.doc-image img').forEach(img => {
    img.addEventListener('click', () => {
        window.open(img.src, '_blank');
    });
});

// Penanda JS aktif (TAMBAHKAN)
console.log("Smart Nurse Call System aktif");
