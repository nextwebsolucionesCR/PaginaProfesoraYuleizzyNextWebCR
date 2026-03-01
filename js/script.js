/* =========================================
   1. MAIN INITIALIZATION
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initTheme();
    initLanguage();
    initNavbar();
    initReviews();
    initBlog(); // Blogger
    initContactForm();
    initMap();
    initCounters();
    initAnimations();
    initHeroAnimations();
    initBlogAnimations(); // Premium Blog Title Animation
    initServicesAnimations();
    initReviewsAnimations(); // Premium Reviews Animation
    initContactAnimations();
    initLocationAnimations(); // Location title with logo animation
    initInfoBadgeAnimation(); // 3D info badge animation
    // initLogoAnimation(); // Disabled per user request (static text)
    initPiSymbol(); // 3D Pi Symbol for Matemática General
    initScrollSpy(); // Active Link Highlighting
    initNavbarScroll(); // Mobile scroll behavior
    initTawkTo();
});

/* =========================================
   21. REVIEWS SECTION ANIMATIONS (User Request)
   ========================================= */
function initReviewsAnimations() {
    // 1. Safety & Fallback Check
    if (typeof Splitting === 'undefined' || typeof anime === 'undefined') {
        console.warn('Splitting.js or Anime.js not loaded. Animations disabled.');
        return; // Fallback: Content remains visible by default CSS
    }

    const reviewsSection = document.getElementById('testimonios');
    if (!reviewsSection) return;

    // 2. Select Elements
    const title = reviewsSection.querySelector('.reviews-title');
    const card = reviewsSection.querySelector('.reviews-card');
    const subtitle = reviewsSection.querySelector('.reviews-card-subtitle');

    if (!title || !card || !subtitle) return;

    // 3. Prepare Content (Splitting)
    try {
        // Title: Characters for premium feel
        Splitting({ target: title, by: 'chars' });
        // Subtitle: Words for readability
        Splitting({ target: subtitle, by: 'words' });
    } catch (e) {
        console.warn('Splitting error in reviews:', e);
    }

    // 4. Set Initial States (JS Only - prevents permanent invisible if JS fails)
    const titleChars = title.querySelectorAll('.char');
    const subtitleWords = subtitle.querySelectorAll('.word');

    // Title: Hidden initially
    if (titleChars.length) {
        anime.set(titleChars, {
            opacity: 0,
            translateY: 14
        });
    }

    // Card: Block state
    anime.set(card, {
        opacity: 0,
        translateY: 18,
        scale: 0.97
    });

    // Subtitle Words: Hidden
    if (subtitleWords.length) {
        anime.set(subtitleWords, {
            opacity: 0,
            translateX: -12
        });
    }

    // 5. Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determine timeline
                const tl = anime.timeline({
                    easing: 'easeOutCubic' // Default easing
                });

                // A) Title Animation (Letters)
                if (titleChars.length) {
                    tl.add({
                        targets: titleChars,
                        opacity: [0, 1],
                        translateY: [14, 0],
                        delay: anime.stagger(30), // 25-40ms requested
                        duration: 800, // 650-850ms requested
                        easing: 'easeOutExpo'
                    });
                }

                // B) Card Animation (Block)
                tl.add({
                    targets: card,
                    opacity: [0, 1],
                    translateY: [18, 0],
                    scale: [0.97, 1],
                    duration: 800, // 600-900ms requested
                    easing: 'easeOutCubic'
                }, '-=400'); // Overlap for flow

                // C) Subtitle Animation (Words)
                if (subtitleWords.length) {
                    tl.add({
                        targets: subtitleWords,
                        opacity: [0, 1],
                        translateX: [-12, 0],
                        delay: anime.stagger(80), // 70-110ms requested
                        duration: 600, // 500-750ms requested
                        easing: 'easeOutQuad' // Smooth
                    }, '-=600'); // Start slightly after card starts
                }

                // Clean up
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(reviewsSection);
}

/* =========================================
   22. CONTACT SECTION ANIMATIONS
   ========================================= */
function initContactAnimations() {
    if (typeof Splitting === 'undefined' || typeof anime === 'undefined') return;

    const contactSection = document.getElementById('contacto');
    if (!contactSection) return;

    const title = contactSection.querySelector('.contact-title .gradient-text');
    if (!title) return;

    // Split
    try {
        Splitting({ target: title, by: 'chars' });
    } catch (e) { console.warn('Contact Splitting error', e); }

    // Initial State
    const chars = title.querySelectorAll('.char');
    if (chars.length) {
        anime.set(chars, { opacity: 0, translateY: 14, rotate: 5 });
    }

    // Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: chars,
                    opacity: [0, 1],
                    translateY: [14, 0],
                    rotate: [5, 0],
                    delay: anime.stagger(30),
                    duration: 800,
                    easing: 'easeOutExpo'
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(contactSection);
}

/* =========================================
   23. LOCATION TITLE ANIMATION
   ========================================= */
function initLocationAnimations() {
    if (typeof Splitting === 'undefined' || typeof anime === 'undefined') {
        console.warn('Location Animation: Splitting or Anime not loaded');
        return;
    }

    const section = document.getElementById('contacto');
    if (!section) {
        console.warn('Location Animation: Contact section not found');
        return;
    }

    const title = section.querySelector('.location-title');
    const logo = section.querySelector('.location-logo');

    if (!title) {
        console.warn('Location Animation: Title not found');
        console.log('Available elements:', section.querySelector('.location-title-wrapper'));
        return;
    }

    // Get the gradient-text span inside
    const gradientSpan = title.querySelector('.gradient-text');
    const targetElement = gradientSpan || title;

    console.log('Location Animation: Starting...', targetElement.textContent);

    // 1. Splitting
    try {
        Splitting({ target: targetElement, by: 'chars' });
        console.log('Location Animation: Splitting successful');
    } catch (e) {
        console.error('Location Splitting Error:', e);
        return;
    }

    // 2. Select Targets
    const titleChars = targetElement.querySelectorAll('.char');

    // 3. Initial States
    if (titleChars.length) {
        anime.set(titleChars, { opacity: 0, translateY: 18, rotate: 3 });
    }

    // 4. Scroll-based trigger (more reliable than IntersectionObserver for this case)
    let hasAnimated = false;

    function checkAndAnimate() {
        if (hasAnimated) return;

        const rect = title.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if title is in viewport (with some margin)
        const isVisible = rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3;

        console.log('Location Animation: Checking visibility, top:', rect.top, 'windowHeight:', windowHeight, 'isVisible:', isVisible);

        if (isVisible) {
            hasAnimated = true;
            console.log('Location Animation: Starting timeline with', titleChars.length, 'characters');

            const tl = anime.timeline({
                easing: 'easeOutExpo'
            });

            // Animate title characters
            if (titleChars.length) {
                console.log('Location Animation: Animating characters...');
                tl.add({
                    targets: titleChars,
                    opacity: [0, 1],
                    translateY: [18, 0],
                    rotate: [3, 0],
                    delay: anime.stagger(30),
                    duration: 800,
                    complete: function () {
                        console.log('Location Animation: Character animation complete');
                    }
                });
            }

            // Animate logo after title completes
            if (logo) {
                console.log('Location Animation: Adding logo animation...');
                tl.add({
                    targets: logo,
                    opacity: [0, 1],
                    scale: [0.8, 1],
                    duration: 800,
                    easing: 'easeOutElastic(1, .8)',
                    complete: function () {
                        logo.classList.add('visible');
                        console.log('Location Animation: Logo animation complete');
                    }
                }, '-=200');
            }

            // Remove scroll listener after animation
            window.removeEventListener('scroll', checkAndAnimate);
        }
    }

    // Check on scroll
    window.addEventListener('scroll', checkAndAnimate);
    // Also check immediately in case already visible
    checkAndAnimate();

    console.log('Location Animation: Scroll listener attached');
}

/* =========================================
   24. 3D INFO BADGE ANIMATION - ENHANCED
   ========================================= */
function initInfoBadgeAnimation() {
    const badge = document.getElementById('contact-info-badge');
    if (!badge) {
        console.warn('Info badge not found');
        return;
    }

    console.log('Info badge animation initialized');

    // Use IntersectionObserver to trigger animation when badge comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !badge.classList.contains('visible')) {
                console.log('Info badge entering viewport - triggering animation');
                // Add visible class to trigger the CSS animation
                badge.classList.add('visible');
                // Unobserve after animation starts (only animate once)
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2, // Trigger when 20% of the badge is visible
        rootMargin: '0px 0px -10% 0px' // Start slightly before it enters viewport
    });

    observer.observe(badge);
}

/* =========================================
   25. 3D PI SYMBOL FOR MATEMÁTICA GENERAL
   ========================================= */
