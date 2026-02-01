// ============================================================
// 1. Copyright year — auto-update
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    var yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ============================================================
// 2. Smooth scrolling + service-param pre-fill
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        var href = this.getAttribute('href');
        var parts = href.split('?');
        var targetId = parts[0];
        var params = parts[1] || '';
        var target = document.querySelector(targetId);
        if (!target) return;

        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });

        // Pre-fill service dropdown when a pricing button is clicked
        if (params.indexOf('service=') !== -1) {
            var value = params.split('service=')[1];
            setTimeout(function () {
                var sel = document.getElementById('service');
                if (!sel) return;
                sel.value = value;
                sel.style.borderColor = 'var(--primary)';
                sel.style.boxShadow = '0 0 0 3px rgba(45,156,219,0.2)';
                setTimeout(function () {
                    sel.style.borderColor = '';
                    sel.style.boxShadow = '';
                }, 2000);
            }, 800);
        }

        // Close mobile menu if open
        var mm = document.querySelector('.nav-links');
        if (mm && mm.classList.contains('active')) toggleMobileMenu();
    });
});

// ============================================================
// 3. Mobile menu
// ============================================================
var mobileMenuToggle = document.querySelector('.mobile-menu-toggle');

function toggleMobileMenu() {
    var menu = document.querySelector('.nav-links');
    menu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    var spans = mobileMenuToggle.querySelectorAll('span');
    if (mobileMenuToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

// Inject mobile nav + ripple keyframes once
var injectedStyle = document.createElement('style');
injectedStyle.textContent =
    '@keyframes ripple { to { transform: scale(4); opacity: 0; } } ' +
    '@media (max-width: 968px) { ' +
        '.nav-links { position:fixed; top:70px; left:0; right:0; ' +
            'background:white; flex-direction:column; padding:24px; ' +
            'box-shadow:0 8px 16px rgba(0,0,0,0.1); ' +
            'transform:translateY(-100%); opacity:0; ' +
            'transition:transform 0.3s ease, opacity 0.3s ease; ' +
            'pointer-events:none; } ' +
        '.nav-links.active { display:flex; transform:translateY(0); ' +
            'opacity:1; pointer-events:all; } ' +
        '.nav-links li { margin:8px 0; } ' +
    '}';
document.head.appendChild(injectedStyle);

// ============================================================
// 4. Navbar shadow on scroll
// ============================================================
var navbar = document.querySelector('.navbar');
window.addEventListener('scroll', function () {
    if (!navbar) return;
    navbar.style.boxShadow = window.pageYOffset > 100
        ? '0 2px 20px rgba(0,0,0,0.1)'
        : '0 2px 8px rgba(0,0,0,0.04)';
});

// ============================================================
// 5. Fade-in on scroll (Intersection Observer)
// ============================================================
var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.service-card, .step, .pricing-card, .testimonial-card, .faq-item, .stat-item')
    .forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });

// ============================================================
// 6. Animated stat counters  (fires once when .stats scrolls in)
// ============================================================
function animateCounter(element, target, duration) {
    duration = duration || 1800;
    var suffixEl = element.querySelector('.stat-suffix');
    var suffix = suffixEl ? suffixEl.textContent : '';
    var start = 0;
    var step = target / (duration / 16);

    var timer = setInterval(function () {
        start += step;
        if (start >= target) {
            element.textContent = (target >= 1000 ? target.toLocaleString() : String(target)) + suffix;
            clearInterval(timer);
        } else {
            var current = Math.floor(start);
            element.textContent = (current >= 1000 ? current.toLocaleString() : String(current)) + suffix;
        }
    }, 16);
}

var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.stat-number').forEach(function (el) {
            var t = parseInt(el.dataset.target, 10);
            if (!isNaN(t)) animateCounter(el, t);
        });
        statsObserver.unobserve(entry.target);
    });
}, { threshold: 0.4 });

var statsSection = document.querySelector('.stats');
if (statsSection) statsObserver.observe(statsSection);

