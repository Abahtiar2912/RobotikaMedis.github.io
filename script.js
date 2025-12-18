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

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', () => {
    // Add animation prep to elements
    document.querySelectorAll('section, .problem-card, .lesson-card, .feature-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Counter animation for performance metrics
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + (element.dataset.suffix || '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
    
    // Progress bar for metrics
    const createProgressBar = (percentage) => {
        const bar = document.createElement('div');
        bar.style.cssText = `
            width: ${percentage}%;
            height: 8px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            border-radius: 4px;
            transition: width 1s ease;
            margin-top: 10px;
        `;
        return bar;
    };
    
    // Add hover effect for tables
    document.querySelectorAll('.performance-table tbody tr').forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.2s ease';
        });
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add copy button to code blocks
    document.querySelectorAll('pre code').forEach(block => {
        const button = document.createElement('button');
        button.textContent = '📋 Copy';
        button.className = 'copy-button';
        button.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 15px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.85rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const pre = block.parentElement;
        pre.style.position = 'relative';
        pre.appendChild(button);
        
        pre.addEventListener('mouseenter', () => button.style.opacity = '1');
        pre.addEventListener('mouseleave', () => button.style.opacity = '0');
        
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(block.textContent);
                button.textContent = '✅ Copied!';
                setTimeout(() => button.textContent = '📋 Copy', 2000);
            } catch (err) {
                button.textContent = '❌ Failed';
                setTimeout(() => button.textContent = '📋 Copy', 2000);
            }
        });
    });
    
    // Add floating "Back to Top" button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '⬆️';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        z-index: 1000;
    `;
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.transform = 'scale(1)';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.transform = 'scale(0.8)';
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    backToTop.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    backToTop.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Sticky navigation scroll effect
    const nav = document.querySelector('nav.sticky-nav');
    
    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav.sticky-nav a');
    
    window.addEventListener('scroll', () => {
        // Add scrolled class to nav
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Active section highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    console.log("✅ Smart Nurse Call System - All enhancements loaded!");
});

// Code Preview Functions
function showCodePreview() {
    const preview = document.getElementById('codePreview');
    preview.style.display = 'block';
    preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeCodePreview() {
    const preview = document.getElementById('codePreview');
    preview.style.display = 'none';
}