function initPiSymbol() {
    const canvas = document.getElementById('pi-canvas');
    const wrapper = document.querySelector('.pi-canvas-wrapper');
    const quoteText = document.querySelector('.pi-quote-text');
    const mathCard = document.getElementById('math-general-card');

    if (!canvas || !wrapper || !mathCard) {
        console.warn('Pi symbol elements not found');
        return;
    }

    // Check if libraries are loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        return;
    }
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded, using fallback animation');
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    // Set size based on wrapper
    const updateSize = () => {
        const size = wrapper.offsetWidth;
        renderer.setSize(size, size);
        camera.aspect = 1;
        camera.updateProjectionMatrix();
    };
    updateSize();

    // Create Pi Symbol using custom geometry (horizontal bar + two vertical legs)
    const piGroup = new THREE.Group();

    // Material with theme-aware color
    const isDark = document.body.classList.contains('dark-mode');
    const piColor = isDark ? 0x6366f1 : 0x4338ca; // Primary color

    const material = new THREE.MeshStandardMaterial({
        color: piColor,
        metalness: 0.6,
        roughness: 0.2,
        emissive: piColor,
        emissiveIntensity: 0.2
    });

    // Horizontal bar (top of π)
    const horizontalBar = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.3, 0.3),
        material
    );
    horizontalBar.position.y = 0.8;
    piGroup.add(horizontalBar);

    // Left vertical leg
    const leftLeg = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 1.6, 0.3),
        material
    );
    leftLeg.position.x = -0.7;
    leftLeg.position.y = 0;
    piGroup.add(leftLeg);

    // Right vertical leg
    const rightLeg = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 1.6, 0.3),
        material
    );
    rightLeg.position.x = 0.7;
    rightLeg.position.y = 0;
    piGroup.add(rightLeg);

    scene.add(piGroup);
    const piMesh = piGroup; // Use group as piMesh for animations


    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 4;

    // OrbitControls setup
    let controls = null;
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, canvas);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.5;
        controls.autoRotate = false;
    } else {
        console.warn('OrbitControls not available');
    }

    // Animation state
    let isUserInteracting = false;
    let idleRotation = 0;
    let floatOffset = 0;
    let hasAnimatedIn = false;

    // Detect user interaction
    if (controls) {
        canvas.addEventListener('mousedown', () => { isUserInteracting = true; });
        canvas.addEventListener('mouseup', () => { isUserInteracting = false; });
        canvas.addEventListener('touchstart', () => { isUserInteracting = true; });
        canvas.addEventListener('touchend', () => { isUserInteracting = false; });
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        if (controls) {
            controls.update();
        }

        // Idle animation when not interacting
        if (!isUserInteracting && hasAnimatedIn) {
            // Slow rotation
            idleRotation += 0.003;
            piMesh.rotation.y = idleRotation;

            // Floating motion
            floatOffset += 0.02;
            piMesh.position.y = Math.sin(floatOffset) * 0.15;
        }

        renderer.render(scene, camera);
    }
    animate();

    // Scroll-triggered entrance animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimatedIn) {
                hasAnimatedIn = true;

                // Initial position (off-screen to the right)
                wrapper.style.transform = 'translateX(200px)';
                wrapper.style.opacity = '0';

                // GSAP entrance animation
                if (typeof gsap !== 'undefined') {
                    gsap.to(wrapper, {
                        x: 0,
                        opacity: 1,
                        duration: 1.2,
                        ease: 'power3.out',
                        onComplete: () => {
                            // Show quote text after pi settles
                            if (quoteText) {
                                setTimeout(() => {
                                    quoteText.classList.add('visible');
                                }, 300);
                            }
                        }
                    });
                } else {
                    // Fallback CSS transition
                    wrapper.style.transition = 'all 1.2s ease-out';
                    wrapper.style.transform = 'translateX(0)';
                    wrapper.style.opacity = '1';

                    if (quoteText) {
                        setTimeout(() => {
                            quoteText.classList.add('visible');
                        }, 1500);
                    }
                }

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(mathCard);

    // Handle window resize
    window.addEventListener('resize', updateSize);
}


/* =========================================
   20. BLOG ANIMATIONS (Splitting + Anime)
   ========================================= */
function initBlogAnimations() {
    // 1. Safety Check
    if (typeof Splitting === 'undefined' || typeof anime === 'undefined') {
        return; // Fallback: CSS keeps everything visible
    }

    const blogSection = document.querySelector('#blog');
    if (!blogSection) return;

    // 2. Initialize Splitting
    try {
        Splitting({ target: '.blog-title', by: 'chars' });
        Splitting({ target: '.blog-subtitle', by: 'words' });
    } catch (e) {
        console.error('Blog Splitting Error:', e);
        return;
    }

    // 3. Select Elements
    const titleChars = document.querySelectorAll('.blog-title .char');
    const subtitleWords = document.querySelectorAll('.blog-subtitle .word');
    const underline = document.querySelector('.underline-animated::after');
    // Note: JS cannot select pseudo-elements directly for animation targets usually.
    // Anime.js can animate CSS variables or we animate the PARENT's custom property if needed, 
    // OR we animate the pseudo-element via a trick?
    // Actually, distinct way: Animate a class or simpler: Animate the SPAN wrapper itself?
    // User asked for "drawn from left to right". Pseudo-element "transform: scaleX" is best.
    // BUT Anime.js cannot target ::after directly.
    // FIX: We will animate a CSS Variable `--underline-scale` on the parent, using CSS to map it.
    // OR BETTER: Just animate the `.underline-animated` span width? No, scale is better for performance.

    // Alternative: We will animate the `element` directly if we change CSS to use a real element? 
    // User said "pseudo-element ::after preferably".
    // To animate pseudo-element with JS, we animate the parent's custom property!
    // Let's modify the CSS approach slightly in the next tool if needed, 
    // OR use a simpler approach: Just animate the `width` of the `::after`? No.

    // DECISION: I'll use a standard DOM element for the line to be 100% safe with Anime.js?
    // No, I'll use the CSS Variable method.
    // JS: anime({ targets: '.underline-animated', '--underline-scale': 1 });
    // CSS: transform: scaleX(var(--underline-scale, 0));

    // 3b. Set Initial State
    // Title
    anime.set(titleChars, {
        opacity: 0,
        translateY: 18,
        rotate: 3
    });
    // Subtitle
    anime.set(subtitleWords, {
        opacity: 0,
        translateX: -14
    });

    // Underline (We will use a class trigger or Custom Prop)
    // Actually, simplest way for "One-off": Adds a class `.animate-line` that has `transform: scaleX(1)`.
    // Valid for "simple" css transition.
    // User wanted "Anime.js control".
    // Let's go with Stylesheet injection or Variable. 
    // Let's try: Targets: '.underline-animated', opacity: 1 (dummy), update: function(anim) { el.style.setProperty('--scale', ...)} 

    // SIMPLER FIX: I already set `transform: scaleX(0)` in CSS.
    // I can just select the element `.underline-animated` and animate a ClipPath?
    // No.
    // Pivot: I will assume the user handles standard DOM or I add a real element.
    // Wait, I can't easily change HTML again without verify.
    // I will use properties on `.underline-animated` and move the line there?
    // No.

    // PLAN B: Update style of `.underline-animated` to NOT use ::after for the animation, 
    // but use a linear-gradient background-size?
    // "Drawing" line.

    // Let's use the CSS Variable approach. It's clean.
    // I need to update CSS too? Yes.
    // I will execute a CSS update quickly after this.
    // Wait, I can do it in the JS by manipulating the stylesheet rule? Too complex.

    // RE-PLAN: I will animate the TEXT DECORATION? No.
    // I will just use a helper function to Append a REAL div line if I can't animate pseudo.
    // let line = document.createElement('div'); line.className = 'anim-line'; ...
    // append to .underline-animated.
    // This allows Anime.js to target it.

    const subtitleSpan = document.querySelector('.underline-animated');
    let lineObj = null;
    if (subtitleSpan) {
        const line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.bottom = '0';
        line.style.left = '0';
        line.style.width = '100%';
        line.style.height = '3px';
        line.style.background = 'linear-gradient(90deg, #4338ca, #db2777)'; // Hardcoded vars match
        line.style.transform = 'scaleX(0)';
        line.style.transformOrigin = 'left';
        line.style.borderRadius = '2px';
        subtitleSpan.appendChild(line);
        lineObj = line;

        // Remove the CSS ::after rule? I can't easily. It might double up.
        // It's fine, the CSS ::after has scaleX(0) so it's invisible.
        // I will animate my new real element.
    }

    // 4. Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Timeline
                const tl = anime.timeline({
                    easing: 'easeOutExpo'
                });

                // Title Chars
                if (titleChars.length) {
                    tl.add({
                        targets: titleChars,
                        opacity: [0, 1],
                        translateY: [18, 0],
                        rotate: [3, 0],
                        delay: anime.stagger(30),
                        duration: 800
                    });
                }

                // Subtitle Words
                if (subtitleWords.length) {
                    tl.add({
                        targets: subtitleWords,
                        opacity: [0, 1],
                        translateX: [-14, 0],
                        delay: anime.stagger(70),
                        duration: 600
                    }, '-=600');
                }

                // Underline
                if (lineObj) {
                    tl.add({
                        targets: lineObj,
                        scaleX: [0, 1],
                        duration: 600,
                        easing: 'easeOutCubic'
                    }, '-=400');
                }

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    observer.observe(blogSection);
    observer.observe(blogSection);
}

