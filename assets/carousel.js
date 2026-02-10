document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.carousel').forEach(function(carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-arrow.prev');
        const nextBtn = carousel.querySelector('.carousel-arrow.next');
        const dotsContainer = carousel.querySelector('.carousel-dots');

        let currentIndex = 0;
        const totalSlides = slides.length;

        // Create dots
        slides.forEach(function(_, index) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
            dot.addEventListener('click', function() { goToSlide(index); });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        function updateCarousel() {
            track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
            dots.forEach(function(dot, index) {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }

        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        // Touch/swipe support
        var touchStartX = 0;
        var touchEndX = 0;

        carousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;
            if (diff > 50) {
                nextSlide();
            } else if (diff < -50) {
                prevSlide();
            }
        }, { passive: true });

        // Keyboard navigation
        carousel.setAttribute('tabindex', '0');
        carousel.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
    });
});
