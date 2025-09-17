document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('testimonialSlider');
    if (!track) return; // nothing to do

    // Each direct child is a slide (wrapper divs in the markup)
    const slides = Array.from(track.children);
    const dots = Array.from(document.querySelectorAll('[data-slide]'));

    let currentIndex = 0;
    const totalSlides = slides.length || 1;

    // Ensure the track has the right CSS for horizontal sliding
    track.style.display = 'flex';
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.width = `${totalSlides * 100}%`;

    // Make each slide occupy equal width
    slides.forEach(slide => {
        slide.style.width = `${100 / totalSlides}%`;
        slide.style.flex = '0 0 auto';
    });

    // Safe-dot init
    if (dots.length) {
        dots.forEach(d => d.classList.remove('bg-primary-500'));
        dots[0].classList.remove('bg-gray-300');
        dots[0].classList.add('bg-primary-500');
    }

    function updateCarousel() {
        // Translate the track
        track.style.transform = `translateX(-${(currentIndex / totalSlides) * 100}%)`;

        // Update dots (if present)
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.remove('bg-gray-300');
                dot.classList.add('bg-primary-500');
            } else {
                dot.classList.remove('bg-primary-500');
                dot.classList.add('bg-gray-300');
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // Function to go to specific slide
    window.goToSlide = function(n) {
        if (typeof n !== 'number' || n < 0 || n >= totalSlides) return;
        currentIndex = n;
        updateCarousel();
        restartAutoSlide();
    }

    // Function to move slides (used by arrow buttons)
    window.moveSlide = function(direction) {
        if (direction > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
        restartAutoSlide();
    }

    // Attach click handlers to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            restartAutoSlide(); // Reset timer on manual navigation
        });
    });

    // Auto advance slides
    let autoSlideInterval;

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
    }

    function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    // Start auto-sliding
    startAutoSlide();

    // Pause on hover over the carousel container
    const carouselContainer = track.closest('.testimonial-carousel') || track.parentElement;
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }

    // Expose helper for debugging
    window._testimonialCarousel = {
        goToSlide: window.goToSlide,
        moveSlide: window.moveSlide,
        next: nextSlide,
        prev: prevSlide
    };
});