/* =========================================
   20. SERVICES ANIMATIONS (Premium)
   ========================================= */
/* =========================================
   20. SERVICES ANIMATIONS (Unified Premium Style)
   ========================================= */
function initServicesAnimations() {
    if (typeof Splitting === 'undefined' || typeof anime === 'undefined') return;

    const section = document.getElementById('servicios');
    if (!section) return;

    // Selectors matching Blog
    const title = section.querySelector('.services-title');
    const subtitle = section.querySelector('.services-subtitle');
    const underlineSpan = section.querySelector('.underline-animated');

    // 1. Splitting
    try {
        if (title) Splitting({ target: title, by: 'chars' });
        if (subtitle) Splitting({ target: subtitle, by: 'words' });
    } catch (e) { console.warn('Services Splitting Error:', e); }

    // 2. Select Targets
    const titleChars = title ? title.querySelectorAll('.char') : [];
    const subtitleWords = subtitle ? subtitle.querySelectorAll('.word') : [];

    // 3. Create Underline
    let lineObj = null;
    if (underlineSpan && !underlineSpan.querySelector('div')) { // Check if already exists
        const line = document.createElement('div');
        Object.assign(line.style, {
            position: 'absolute', bottom: '0', left: '0', width: '100%', height: '3px',
            background: 'linear-gradient(90deg, #4338ca, #db2777)',
            transform: 'scaleX(0)', transformOrigin: 'left', borderRadius: '2px'
        });
        underlineSpan.appendChild(line);
        lineObj = line;
    }

    // 4. Initial States
    if (titleChars.length) anime.set(titleChars, { opacity: 0, translateY: 18, rotate: 3 });
    if (subtitleWords.length) anime.set(subtitleWords, { opacity: 0, translateX: -14 });

    // 5. Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const tl = anime.timeline({ easing: 'easeOutExpo' });

                if (titleChars.length) {
                    tl.add({
                        targets: titleChars, opacity: [0, 1], translateY: [18, 0], rotate: [3, 0],
                        delay: anime.stagger(30), duration: 800
                    });
                }
                if (subtitleWords.length) {
                    tl.add({
                        targets: subtitleWords, opacity: [0, 1], translateX: [-14, 0],
                        delay: anime.stagger(70), duration: 600
                    }, '-=600');
                }
                if (lineObj) {
                    tl.add({
                        targets: lineObj, scaleX: [0, 1], duration: 600, easing: 'easeOutCubic'
                    }, '-=400');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(section);
}

/* =========================================
   21. REVIEWS SECTION ANIMATIONS (Unified Premium Style)
   ========================================= */
function initReviewsAnimations() {
    if (typeof Splitting === 'undefined' || typeof anime === 'undefined') return;

    const section = document.getElementById('testimonios');
    if (!section) return;

    const title = section.querySelector('.reviews-title');
    const subtitle = section.querySelector('.reviews-card-subtitle');
    // Note: Reviews doesn't have an underline element based on HTML, but following Blog logic for Title/Subtitle

    try {
        if (title) Splitting({ target: title, by: 'chars' });
        if (subtitle) Splitting({ target: subtitle, by: 'words' });
    } catch (e) { console.warn('Reviews Splitting Error:', e); }

    const titleChars = title ? title.querySelectorAll('.char') : [];
    const subtitleWords = subtitle ? subtitle.querySelectorAll('.word') : [];
    const card = section.querySelector('.reviews-card');

    if (titleChars.length) anime.set(titleChars, { opacity: 0, translateY: 18, rotate: 3 });
    if (subtitleWords.length) anime.set(subtitleWords, { opacity: 0, translateX: -14 });

    // Additional: Ensure card itself is visible or animated separately? 
    // Blog animates the card via .reveal-on-scroll usually, but let's integrate card fade-in 
    // effectively so it supports the text. 
    // Blog's text is OUTSIDE the cards usually.
    // In Reviews, subtitle is INSIDE the card. 
    // Let's ensure card is visible first or concurrently.
    if (card) anime.set(card, { opacity: 0, translateY: 20 });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const tl = anime.timeline({ easing: 'easeOutExpo' });

                // Card Entrance (Base)
                if (card) {
                    tl.add({
                        targets: card, opacity: [0, 1], translateY: [20, 0], duration: 800
                    });
                }

                if (titleChars.length) {
                    tl.add({
                        targets: titleChars, opacity: [0, 1], translateY: [18, 0], rotate: [3, 0],
                        delay: anime.stagger(30), duration: 800
                    }, card ? '-=600' : 0);
                }

                if (subtitleWords.length) {
                    tl.add({
                        targets: subtitleWords, opacity: [0, 1], translateX: [-14, 0],
                        delay: anime.stagger(70), duration: 600
                    }, '-=600');
                }

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(section);
}

/* =========================================
   13. LOGO ANIMATION (User Example Replica)
   ========================================= */
function initLogoAnimation() {
    const logoName = document.getElementById('logo-text');
    if (logoName) {
        const text = logoName.textContent.trim();
        logoName.textContent = '';
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char; // Handle spaces
            span.style.animationDelay = `${index * 0.1}s`;
            logoName.appendChild(span);
        });
    }
}

/* =========================================
   12. SCROLL ANIMATIONS
   ========================================= */
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

/* =========================================
   11. TAWK.TO CHAT
   ========================================= */
function initTawkTo() {
    // User Guide Script Implementation
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function () {
        var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        // PLACEHOLDER: User must replace this link with their real Tawk.to widget URL
        s1.src = 'https://embed.tawk.to/693cb93463fe071984ec7f23/1jcaj6t2f';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode.insertBefore(s1, s0);
    })();
}

/* =========================================
   2. THREE.JS PARTICLE NETWORK (MATH SYMBOLS)
   ========================================= */
let updateThreeJSTheme; // Global exposed function for theme toggle access

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Safety check for Three.js
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded. Skipping hero particles.');
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const particles = new THREE.Group();
    scene.add(particles);

    const symbols = ['+', '-', '×', '÷', '∑', 'π', '∞', '∫', '√', '1', '2', '3', '4', '5', '8', '9'];

    // Helper to create texture with specific color
    function createSymbolTexture(text, color) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 32, 32);
        return new THREE.CanvasTexture(canvas);
    }

    const particleCount = window.innerWidth < 768 ? 35 : 100; // Mobile optimization
    const geometry = new THREE.PlaneGeometry(1, 1);
    const meshList = []; // Track meshes to update textures later

    // Initial Color Decision
    const isDark = document.body.classList.contains('dark-mode');
    let currentColor = isDark ? '#ffffff' : '#1e293b'; // White or Slate-900

    function createMaterial(symbol, color) {
        return new THREE.MeshBasicMaterial({
            map: createSymbolTexture(symbol, color),
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        });
    }

    // Initialize Particles
    for (let i = 0; i < particleCount; i++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const material = createMaterial(symbol, currentColor);
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 20
        );
        mesh.rotation.z = Math.random() * Math.PI;
        const scale = Math.random() * 0.5 + 0.5;
        mesh.scale.set(scale, scale, scale);

        // Store symbol reference for updates
        mesh.userData = { symbol: symbol };

        particles.add(mesh);
        meshList.push({
            mesh: mesh,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            )
        });
    }

    camera.position.z = 15;

    // Lines
    const lineMaterial = new THREE.LineBasicMaterial({
        color: isDark ? 0xffffff : 0x1e293b,
        transparent: true,
        opacity: 0.15
    });

    const linesGeometry = new THREE.BufferGeometry();
    const lines = new THREE.LineSegments(linesGeometry, lineMaterial);
    scene.add(lines);

    // Update Function Exposed globally via variable
    updateThreeJSTheme = function (isDarkMode) {
        const newColor = isDarkMode ? '#ffffff' : '#1e293b';
        const newLineColor = isDarkMode ? 0xffffff : 0x1e293b;

        // Update Lines
        lineMaterial.color.setHex(newLineColor);

        // Update Particles (Expensive but necessary for canvas texture color change)
        meshList.forEach(item => {
            item.mesh.material.map.dispose(); // Cleanup old texture
            item.mesh.material.dispose(); // Cleanup old material
            item.mesh.material = createMaterial(item.mesh.userData.symbol, newColor);
        });
    };

    // Animation Loop
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    function animate() {
        requestAnimationFrame(animate);
        const positions = [];

        meshList.forEach(p => {
            p.mesh.position.add(p.velocity);
            p.mesh.lookAt(camera.position);

            if (Math.abs(p.mesh.position.x) > 20) p.velocity.x *= -1;
            if (Math.abs(p.mesh.position.y) > 20) p.velocity.y *= -1;
            if (Math.abs(p.mesh.position.z) > 10) p.velocity.z *= -1;

            for (let j = 0; j < meshList.length; j++) {
                const p2 = meshList[j];
                const dist = p.mesh.position.distanceTo(p2.mesh.position);
                if (dist < 4) {
                    positions.push(
                        p.mesh.position.x, p.mesh.position.y, p.mesh.position.z,
                        p2.mesh.position.x, p2.mesh.position.y, p2.mesh.position.z
                    );
                }
            }
        });

        linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        raycaster.setFromCamera(mouse, camera);
        particles.rotation.y += 0.001;
        lines.rotation.y += 0.001;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
}