// ============================================================
// 7. Contact form
// ============================================================
var contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = contactForm.querySelector('button[type="submit"]');
        var original = btn.textContent;
        btn.textContent = 'Sending\u2026';
        btn.disabled = true;

        var data = {
            name:         document.getElementById('name').value,
            email:        document.getElementById('email').value,
            phone:        document.getElementById('phone').value,
            service:      document.getElementById('service').value,
            'pickup-date': document.getElementById('pickup-date') ? document.getElementById('pickup-date').value : '',
            'pickup-time': document.getElementById('pickup-time') ? document.getElementById('pickup-time').value : '',
            message:      document.getElementById('message').value
        };
        console.log('Form submitted:', data);

        setTimeout(function () {
            btn.textContent = 'Message Sent! \u2713';
            btn.style.background = '#6FCF97';
            contactForm.reset();
            setTimeout(function () {
                btn.textContent = original;
                btn.disabled = false;
                btn.style.background = '';
            }, 3000);
        }, 1500);
    });
}

// Pre-fill from URL ?service= on direct page load
window.addEventListener('DOMContentLoaded', function () {
    var service = new URLSearchParams(window.location.search).get('service');
    var sel = document.getElementById('service');
    if (service && sel) {
        sel.value = service;
        setTimeout(function () {
            var contact = document.getElementById('contact');
            if (contact) contact.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    }
});

// ============================================================
// 8. Ripple effect on buttons
// ============================================================
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        var ripple = document.createElement('span');
        var rect = this.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        ripple.style.cssText =
            'width:' + size + 'px; height:' + size + 'px;' +
            'left:' + (e.clientX - rect.left - size / 2) + 'px;' +
            'top:' + (e.clientY - rect.top - size / 2) + 'px;' +
            'position:absolute; border-radius:50%;' +
            'background:rgba(255,255,255,0.5);' +
            'transform:scale(0); animation:ripple 0.6s ease-out;' +
            'pointer-events:none;';
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 600);
    });
});

// ============================================================
// 9. Hero parallax
// ============================================================
window.addEventListener('scroll', function () {
    var bg = document.querySelector('.hero-background');
    if (bg && window.pageYOffset < window.innerHeight) {
        bg.style.transform = 'translateY(' + (window.pageYOffset * 0.5) + 'px)';
    }
});

// ============================================================
// 10. FAQ accordion
// ============================================================
document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var item = this.closest('.faq-item');
        var isOpen = item.classList.contains('open');
        var column = this.closest('.faq-column');

        // Close every other item in this column
        column.querySelectorAll('.faq-item').forEach(function (other) {
            other.classList.remove('open');
            other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        // Toggle the clicked one
        if (!isOpen) {
            item.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

// ============================================================
// 11. Postcode / service-area checker
// ============================================================
var postcodeBtn = document.getElementById('check-postcode-btn');
var postcodeInput = document.getElementById('postcode');

if (postcodeBtn && postcodeInput) {
    function runPostcodeCheck() {
        var val = postcodeInput.value.trim();
        if (!val) {
            postcodeInput.style.borderColor = '#e53e3e';
            postcodeInput.placeholder = 'Please enter a postcode';
            setTimeout(function () { postcodeInput.style.borderColor = ''; }, 1800);
            return;
        }

        postcodeBtn.textContent = '\u2026';
        postcodeBtn.disabled = true;

        setTimeout(function () {
            postcodeBtn.textContent = 'Check';
            postcodeBtn.disabled = false;

            // Remove any previous result
            var prev = document.querySelector('.postcode-result');
            if (prev) prev.remove();

            // Demo logic: first char < 7 or non-numeric = in range
            var first = parseInt(val.charAt(0), 10);
            var inRange = isNaN(first) || first < 7;

            var result = document.createElement('p');
            result.className = 'postcode-result';
            result.style.cssText = 'margin-top:14px; font-size:0.88rem; font-weight:600;';

            if (inRange) {
                result.style.color = 'var(--secondary)';
                result.textContent = '\u2713 Great news \u2014 we deliver to your area!';
            } else {
                result.style.color = 'var(--accent)';
                result.textContent = '\u2717 We don\'t cover that postcode yet. Contact us \u2014 we may be able to help.';
            }
            postcodeInput.parentElement.after(result);
        }, 1200);
    }

    postcodeBtn.addEventListener('click', runPostcodeCheck);
    postcodeInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') runPostcodeCheck();
    });
}

// ============================================================
// 12. Cookie consent banner
// ============================================================
(function () {
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;

    // Show after a short delay (production: skip if consent cookie already set)
    setTimeout(function () { banner.classList.add('visible'); }, 1200);

    document.getElementById('cookie-accept').addEventListener('click', function () {
        banner.classList.remove('visible');
        // Production: document.cookie = 'cookieConsent=accepted; max-age=31536000; path=/';
    });

    document.getElementById('cookie-decline').addEventListener('click', function () {
        banner.classList.remove('visible');
        // Production: document.cookie = 'cookieConsent=declined; max-age=31536000; path=/';
    });
})();

// ============================================================
// 13. Nav active-link highlighting on scroll
// ============================================================
(function () {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', function () {
        var scrollY = window.pageYOffset + 120; // offset for fixed navbar

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    });
})();

