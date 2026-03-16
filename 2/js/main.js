/* ============================================
   SEM VERGONHA | DINE & PARTY
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    document.body.classList.add('loading');

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('loading');
            initRevealAnimations();
        }, 800);
    });

    // Fallback if load already fired
    if (document.readyState === 'complete') {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('loading');
            initRevealAnimations();
        }, 800);
    }

    // --- Custom Cursor ---
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');

    if (window.matchMedia('(pointer: fine)').matches && cursor && cursorFollower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .menu-tab, .gallery-item, input, select, textarea');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
                cursorFollower.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
                cursorFollower.classList.remove('hovering');
            });
        });
    }

    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    let lastScroll = 0;

    function handleHeaderScroll() {
        const currentScroll = window.scrollY;

        if (currentScroll > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // --- Mobile Menu ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.classList.toggle('menu-open');
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
    }

    hamburger.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    // --- Smooth Scroll for Nav Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // --- Reveal Animations (Intersection Observer) ---
    function initRevealAnimations() {
        const reveals = document.querySelectorAll('.reveal-up, .reveal-text');

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, parseFloat(delay) * 1000);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        reveals.forEach(el => revealObserver.observe(el));
    }

    // --- Counter Animation ---
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const countTo = parseInt(target.dataset.count);
                    const duration = 2000;
                    const startTime = performance.now();
                    const startValue = 0;

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(startValue + (countTo - startValue) * eased);

                        target.textContent = current;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            target.textContent = countTo;
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounters();

    // --- Menu Tabs ---
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuPanels = document.querySelectorAll('.menu-panel');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPanel = tab.dataset.tab;

            // Update tabs
            menuTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update panels
            menuPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.dataset.panel === targetPanel) {
                    panel.classList.add('active');

                    // Re-trigger reveal animations for menu items
                    const items = panel.querySelectorAll('.reveal-up');
                    items.forEach(item => {
                        item.classList.remove('revealed');
                        setTimeout(() => {
                            item.classList.add('revealed');
                        }, 50);
                    });
                }
            });
        });
    });

    // --- Gallery Hover Parallax ---
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const img = item.querySelector('img');

            img.style.transform = `scale(1.1) translate(${x * -10}px, ${y * -10}px)`;
        });

        item.addEventListener('mouseleave', () => {
            const img = item.querySelector('img');
            img.style.transform = 'scale(1)';
        });
    });

    // --- Parallax on Scroll ---
    function handleParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-image');
        parallaxElements.forEach(el => {
            const rect = el.parentElement.getBoundingClientRect();
            const speed = 0.3;
            const yPos = rect.top * speed;
            el.style.transform = `translateY(${yPos}px)`;
        });

        // Hero parallax
        const heroBg = document.querySelector('.hero-bg-image');
        if (heroBg) {
            const scrolled = window.scrollY;
            heroBg.style.transform = `scale(${1 + scrolled * 0.0002}) translateY(${scrolled * 0.3}px)`;
        }
    }

    window.addEventListener('scroll', handleParallax, { passive: true });

    // --- Reservation Form ---
    const reservationForm = document.getElementById('reservation-form');

    if (reservationForm) {
        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple form validation visual
            const requiredFields = reservationForm.querySelectorAll('[required]');
            let allValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#e74c3c';
                    allValid = false;

                    field.addEventListener('input', function handler() {
                        if (field.value.trim()) {
                            field.style.borderColor = '';
                            field.removeEventListener('input', handler);
                        }
                    });
                } else {
                    field.style.borderColor = '';
                }
            });

            if (!allValid) return;

            // Show success message
            const formContainer = reservationForm.parentElement;
            reservationForm.style.opacity = '0';
            reservationForm.style.transform = 'translateY(-10px)';
            reservationForm.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

            setTimeout(() => {
                reservationForm.style.display = 'none';

                const successEl = document.createElement('div');
                successEl.classList.add('form-success');
                successEl.innerHTML = `
                    <h3>Reserva Recebida!</h3>
                    <p>Obrigado pela sua reserva. Entraremos em contacto em breve para confirmar.</p>
                    <p style="margin-top: 16px; color: var(--color-gold); font-size: 0.85rem;">
                        Verifique o seu email para detalhes.
                    </p>
                `;
                successEl.style.opacity = '0';
                formContainer.appendChild(successEl);

                requestAnimationFrame(() => {
                    successEl.style.transition = 'opacity 0.5s ease';
                    successEl.style.opacity = '1';
                });
            }, 300);
        });
    }

    // --- Back to Top Button ---
    const backToTop = document.getElementById('back-to-top');

    function handleBackToTop() {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleBackToTop, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Active Nav Link Highlight ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function highlightActiveSection() {
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${id}`) {
                        link.style.color = 'var(--color-gold)';
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection, { passive: true });

    // --- Image Lazy Loading with Fade ---
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    lazyImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.6s ease';

        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
    });

    // --- Marquee Duplication for Seamless Loop ---
    const marquee = document.querySelector('.marquee');
    const marqueeContent = document.querySelector('.marquee-content');

    if (marquee && marqueeContent) {
        const clone = marqueeContent.cloneNode(true);
        marquee.appendChild(clone);
    }

    // --- Magnetic Button Effect (desktop only) ---
    if (window.matchMedia('(pointer: fine)').matches) {
        const magneticBtns = document.querySelectorAll('.btn-primary, .btn-outline, .social-link');

        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                setTimeout(() => {
                    btn.style.transition = '';
                }, 400);
            });
        });
    }

    // --- Tilt Effect on Experience Cards ---
    if (window.matchMedia('(pointer: fine)').matches) {
        const cards = document.querySelectorAll('.experience-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                const tiltX = (y - 0.5) * 6;
                const tiltY = (x - 0.5) * -6;

                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s ease';
                setTimeout(() => {
                    card.style.transition = '';
                }, 500);
            });
        });
    }

    // --- Smooth Hero Text Animation on Load ---
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .reveal-up, .hero .reveal-text');
        heroElements.forEach(el => {
            const delay = el.dataset.delay || 0;
            setTimeout(() => {
                el.classList.add('revealed');
            }, parseFloat(delay) * 1000);
        });
    }, 1000);

});