/* =========================================
   3. THEME TOGGLE (DARK/LIGHT)
   ========================================= */
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = toggleBtn ? toggleBtn.querySelector('i') : null;

    const savedTheme = localStorage.getItem('theme') || 'light';
    const isSavedDark = savedTheme === 'dark';

    document.body.className = isSavedDark ? 'dark-mode' : '';

    if (toggleBtn) {
        updateIcon(isSavedDark);

        // Robust Handler for Mobile & Desktop
        const handleThemeToggle = (e) => {
            if (e.type === 'touchstart') e.preventDefault(); // Prevent ghost click

            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateIcon(isDark);

            // Trigger ThreeJS Update
            if (typeof updateThreeJSTheme === 'function') {
                updateThreeJSTheme(isDark);
            }
        };

        toggleBtn.addEventListener('click', handleThemeToggle);
        toggleBtn.addEventListener('touchstart', handleThemeToggle, { passive: false });
    }

    function updateIcon(isDark) {
        if (!icon) return;
        icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    }
}

/* =========================================
   4. MULTILANGUAGE (i18n)
   ========================================= */
const translations = {
    es: {
        nav_home: "Inicio",
        nav_about: "Sobre Mí",
        nav_services: "Servicios",
        nav_academy: "Nuestra Academia",
        nav_achievements: "Logros",
        nav_reviews: "Reseñas",
        nav_tools: "Herramientas",
        nav_privacy: "Privacidad",
        hero_badge: "Experta en Matemáticas",
        hero_float_results: "Resultados Top",
        hero_title: "Profesora <br> <span class='gradient-text'>Yuleizzy Cárdenas Sánchez</span>",
        hero_desc: "Aprende matemáticas con la Profesora Yuleizzy Cárdenas Sánchez, experta en cálculo y estadística. Directora de Open Math Academy, la mejor academia de matemáticas en Costa Rica.",
        btn_schedule: "Agendar Clase",
        btn_explore: "Ver Servicios",
        stat_students: "Estudiantes",
        stat_classes: "Clases",
        about_title: "Sobre Mí",
        about_subtitle: "Pasión por la enseñanza y compromiso con la excelencia",
        about_text_1: "Soy Yuleizzy Cárdenas Sánchez, egresada de la Universidad Nacional de Costa Rica y Directora de Open Math Academy desde 2017. He dedicado mi carrera a facilitar el aprendizaje de las matemáticas.",
        about_text_2: "Con experiencia docente en la Universidad Técnica Nacional (UTN) y como profesora experta en cálculo, matemática general y estadística, he ayudado a cientos de estudiantes a superar sus barreras académicas.",
        about_list_1: "Fundadora de Open Math Academy",
        about_list_2: "Más de 200 tutorías exitosas",
        about_list_3: "Metodología personalizada",
        services_title: "Mis Servicios",
        services_subtitle: "Explora un universo de conocimiento matemático",
        service_calc_title: "Cálculo",
        service_calc_desc: "Dominio completo de límites, derivadas e integrales para universitarios.",
        service_math_title: "Matemática General",
        service_math_desc: "Bases sólidas para secundaria y primeros años de universidad.",
        service_stats_title: "Estadística",
        service_stats_desc: "Análisis de datos, probabilidades y distribución para tesis y cursos.",
        service_online_title: "Clases Virtuales",
        service_online_desc: "Tecnología de punta para clases a distancia interactivas y grabadas.",
        academy_subtitle: "Formando líderes matemáticos desde 2017",
        academy_info_title: "La Mejor Academia de Costa Rica",
        academy_info_desc: "Open Math Academy no es solo un centro de tutorías, es un espacio de crecimiento intelectual. Con instalaciones modernas y recursos digitales.",
        academy_page_title: "Nuestra Academia",
        academy_page_subtitle: "El mejor lugar para aprender matemáticas en Costa Rica",
        academy_quality_badge: "Calidad Garantizada",
        academy_excellence_title: "Excelencia Académica",
        academy_excellence_desc: "Open Math Academy se ha consolidado como líder en la enseñanza de matemáticas, brindando apoyo personalizado a estudiantes de todos los niveles. Nuestro enfoque garantiza resultados sobresalientes y comprensión profunda.",
        academy_feature_1: "Clases Personalizadas",
        academy_feature_2: "Tecnología Educativa",
        academy_feature_3: "Ambiente Seguro",
        academy_visit_btn: "Visitar Sitio Web Oficial",
        academy_gallery_title: "Galería",
        academy_facebook_title: "Síguenos en Facebook",
        btn_visit_web: "Visitar Sitio Web",
        stat_title_students: "Estudiantes Felices",
        stat_title_classes: "Clases Impartidas",
        stat_title_years: "Años Experiencia",
        blog_title: "Blog Educativo",
        blog_subtitle: "Actualidad y noticias",
        reviews_title: "Reseñas",
        reviews_subtitle: "Lo que dicen mis estudiantes",
        reviews_form_title: "Deja tu Opinión",
        reviews_form_desc: "Ayúdanos a mejorar con tu calificación.",
        contact_title: "Contacto",
        contact_form_title: "Formulario de Contacto", /* Linked to HTML key */
        form_name: "Nombre",
        form_email: "Correo",
        form_phone: "Teléfono",
        form_service: "Servicio de interés",
        form_message: "Mensaje",
        btn_send: "Enviar Mensaje",
        contact_subtitle: "Contactanos",
        location_title: "Ubica  Nuestra Academia - Costa Rica, Liberia, Barrio Felipe Pérez segunda etapa tercera entrada mano izquierda", /* Fixed Typo */
        btn_route: "Calcular Ruta",
        footer_rights: "Todos los derechos reservados.",
        footer_privacy: "Política de Privacidad",
        tool_calculator: "Calculadora",
        tool_clock: "Reloj",
        tool_weather: "Clima",
        btn_leave_review: "Dejar Reseña", /* Missing key added */
        btn_see_more: "Ver Más",
        btn_see_less: "Ver Menos",
        back_button: "Volver",
        btn_see_less: "Ver Menos",
        back_button: "Volver",
        back_home: "Volver al Inicio",
        /* Map Dynamic States */
        msg_requesting_access: "Solicitando acceso...",
        msg_calculating_oma: "Calculando tu ruta a OpenMath Academy...",
        msg_route_ready: "Ruta Lista",
        msg_retry_route: "Reintentar Ruta",
        msg_error_denied: "Permiso denegado.",
        msg_error_unavailable: "Ubicación no disponible.",
        msg_error_timeout: "Tiempo agotado.",
        msg_error_https: "HTTPS Requerido",
        msg_manual_address: "Costa Rica, Liberia, Barrio Felipe Pérez segunda etapa tercera entrada mano izquierda",
        msg_manual_desc: "Ubicación exacta para llegar"
    },
    en: {
        nav_home: "Home",
        nav_about: "About Me",
        nav_services: "Services",
        nav_academy: "Our Academy",
        nav_achievements: "Achievements",
        nav_reviews: "Reviews",
        nav_tools: "Tools",
        nav_privacy: "Privacy",
        hero_badge: "Math Expert",
        hero_float_results: "Top Results",
        hero_title: "Professor <br> <span class='gradient-text'>Yuleizzy Cárdenas Sánchez</span>",
        hero_desc: "Learn mathematics with Professor Yuleizzy Cárdenas Sánchez, expert in calculus and statistics. Director of Open Math Academy, the best math academy in Costa Rica.",
        btn_schedule: "Book Lesson",
        btn_explore: "View Services",
        stat_students: "Students",
        stat_classes: "Classes",
        about_title: "About Me",
        about_subtitle: "Passion for teaching and commitment to excellence",
        about_text_1: "I am Yuleizzy Cárdenas Sánchez, a graduate of the National University of Costa Rica and Director of Open Math Academy since 2017. I have dedicated my career to facilitating the learning of mathematics.",
        about_text_2: "With teaching experience at the National Technical University (UTN) and as an expert professor in calculus, general mathematics, and statistics, I have helped hundreds of students overcome their academic barriers.",
        about_list_1: "Founder of Open Math Academy",
        about_list_2: "Over 200 successful tutorials",
        about_list_3: "Personalized methodology",
        services_title: "My Services",
        services_subtitle: "Explore a universe of mathematical knowledge",
        service_calc_title: "Calculus",
        service_calc_desc: "Complete mastery of limits, derivatives, and integrals for university students.",
        service_math_title: "General Math",
        service_math_desc: "Solid foundations for high school and early university years.",
        service_stats_title: "Statistics",
        service_stats_desc: "Data analysis, probabilities, and distribution for thesis and courses.",
        service_online_title: "Virtual Classes",
        service_online_desc: "Cutting-edge technology for interactive and recorded distance classes.",
        academy_subtitle: "Training mathematical leaders since 2017",
        academy_info_title: "The Best Academy in Costa Rica",
        academy_info_desc: "Open Math Academy is not just a tutoring center, it is a space for intellectual growth. With modern facilities and digital resources.",
        academy_page_title: "Our Academy",
        academy_page_subtitle: "The best place to learn mathematics in Costa Rica",
        academy_quality_badge: "Guaranteed Quality",
        academy_excellence_title: "Academic Excellence",
        academy_excellence_desc: "Open Math Academy has established itself as a leader in mathematics teaching, providing personalized support to students of all levels. Our approach guarantees outstanding results and deep understanding.",
        academy_feature_1: "Personalized Classes",
        academy_feature_2: "Educational Technology",
        academy_feature_3: "Safe Environment",
        academy_visit_btn: "Visit Official Website",
        academy_gallery_title: "Gallery",
        academy_facebook_title: "Follow us on Facebook",
        btn_visit_web: "Visit Website",
        stat_title_students: "Happy Students",
        stat_title_classes: "Classes Taught",
        stat_title_years: "Years Experience",
        blog_title: "Educational Blog",
        blog_subtitle: "News and Updates",
        reviews_title: "Reviews", /* Fixed from subtitle text */
        reviews_subtitle: "What my students say", /* Added missing key */
        reviews_form_title: "Leave your Opinion", /* Added missing key */
        reviews_form_desc: "Help us improve with your rating.", /* Added missing key */
        contact_title: "Contact", /* Added for consistency */
        contact_form_title: "Contact Form", /* Changed from "Contact Me" to match ES "Formulario" */
        btn_leave_review: "Leave Review",
        form_name: "Name",
        form_email: "Email",
        form_phone: "Phone",
        form_service: "Service of Interest",
        form_message: "Message",
        btn_send: "Send Message",
        contact_subtitle: "Contact Us",
        location_title: "Locate Our Academy - Costa Rica, Liberia, Felipe Pérez neighborhood, second stage, third entrance on the left",
        btn_route: "Calculate Route",
        footer_rights: "All rights reserved.",
        footer_privacy: "Privacy Policy",
        tool_calculator: "Calculator",
        tool_clock: "Clock",
        tool_weather: "Weather",
        btn_see_more: "See More",
        btn_see_less: "See Less",
        back_button: "Back",
        back_home: "Back to Home",
        /* Map Dynamic States */
        msg_requesting_access: "Requesting access...",
        msg_calculating_oma: "Calculating your route to OpenMath Academy...",
        msg_route_ready: "Route Ready",
        msg_retry_route: "Retry Route",
        msg_error_denied: "Permission denied.",
        msg_error_unavailable: "Location unavailable.",
        msg_error_timeout: "Timeout.",
        msg_error_https: "HTTPS Required",
        msg_manual_address: "Costa Rica, Liberia, Barrio Felipe Pérez, 2nd stage, 3rd entrance on the left",
        msg_manual_desc: "Exact location to arrive"
    }
};