// ============================================================
// 14. Contact form — real validation with visible error messages
// ============================================================
(function () {
    var form = document.querySelector('.contact-form');
    if (!form) return;

    // Set today as the min date on the date picker
    var dateInput = document.getElementById('pickup-date');
    if (dateInput) {
        var today = new Date();
        var yyyy = today.getFullYear();
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var dd = String(today.getDate()).padStart(2, '0');
        dateInput.setAttribute('min', yyyy + '-' + mm + '-' + dd);
    }

    // Rules: name required, email required + format, phone format if provided
    var rules = {
        'name':  { required: true,  message: 'Please enter your name.' },
        'email': { required: true,  message: 'Please enter your email address.', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, patternMsg: 'Please enter a valid email address.' },
        'phone': { required: false, pattern: /^[\d\s\-\(\)\+]{7,15}$/, patternMsg: 'Please enter a valid phone number.' }
    };

    function showError(input, msg) {
        var group = input.closest('.form-group');
        group.classList.add('error');
        var existing = group.querySelector('.form-error-msg');
        if (!existing) {
            var span = document.createElement('span');
            span.className = 'form-error-msg';
            input.after(span);
            existing = span;
        }
        existing.textContent = msg;
    }

    function clearError(input) {
        var group = input.closest('.form-group');
        group.classList.remove('error');
        var msg = group.querySelector('.form-error-msg');
        if (msg) msg.textContent = '';
    }

    // Live clearing: as soon as user starts typing, remove the error
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
        el.addEventListener('input', function () { clearError(el); });
        el.addEventListener('change', function () { clearError(el); });
    });

    // Intercept submit — validate before the existing handler fires
    form.addEventListener('submit', function (e) {
        var valid = true;

        Object.keys(rules).forEach(function (id) {
            var input = document.getElementById(id);
            if (!input) return;
            var rule = rules[id];
            var val = input.value.trim();
            clearError(input);

            if (rule.required && !val) {
                showError(input, rule.message);
                valid = false;
                return;
            }
            if (val && rule.pattern && !rule.pattern.test(val)) {
                showError(input, rule.patternMsg);
                valid = false;
            }
        });

        if (!valid) {
            e.preventDefault();
            e.stopPropagation(); // block the existing submit handler
            // Scroll to first error
            var firstError = form.querySelector('.form-group.error input, .form-group.error select');
            if (firstError) firstError.focus();
        }
        // If valid, let the existing submit handler (module 7) run normally
    }, true); // capture phase — runs before the module-7 listener
})();

// ============================================================
// 15. Privacy / Terms policy modals
// ============================================================
(function () {
    // Open
    document.querySelectorAll('.open-policy').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var modalId = this.dataset.modal;
            var modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close via × button
    document.querySelectorAll('.policy-close').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var modal = this.closest('.policy-modal');
            modal.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close via backdrop click
    document.querySelectorAll('.policy-backdrop').forEach(function (backdrop) {
        backdrop.addEventListener('click', function () {
            var modal = this.closest('.policy-modal');
            modal.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close via Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        document.querySelectorAll('.policy-modal.open').forEach(function (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
})();
