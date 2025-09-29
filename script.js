document.addEventListener("DOMContentLoaded", function () {
    // Scroll Reveal Part
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // Carousel Part
    const carouselItems = [
        {
            heading: "Online Marketing",
            paragraph: "Online marketing leverages digital channels to efficiently promote products, engage customers, and drive measurable business growth",
        },
        {
            heading: "Financial Consulting",
            paragraph: "Financial consulting provides expert, personalized financial advice and strategies to help individuals and businesses optimize their investments, reduce risks, and achieve long-term financial goals.",
        },
        {
            heading: "Creative Projects",
            paragraph: "Creative projects are innovative endeavors that require original thinking and artistic problem-solving, often involving collaboration and flexible planning to achieve unique and impactful results.",
        },
        {
            heading: "Future Enhancements",
            paragraph: "Future enhancement refers to planned improvements or additions that aim to make a business, product, or process better, more efficient, and more competitive over time.",
        },
        {
            heading: "24/7 support",
            paragraph: "24/7 support means providing customers with round-the-clock assistance every day, ensuring help is always available for timely, reliable service regardless of time or location",
        },
    ];

    const container = document.getElementById("carousel-container");
    let activeIndex = 0;
    let paused = false;
    let currentSlide;

    function createSlide(item) {
        const slide = document.createElement('div');
        slide.className = "absolute w-full max-w-xl top-0 left-0 carousel-animate flex flex-col items-center bg-opacity-40 p-4 rounded-lg shadow-lg";
        slide.innerHTML = `
      <h2 class="text-xl md:text-2xl font-semibold mb-1">${item.heading}</h2>
      <p class="text-sm md:text-base">${item.paragraph}</p>
    `;

        slide.addEventListener('mouseenter', () => {
            slide.classList.add('paused');
            paused = true;
        });

        slide.addEventListener('mouseleave', () => {
            slide.classList.remove('paused');
            paused = false;
            if (!currentSlide) startCarousel();
        });

        slide.addEventListener('animationend', () => {
            if (!paused) {
                activeIndex = (activeIndex + 1) % carouselItems.length;
                showSlide(activeIndex);
            }
        });

        return slide;
    }

    function showSlide(index) {
        container.innerHTML = "";
        currentSlide = createSlide(carouselItems[index]);
        container.appendChild(currentSlide);
    }

    function startCarousel() {
        if (!currentSlide) {
            showSlide(activeIndex);
        }
    }
    startCarousel();
});