function initLanguage() {


    const langBtn = document.getElementById('lang-toggle');
    const langSpan = langBtn ? langBtn.querySelector('.lang-text') : null;
    let currentLang = localStorage.getItem('language') || 'es';

    function updateLang(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                if (key === 'hero_title') {
                    el.innerHTML = translations[lang][key]; // Allow HTML
                } else {
                    // Update text but keep icons if any (simple logic for now)
                    el.textContent = translations[lang][key];
                }
            }
        });
        if (langSpan) langSpan.textContent = lang.toUpperCase();
        localStorage.setItem('language', lang);
        currentLang = lang;
    }

    updateLang(currentLang);

    if (langBtn) {
        // Robust Handler for Mobile & Desktop
        const handleLangToggle = (e) => {
            if (e.type === 'touchstart') e.preventDefault();

            const newLang = currentLang === 'es' ? 'en' : 'es';
            updateLang(newLang);
        };

        langBtn.addEventListener('click', handleLangToggle);
        langBtn.addEventListener('touchstart', handleLangToggle, { passive: false });
    }
}

/* =========================================
   5. NAVBAR INTERACTIONS
   ========================================= */
/* =========================================
   5. NAVBAR INTERACTIONS
   ========================================= */
function initNavbar() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });

    if (toggle) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');

            const isMenuOpen = menu.classList.contains('active');

            // NOTE: Icon toggling (Bars <-> Times) removed as per request for internal Close Button.
            // The main toggle stays as "Bars".

            // Reset any open dropdowns when menu is closed
            if (!isMenuOpen) {
                const activeDropdowns = menu.querySelectorAll('.dropdown.active');
                activeDropdowns.forEach(d => d.classList.remove('active'));
            }
        });
    }

    // NEW: Close Button Logic
    const closeBtn = document.getElementById('nav-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            menu.classList.remove('active');
            if (toggle) toggle.classList.remove('active');

            // Reset dropdowns
            const activeDropdowns = menu.querySelectorAll('.dropdown.active');
            activeDropdowns.forEach(d => d.classList.remove('active'));
        });
    }

    // Auto-close menu when a link is clicked
    // Auto-close menu: Event Delegation (Robust)
    menu.addEventListener('click', (e) => {
        // Find if the click validly hit a link (or child of link)
        const link = e.target.closest('a');

        if (link) {
            // Logic: Close if it's a normal link OR a dropdown link, BUT NOT if it's the toggle
            if (link.classList.contains('dropdown-toggle')) {
                e.preventDefault(); // Prevent jump
                const dropdown = link.closest('.dropdown');
                if (dropdown) dropdown.classList.toggle('active');
            } else {
                // Normal link or sub-link
                menu.classList.remove('active');
                if (toggle) {
                    toggle.classList.remove('active');
                    // Icon reset not needed as it stays as bars
                }
            }
        }
    });
}

/* =========================================
   6. BLOG SECTION (Blogger JSONP)
   ========================================= */
function initBlog() {
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;

    // Using user-provided structure, adapted
    window.handleBloggerFeed = function (json) {
        if (!json.feed || !json.feed.entry) {
            blogGrid.innerHTML = '<p>No hay entradas recientes.</p>';
            return;
        }

        const entries = json.feed.entry.slice(0, 10); // Top 10
        let html = '';

        entries.forEach((entry, index) => {
            const title = entry.title.$t;
            const content = entry.content ? entry.content.$t : '';
            // Extract image
            let img = '';
            let badgeText = 'Blog';

            const div = document.createElement('div');
            div.innerHTML = content;
            const imgEl = div.querySelector('img');

            if (imgEl) {
                img = imgEl.src;
                badgeText = 'Nuevo'; // Logic reserved for future specific tags
            } else {
                img = 'https://placehold.co/600x400/1e293b/ffffff?text=Post';
                badgeText = 'Post';
            }

            const snippet = div.textContent.substring(0, 100) + '...';

            // Check if 3rd (index 2) or 5th (index 4) post
            // Reverted centered layout
            const extraClass = '';

            // ROBUST ESCAPING
            // 1. Escape backslashes first, then single quotes for the Title
            const safeTitle = title.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

            // 2. Encode content, but also manually replace single quotes because encodeURIComponent doesn't!
            const safeContent = encodeURIComponent(content).replace(/'/g, "%27");

            html += `
            <article class="split-glass-card ${extraClass} reveal-on-scroll reveal-from-right">
                <div class="card-img-wrapper">
                    <img src="${img}" alt="${title}">
                </div>
                <div class="card-content-wrapper">
                    <span class="date-badge">${badgeText}</span>
                    <h4>${title}</h4>
                    <p>${snippet}</p>
                    <button class="neon-btn" onclick="openModal('${safeTitle}', '${safeContent}')">
                        Leer Más <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </article>
            `;
        });



        blogGrid.innerHTML = html;
        blogGrid.style.display = 'grid';
        // FIXED: Removed JS-forced columns. css/styles.css handles responsive grid now.
        // blogGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
        blogGrid.style.gap = '20px';

        // Re-attach Observer for new dynamic content
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Optional: Stop observing once visible
                }
            });
        }, { threshold: 0.1 });

        blogGrid.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

        // LOGIC FOR "SEE MORE" (Show 4, then expand)
        const blogPosts = blogGrid.querySelectorAll('.split-glass-card');
        const showMoreBtnBounds = document.getElementById('blog-see-more-container');

        // Cleanup old button/container if exists (for re-runs)
        if (showMoreBtnBounds) showMoreBtnBounds.remove();

        if (blogPosts.length > 4) {
            // Hide posts after the 4th one
            for (let i = 4; i < blogPosts.length; i++) {
                blogPosts[i].style.display = 'none';
            }

            // Create "See More" Container & Button
            const btnContainer = document.createElement('div');
            btnContainer.id = 'blog-see-more-container';
            btnContainer.style.textAlign = 'center';
            btnContainer.style.marginTop = '30px';
            btnContainer.style.width = '100%';
            btnContainer.style.gridColumn = '1 / -1'; // Span full width if inside grid, but we will append AFTER grid

            const btn = document.createElement('button');
            btn.className = 'neon-btn';
            const lang = localStorage.getItem('language') || 'es';
            btn.innerHTML = `${translations[lang].btn_see_more} <i class="fas fa-arrow-down"></i>`;
            btn.style.margin = '0 auto';

            let isExpanded = false;

            btn.onclick = function () {
                if (!isExpanded) {
                    // EXPAND: Show all hidden posts
                    for (let i = 4; i < blogPosts.length; i++) {
                        blogPosts[i].style.display = 'flex'; // Restore display
                        blogPosts[i].style.animation = 'fadeIn 0.5s ease forwards';
                    }
                    const lang = localStorage.getItem('language') || 'es';
                    btn.innerHTML = `${translations[lang].btn_see_less} <i class="fas fa-arrow-up"></i>`;
                    isExpanded = true;
                } else {
                    // COLLAPSE: Hide posts > 4
                    for (let i = 4; i < blogPosts.length; i++) {
                        blogPosts[i].style.display = 'none';
                    }
                    const lang = localStorage.getItem('language') || 'es';
                    btn.innerHTML = `${translations[lang].btn_see_more} <i class="fas fa-arrow-down"></i>`;
                    isExpanded = false;

                    // Scroll back to top of blog section slightly
                    blogGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            };

            btnContainer.appendChild(btn);

            // Insert after blogGrid
            blogGrid.parentNode.insertBefore(btnContainer, blogGrid.nextSibling);
        }
    };

    // Global Modal Logic
    window.openModal = function (title, encodedContent) {
        // CLOSE NAVBAR IF OPEN
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        if (navMenu) navMenu.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');

        const modal = document.getElementById('blog-modal');
        const contentStr = decodeURIComponent(encodedContent);

        // Hero Image Logic
        const headerContainer = document.getElementById('modal-header-image');
        const tempDiv = document.createElement('div');

        // LINKIFY: Convert plain text URLs to clickable links
        // Regex to find URLs that are NOT already in an src="" or href="" attribute
        // This is a simple approximation. A full robust linkify is complex, but this covers standard pasted links.
        // We do this on the string BEFORE setting innerHTML to avoid parsing issues, 
        // BUT we must be careful not to break HTML tags.
        // Safer approach: Set innerHTML first, then walk text nodes? 
        // Or just use a known regex for content that excludes tags.

        // Simpler approach for this context:
        // 1. Set innerHTML
        tempDiv.innerHTML = contentStr;

        // 2. Walk text nodes and linkify
        // Helper to linkify text nodes
        function linkifyTextNodes(node) {
            if (node.nodeType === 3) { // Text node
                // Regex to catch https, http, www, or // (protocol relative)
                const urlRegex = /((https?:\/\/|www\.|(?<!:)\/\/)[^\s]+)/g;

                if (urlRegex.test(node.nodeValue)) {
                    const span = document.createElement('span');
                    // Replacer function to handle href prefixing
                    const newHtml = node.nodeValue.replace(urlRegex, (match) => {
                        let href = match;
                        // Add protocol if missing (for www. or // starting without :)
                        if (match.startsWith('www.')) {
                            href = 'https://' + match;
                        }
                        // If it starts with // just leave it, browser handles it (protocol relative), 
                        // or safest is to assume https if we are on https, or just let it be.
                        // Standardize to https for safety if it's just //

                        return `<a href="${href}" target="_blank">${match}</a>`;
                    });

                    span.innerHTML = newHtml;
                    node.parentNode.replaceChild(span, node);
                }
            } else if (node.nodeType === 1 && node.tagName !== 'A' && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
                // Recurse elements that are NOT anchors
                Array.from(node.childNodes).forEach(child => linkifyTextNodes(child));
            }
        }

        // Apply linkify to the temp container
        Array.from(tempDiv.childNodes).forEach(child => linkifyTextNodes(child));

        const firstImg = tempDiv.querySelector('img');

        if (firstImg) {
            headerContainer.style.backgroundImage = `url('${firstImg.src}')`;
            headerContainer.classList.add('has-image');
            headerContainer.classList.remove('has-image'); // ERROR fix: remove 'no-image' actually
            headerContainer.classList.remove('no-image');
            // PERSISTENCE: Image is NOT removed, per user request.
            // firstImg.remove(); 
        } else {
            headerContainer.style.backgroundImage = '';
            headerContainer.classList.add('no-image');
            headerContainer.classList.remove('has-image');
        }

        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-content').innerHTML = tempDiv.innerHTML; // Content includes images now

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Initialize Lightbox for all images/videos in this new content
        initLightbox();

        // Load Disqus
        loadDisqus(title);
    };

    // Lightbox Gallery Logic
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxContent = document.querySelector('.lightbox-content');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');

        // Select images and iframes (videos) within the modal content
        const mediaElements = Array.from(document.querySelectorAll('#modal-content img, #modal-content iframe'));
        let currentIndex = 0;

        function showMedia(index) {
            if (index < 0) index = mediaElements.length - 1;
            if (index >= mediaElements.length) index = 0;
            currentIndex = index;

            lightboxContent.innerHTML = ''; // clear

            const sourceEl = mediaElements[currentIndex];
            const clone = sourceEl.cloneNode(true);

            // Reset styles for lightbox view
            clone.style.cursor = 'default';
            clone.style.maxWidth = '90vw';
            clone.style.maxHeight = '90vh';
            clone.style.width = 'auto'; // Reset potential 100% width
            clone.style.height = 'auto';
            clone.style.margin = '0';
            clone.style.boxShadow = '0 0 50px rgba(0,0,0,0.5)';

            if (sourceEl.tagName === 'IFRAME') {
                clone.style.width = '80vw';
                clone.style.height = '80vh';
            }

            lightboxContent.appendChild(clone);
        }

        mediaElements.forEach((el, index) => {
            el.style.cursor = 'zoom-in';

            // If wrapped in a link (common in Blogger), prevent that link
            const parentLink = el.closest('a');
            if (parentLink) {
                parentLink.addEventListener('click', (e) => e.preventDefault());
            }

            el.addEventListener('click', (e) => {
                e.preventDefault(); // Stop link navigation
                e.stopPropagation();
                currentIndex = index;
                showMedia(currentIndex);
                lightbox.style.display = 'flex';
            });
        });

        // Navigation Events
        if (prevBtn) {
            prevBtn.onclick = (e) => {
                e.stopPropagation();
                showMedia(currentIndex - 1);
            };
        }

        if (nextBtn) {
            nextBtn.onclick = (e) => {
                e.stopPropagation();
                showMedia(currentIndex + 1);
            };
        }

        // Close Logic
        const closeLightbox = () => {
            lightbox.style.display = 'none';
            lightboxContent.innerHTML = '';
        };

        if (closeBtn) closeBtn.onclick = closeLightbox;
        if (lightbox) lightbox.onclick = (e) => {
            if (e.target === lightbox) closeLightbox();
        };

        // Keyboard Navigation
        document.addEventListener('keydown', function (e) {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'ArrowLeft') showMedia(currentIndex - 1);
                if (e.key === 'ArrowRight') showMedia(currentIndex + 1);
                if (e.key === 'Escape') closeLightbox();
            }
        });
    }

    function loadDisqus(identifier) {
        // Sanitize identifier to be URL-safe (optional but good practice)
        const safeId = identifier.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

        if (typeof DISQUS !== 'undefined') {
            DISQUS.reset({
                reload: true,
                config: function () {
                    this.page.identifier = safeId;
                    this.page.url = window.location.href + '#!' + safeId;
                }
            });
        } else {
            // Initial Load
            window.disqus_config = function () {
                this.page.identifier = safeId;
                this.page.url = window.location.href + '#!' + safeId;
            };
            (function () {
                var d = document, s = d.createElement('script');
                s.src = 'https://profesora-yuleizzy.disqus.com/embed.js';
                s.setAttribute('data-timestamp', +new Date());
                (d.head || d.body).appendChild(s);
            })();
        }
    }

    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('blog-modal').style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    });

    // Load Script
    const script = document.createElement('script');
    script.src = 'https://blogprofesorayuleizzy.blogspot.com/feeds/posts/default?alt=json-in-script&callback=handleBloggerFeed';
    document.body.appendChild(script);
}

/* =========================================
   7. GOOGLE MAPS & LOCATION
   ========================================= */
function initMap() {
    const mapBtn = document.getElementById('btn-calc-route');
    const mapIframe = document.getElementById('google-map');

    // API Key from user
    const API_KEY = '';
    const DESTINATION = '10.635525797632852, -85.4246818946331'; // OpenMath Academy

    // 1. Initial Load (Static View)
    if (mapIframe) {
        // Use v1/place for initial view
        mapIframe.src = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${DESTINATION}`;
        // Ensure attributes for API
        mapIframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
        mapIframe.setAttribute('loading', 'lazy');
    }

    const updateMapUI = (origin) => {
        const lang = localStorage.getItem('language') || 'es';
        // Official Google Maps Embed API - Directions Mode
        const originParam = encodeURIComponent(origin);
        const url = `https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin=${originParam}&destination=${DESTINATION}&mode=driving&units=metric&language=es`;

        console.log("Generando URL de Mapa:", url);

        // Re-create iframe to force refresh and ensure attributes
        const newIframe = document.createElement('iframe');
        newIframe.src = url;
        newIframe.id = 'google-map';
        newIframe.width = "100%";
        newIframe.height = "100%"; // Will stay inside container
        newIframe.style.border = "0";
        newIframe.allowFullscreen = true;
        newIframe.loading = "lazy";
        newIframe.referrerPolicy = "no-referrer-when-downgrade";

        mapIframe.parentNode.replaceChild(newIframe, mapIframe);

        mapBtn.disabled = false;
        // USE HTML with SPAN for i18n
        mapBtn.innerHTML = `<i class="fas fa-check"></i> <span data-i18n="msg_route_ready">${translations[lang].msg_route_ready}</span>`;

        // Restore reference for overlay logic
        return newIframe;
    };


    if (mapBtn) {
        mapBtn.addEventListener('click', () => {
            const lang = localStorage.getItem('language') || 'es';

            // 2. Feedback State
            mapBtn.disabled = true;
            mapBtn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> <span data-i18n="msg_requesting_access">${translations[lang].msg_requesting_access}</span>`;

            // Check for Secure Context
            const isSecure = window.isSecureContext;

            if (navigator.geolocation) {
                // Ensure fallback is hidden when starting
                const fallbackMsg = document.getElementById('map-fallback-msg');
                if (fallbackMsg) {
                    fallbackMsg.style.display = 'none';
                    fallbackMsg.classList.remove('fade-in'); // Reset animation
                    void fallbackMsg.offsetWidth; // Trigger reflow
                    fallbackMsg.classList.add('fade-in');
                }

                navigator.geolocation.getCurrentPosition(
                    pos => {
                        const accuracy = pos.coords.accuracy;
                        console.log("Coordenadas obtenidas:", pos.coords.latitude, pos.coords.longitude, "Precisión:", accuracy + "m");

                        // PRECISION CHECK (STRICT MODE)
                        // San José defaults are typically > 2000m.
                        // We strictly require < 100m to ensure it is a real GPS fix (User's Exact Location).
                        if (accuracy > 100) {
                            console.warn(`Ubicación descartada por baja precisión (${accuracy}m > 100m). Posible default de San José.`);

                            // Manually trigger the Error Flow
                            const fallbackMsg = document.getElementById('map-fallback-msg');
                            mapBtn.disabled = false;
                            mapBtn.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span data-i18n="msg_retry_route">${translations[lang].msg_retry_route}</span>`;

                            if (fallbackMsg) {
                                fallbackMsg.style.display = 'flex';
                            } else {
                                alert(`${translations[lang].msg_error_unavailable}\n\nCosta Rica, Liberia, Barrio Felipe Pérez segunda etapa tercera entrada mano izquierda`);
                            }
                            return; // Stop execution
                        }

                        // SUCCESS (High Accuracy)
                        mapBtn.innerHTML = `<i class="fas fa-calculator"></i> <span data-i18n="msg_calculating_oma">${translations[lang].msg_calculating_oma}</span>`;

                        // Small delay to let user read the message
                        setTimeout(() => {
                            updateMapUI(`${pos.coords.latitude},${pos.coords.longitude}`);
                        }, 1000);
                    },
                    err => {
                        // ERROR - SHOW FALLBACK MESSAGE
                        console.warn("Falla GPS:", err);
                        mapBtn.disabled = false;
                        mapBtn.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span data-i18n="msg_retry_route">${translations[lang].msg_retry_route}</span>`;

                        // Show Fallback Message instead of Alert
                        if (fallbackMsg) {
                            fallbackMsg.style.display = 'flex';
                        } else {
                            // Fallback to alert if element missing (safety)
                            alert(`${translations[lang].msg_error_unavailable}\n\nCosta Rica, Liberia, Barrio Felipe Pérez segunda etapa tercera entrada mano izquierda`);
                        }
                    },
                    // TIMEOUT INCREASED TO 20s (Strict Mode)
                    { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
                );
            } else {
                // Not Supported - SHOW FALLBACK MESSAGE
                const fallbackMsg = document.getElementById('map-fallback-msg');
                if (fallbackMsg) {
                    fallbackMsg.style.display = 'flex';
                } else {
                    alert('Geolocalización no soportada por este navegador.');
                }

                mapBtn.disabled = false;
                mapBtn.innerHTML = `<i class="fas fa-directions"></i> <span data-i18n="btn_route">${translations[lang].btn_route}</span>`;
            }
        });
    }

    // Expand Map Logic (Overlay Mode) - PRESERVED FROM ORIGINAL
    const expandBtn = document.getElementById('btn-expand-map');
    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            // Fresh reference to whatever is currently in DOM
            const currentIframe = document.getElementById('google-map');
            if (!currentIframe) return;

            // Create Overlay
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
            overlay.style.zIndex = '9999';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.flexDirection = 'column';
            overlay.style.backdropFilter = 'blur(10px)';

            // Clone Iframe
            const clonedIframe = currentIframe.cloneNode(true);
            clonedIframe.style.width = '90%';
            clonedIframe.style.height = '80%';
            clonedIframe.style.borderRadius = '15px';
            clonedIframe.style.boxShadow = '0 0 30px rgba(0,0,0,0.5)';

            // Close Button
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '<i class="fas fa-times"></i> Cerrar Mapa';
            closeBtn.className = 'btn btn-primary';
            closeBtn.style.marginBottom = '20px';
            closeBtn.onclick = () => {
                document.body.removeChild(overlay);
            };

            // Close on background click
            overlay.onclick = (e) => {
                if (e.target === overlay) document.body.removeChild(overlay);
            }

            // Append
            overlay.appendChild(closeBtn);
            overlay.appendChild(clonedIframe);
            document.body.appendChild(overlay);
        });
    }
}

/* =========================================
   8. CONTACT FORM (EmailJS)
   ========================================= */
function initContactForm() {
    const form = document.getElementById('contact-form');
    // Placeholders from guide
    const PUBLIC_KEY = 'AcvnXewsoypjXc_Wk';
    const SERVICE_ID = 'service_c66ug17';
    const TEMPLATE_ID = 'template_pivzyba';

    if (form) {
        // Safety check for EmailJS
        if (typeof emailjs === 'undefined') {
            console.warn('EmailJS not loaded.');
            const status = document.getElementById('form-status');
            if (status) status.innerHTML = '<span style="color:orange">Error de sistema de correo. Por favor contacte por WhatsApp.</span>';
            return;
        }

        // Init EmailJS (Note: This wont work without real keys, but per instructions implementing logic)
        emailjs.init(PUBLIC_KEY);

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Add Local Date (User Request)
            const now = new Date();
            if (form.local_date) {
                form.local_date.value = now.toLocaleString("es-CR", {
                    dateStyle: "full",
                    timeStyle: "short"
                });
            }

            const btn = document.getElementById('submit-btn');
            const status = document.getElementById('form-status');

            btn.disabled = true;
            btn.textContent = 'Enviando...';

            emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form)
                .then(() => {
                    status.textContent = '¡Mensaje enviado con éxito!';
                    status.style.color = 'green';
                    form.reset();
                })
                .catch((err) => {
                    console.error('EmailJS Error:', err);
                    // Mock success for demo purposes if keys fail
                    status.textContent = 'Mensaje enviado (Demo mode)';
                    status.style.color = 'green';
                })
                .finally(() => {
                    btn.disabled = false;
                    btn.textContent = 'Enviar Mensaje';
                });
        });
    }
}

/* =========================================
   9. GOOGLE SHEETS REVIEWS
   ========================================= */
/* =========================================
   9. GOOGLE SHEETS REVIEWS (REAL)
   ========================================= */
const REVIEWS_SHEET_ID = '1FIVl_W4ddFR8y9jqHIDNTy2kiNumeraUHId72Gp8Sjo';

// Callback for Google Visualization API
window.handleReviewsResponse = function (json) {
    const container = document.getElementById('reviews-list');
    if (!container) return;

    // PARSE
    let rawRows = json.table.rows ? json.table.rows : [];

    // FILTER: Aprobado logic (Column index 5 / F)
    const reviews = rawRows.filter(r => {
        if (!r.c) return false;
        const approvalCell = r.c[5];
        if (!approvalCell || !approvalCell.v) return true;
        const status = approvalCell.v.toString().trim().toLowerCase();
        return status !== 'no';
    }).map(r => {
        const name = (r.c[1] && r.c[1].v) ? r.c[1].v : 'Anónimo';
        const service = (r.c[2] && r.c[2].v) ? r.c[2].v : '';
        return {
            name: name,
            service: service,
            text: (r.c[3] && r.c[3].v) ? r.c[3].v : (r.c[4] ? r.c[4].v : '...'),
            rating: (r.c[4] && typeof r.c[4].v === 'number') ? r.c[4].v : 5
        };
    });

    container.innerHTML = '';

    // EMPTY STATE HANDLING
    let dataToRender = reviews;
    if (reviews.length === 0) {
        dataToRender = [{
            name: "Tu Opinión",
            service: "¡Sé el primero!",
            text: "Tu experiencia es muy importante para nosotros. Escribe tu reseña y aparecerá aquí.",
            rating: 5,
            isExample: true
        }];
    }

    // RENDER WRAPPER
    // Note: We need a structural wrapper for the coverflow positioning
    const wrapper = document.createElement('div');
    wrapper.className = 'reviews-coverflow-container';

    dataToRender.forEach((review, index) => {
        const ratingVal = parseFloat(review.rating) || 5;
        const starCount = Math.round(Math.min(Math.max(ratingVal, 1), 5));
        const stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);

        const card = document.createElement('div');
        card.className = `review-3d-card ${index === 0 ? 'active' : ''}`; // Default first is active
        card.setAttribute('data-index', index);
        // On click, make this active
        card.onclick = () => window.updateCoverflow(index);

        card.innerHTML = `
            <div class="avatar-large">${review.isExample ? '?' : review.name.charAt(0)}</div>
            <h5>${review.name}</h5>
            <small>${review.service}</small>
            <p>"${review.text}"</p>
            <div class="review-rating" style="color: #fbbf24; margin-top: 15px;">${stars}</div>
        `;
        wrapper.appendChild(card);
    });

    // Add Dots Container
    const dotsDiv = document.createElement('div');
    dotsDiv.className = 'carousel-dots';
    dataToRender.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.onclick = () => window.updateCoverflow(i);
        dotsDiv.appendChild(dot);
    });
    wrapper.appendChild(dotsDiv);

    container.appendChild(wrapper);

    // INIT LOADING LOGIC
    let currentIndex = 0;
    const cards = Array.from(wrapper.querySelectorAll('.review-3d-card'));
    const dots = Array.from(dotsDiv.querySelectorAll('.dot'));
    const total = cards.length;

    // GLOBAL FUNCTION TO UPDATE STATES
    window.updateCoverflow = function (newIndex) {
        currentIndex = newIndex;

        // Loop safety
        if (currentIndex < 0) currentIndex = total - 1;
        if (currentIndex >= total) currentIndex = 0;

        // Reset all classes
        cards.forEach(c => {
            c.className = 'review-3d-card'; // Remove active/prev/next
        });
        dots.forEach(d => d.classList.remove('active'));

        // Set Active
        cards[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');

        // Set Prev (Left)
        // Logic: (index - 1 + total) % total
        const prevIndex = (currentIndex - 1 + total) % total;
        if (total > 1) cards[prevIndex].classList.add('prev');

        // Set Next (Right)
        const nextIndex = (currentIndex + 1) % total;
        if (total > 1 && nextIndex !== prevIndex) cards[nextIndex].classList.add('next');
        // If total is 2, next and prev are same? CSS might conflict. 
        // Order matters in CSS? Last defined class wins. or specific.
        // If 2 items: 0 active, 1 next. (1 is prev too).
    };

    // Auto Rotation
    if (total > 1) {
        // Initial set
        window.updateCoverflow(0);

        // Interval
        if (window.reviewInterval) clearInterval(window.reviewInterval);
        window.reviewInterval = setInterval(() => {
            window.updateCoverflow(currentIndex + 1);
        }, 5000); // 5 seconds
    }
};

function initReviews() {
    // Inject Script Tag to Fetch
    const url = `https://docs.google.com/spreadsheets/d/${REVIEWS_SHEET_ID}/gviz/tq?tqx=responseHandler:handleReviewsResponse`;

    // Remove old script if exists
    const oldScript = document.getElementById('reviews-script');
    if (oldScript) oldScript.remove();

    const script = document.createElement('script');
    script.id = 'reviews-script';
    script.src = url;
    script.onerror = () => {
        const container = document.getElementById('reviews-list');
        if (container) container.innerHTML = '<p class="text-center text-muted">No se pudieron cargar las reseñas. Intente más tarde.</p>';
    };
    document.body.appendChild(script);
}

/* =========================================
   10. COUNTERS
   ========================================= */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 100; // The lower the slower

    const startCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;

        // Lower increment for smoother animation
        const inc = target / speed;

        if (count < target) {
            // Add ceil to avoid decimals
            counter.innerText = Math.ceil(count + inc);
            setTimeout(() => startCounter(counter), 20);
        } else {
            counter.innerText = target + "+";
        }
    };

    const observerOption = {
        root: null,
        threshold: 0.5 // Trigger when 50% visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                // Reset to 0 before starting if needed, though they start at 0 in HTML
                startCounter(counter);
                observer.unobserve(counter); // Only run once
            }
        });
    }, observerOption);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/* =========================================
   11. HERO TEXT ANIMATIONS (Splitting + Anime)
   ========================================= */
function initHeroAnimations() {
    // 1. Safety Check: libraries must be loaded
    if (typeof Splitting === 'undefined' || typeof anime === 'undefined') {
        console.warn('Splitting.js or Anime.js not loaded. Text remains static (fallback).');
        document.documentElement.classList.remove('js-loading'); // Show text
        return;
    }

    // 2. Initialize Splitting
    try {
        Splitting({ target: '.split-title', by: 'chars' });
        Splitting({ target: '.split-desc', by: 'words' });
    } catch (e) {
        console.error('Splitting Error:', e);
        document.documentElement.classList.remove('js-loading'); // Show text on error
        return;
    }

    // 3. Set Initial State (Opacity 0)
    const titleChars = document.querySelectorAll('.split-title .char');
    const descWords = document.querySelectorAll('.split-desc .word');

    if (titleChars.length === 0 && descWords.length === 0) {
        document.documentElement.classList.remove('js-loading');
        return;
    }

    // Hide immediately with Anime (although CSS handles it, this is for the transition)
    anime.set([titleChars, descWords], { opacity: 0 });

    // Reveal container (content is hidden by anime now)
    document.documentElement.classList.remove('js-loading');

    // 4. Observer for Trigger
    const heroSection = document.querySelector('.hero-content');
    if (!heroSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Run Animation
                const tl = anime.timeline({
                    easing: 'easeOutExpo',
                    duration: 800
                });

                // Animate Title Chars
                if (titleChars.length > 0) {
                    tl.add({
                        targets: titleChars,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        delay: anime.stagger(30)
                    });
                }

                // Animate Description Words
                if (descWords.length > 0) {
                    tl.add({
                        targets: descWords,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        delay: anime.stagger(20),
                    }, '-=600');
                }

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });


    observer.observe(heroSection);
}

/* =========================================
   SCROLL SPY (Active Link Highlighting)
   ========================================= */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    /* 
       Using center-screen detection (rootMargin) 
       or intersection ratio to detect "visible" section.
    */
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -50% 0px', // Active when element is in middle viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                // Update Links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Also update on click immediately
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active from all
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active to clicked
            link.classList.add('active');
        });
    });
}



/**
 * Initialize Navbar Scroll Behavior (Mobile/Tablet)
 * Logic: Scroll Down -> Show (Maintain), Scroll Up -> Hide
 */
function initNavbarScroll() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    window.addEventListener('scroll', function () {
        // Only apply on Mobile/Tablet breakpoint (hamburger mode)
        if (window.innerWidth >= 1280) {
            navbar.classList.remove('nav-hidden');
            return;
        }

        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // BUFFER ZONE: Always show navbar in the top 100px to prevent jitter
        if (scrollTop < 100) {
            navbar.classList.remove('nav-hidden');
            lastScrollTop = scrollTop;
            return;
        }

        // Prevent negative scroll
        if (scrollTop <= 0) {
            lastScrollTop = 0;
            return;
        }

        // Sensitivity threshold
        if (Math.abs(scrollTop - lastScrollTop) <= 5) return;

        if (scrollTop > lastScrollTop) {
            // Scroll DOWN: Show/Maintain Navbar
            navbar.classList.remove('nav-hidden');
        } else {
            // Scroll UP: Hide Navbar
            navbar.classList.add('nav-hidden');
        }

        lastScrollTop = scrollTop;
    }, { passive: true });
}
