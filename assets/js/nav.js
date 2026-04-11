/**
 * Sengeku Nav — Apple-Style Navigation Animations
 *
 * Desktop: CSS hover handles everything. JS only adds GSAP smoothness.
 * Mobile: JS handles tap-to-toggle submenus + stagger animations.
 *
 * This script NEVER touches:
 * - Menu open/close logic (WordPress handles that)
 * - Focus management (WordPress handles that)
 * - Scroll locking (WordPress handles that)
 * - Accessibility/ARIA (WordPress handles that)
 *
 * If GSAP fails to load, the menu still works — just without animations.
 */
(function () {
    "use strict";

    var hasGSAP = typeof gsap !== "undefined";
    var prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function isMobile() {
        return window.innerWidth < 783;
    }

    // ═══════════════════════════════════════════════════════════════════
    // 1. MOBILE: TAP-TO-TOGGLE SUBMENUS (Accordion)
    // ═══════════════════════════════════════════════════════════════════

    function initMobileAccordion() {
        // Find all navigations
        var navs = document.querySelectorAll(".wp-block-navigation");

        navs.forEach(function (nav) {
            nav.addEventListener("click", function (e) {
                if (!isMobile()) return;

                // Check if we're inside the open overlay
                var overlay = e.target.closest(
                    ".wp-block-navigation__responsive-container.is-menu-open"
                );
                if (!overlay) return;

                // Find the parent menu item with children
                var parentItem = e.target.closest(
                    ".wp-block-navigation-item.has-child, .wp-block-navigation-submenu"
                );
                if (!parentItem) return;

                // Only intercept clicks on the parent link/label/button itself
                var clickedLink = e.target.closest(
                    ".wp-block-navigation-item__content, .wp-block-navigation-submenu__toggle"
                );
                if (!clickedLink) return;

                // Make sure the clicked element belongs to this parent (not a submenu child)
                var clickedItem = clickedLink.closest(".wp-block-navigation-item, .wp-block-navigation-submenu");
                if (clickedItem !== parentItem) return;

                // This parent has children — prevent navigation, toggle submenu
                e.preventDefault();
                e.stopPropagation();

                var submenu = parentItem.querySelector(
                    ".wp-block-navigation__submenu-container"
                );
                if (!submenu) return;

                var isOpen = parentItem.classList.contains("sengeku-submenu-open");

                // Close all other open submenus on this level
                var siblings = parentItem.parentElement.querySelectorAll(
                    ":scope > .sengeku-submenu-open"
                );
                siblings.forEach(function (sib) {
                    if (sib !== parentItem) {
                        closeSubmenu(sib);
                    }
                });

                // Toggle this one
                if (isOpen) {
                    closeSubmenu(parentItem);
                } else {
                    openSubmenu(parentItem, submenu);
                }
            });
        });
    }

    function openSubmenu(parentItem, submenu) {
        parentItem.classList.add("sengeku-submenu-open");

        // ARIA: Set expanded state on parent link and toggle button
        var parentLink = parentItem.querySelector(
            ":scope > .wp-block-navigation-item__content"
        );
        if (parentLink) {
            parentLink.setAttribute("aria-expanded", "true");
            // Tell screen readers this is a toggle, not a navigation link
            if (!parentLink.getAttribute("role")) {
                parentLink.setAttribute("role", "button");
            }
        }

        var toggle = parentItem.querySelector(
            ".wp-block-navigation-submenu__toggle"
        );
        if (toggle) {
            toggle.setAttribute("aria-expanded", "true");
        }

        // ARIA: Mark submenu as a menu region
        if (!submenu.getAttribute("role")) {
            submenu.setAttribute("role", "menu");
            submenu.setAttribute("aria-label",
                (parentLink ? parentLink.textContent.trim() : "Untermenü") + " – Unterseiten"
            );
        }

        // GSAP animation for submenu items
        if (hasGSAP && !prefersReducedMotion) {
            var items = submenu.querySelectorAll(
                ":scope > .wp-block-navigation-item"
            );
            if (items.length > 0) {
                gsap.fromTo(
                    items,
                    { opacity: 0, y: -10 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.3,
                        stagger: 0.04,
                        ease: "power2.out",
                        delay: 0.1,
                    }
                );
            }
        }
    }

    function closeSubmenu(parentItem) {
        parentItem.classList.remove("sengeku-submenu-open");

        // ARIA: Reset expanded state
        var parentLink = parentItem.querySelector(
            ":scope > .wp-block-navigation-item__content"
        );
        if (parentLink) {
            parentLink.setAttribute("aria-expanded", "false");
        }

        var toggle = parentItem.querySelector(
            ".wp-block-navigation-submenu__toggle"
        );
        if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
        }

        // Kill running animations
        if (hasGSAP) {
            var items = parentItem.querySelectorAll(
                ".wp-block-navigation__submenu-container > .wp-block-navigation-item"
            );
            gsap.killTweensOf(items);
            gsap.set(items, { clearProps: "all" });
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // 2. OBSERVE MENU OPEN/CLOSE — Stagger animations
    // ═══════════════════════════════════════════════════════════════════

    function initMenuObserver() {
        if (!hasGSAP || prefersReducedMotion) return;

        var containers = document.querySelectorAll(
            ".wp-block-navigation__responsive-container"
        );

        if (containers.length === 0) {
            setTimeout(function () {
                document
                    .querySelectorAll(
                        ".wp-block-navigation__responsive-container"
                    )
                    .forEach(observeContainer);
            }, 1000);
            return;
        }

        containers.forEach(observeContainer);
    }

    function observeContainer(container) {
        var previouslyOpen = false;

        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName !== "class") return;

                var isOpen = container.classList.contains("is-menu-open");

                if (isOpen && !previouslyOpen) {
                    onMenuOpen(container);
                } else if (!isOpen && previouslyOpen) {
                    onMenuClose(container);
                }

                previouslyOpen = isOpen;
            });
        });

        observer.observe(container, {
            attributes: true,
            attributeFilter: ["class"],
        });
    }

    function onMenuOpen(container) {
        if (!isMobile()) return;

        container.classList.add("sengeku-nav-animating");

        var contentWrapper = container.querySelector(
            ".wp-block-navigation__responsive-container-content"
        );
        if (!contentWrapper) return;

        var navContainer = contentWrapper.querySelector(
            ".wp-block-navigation__container"
        );
        if (!navContainer) return;

        var items = navContainer.querySelectorAll(
            ":scope > .wp-block-navigation-item"
        );
        if (items.length === 0) return;

        // Close button animation
        var closeBtn = container.querySelector(
            ".wp-block-navigation__responsive-container-close"
        );
        if (closeBtn) {
            gsap.fromTo(
                closeBtn,
                { opacity: 0, rotate: -90 },
                { opacity: 1, rotate: 0, duration: 0.4, delay: 0.1, ease: "power2.out" }
            );
        }

        // Stagger menu items
        gsap.fromTo(
            items,
            { opacity: 0, y: 25 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.07,
                ease: "power3.out",
                delay: 0.15,
                onComplete: function () {
                    container.classList.remove("sengeku-nav-animating");
                },
            }
        );
    }

    function onMenuClose(container) {
        if (!isMobile()) return;

        // Reset all animations
        var items = container.querySelectorAll(".wp-block-navigation-item");
        gsap.killTweensOf(items);
        gsap.set(items, { clearProps: "all" });

        // Close all open submenus
        var openSubs = container.querySelectorAll(".sengeku-submenu-open");
        openSubs.forEach(function (item) {
            item.classList.remove("sengeku-submenu-open");
            var toggle = item.querySelector(
                ".wp-block-navigation-submenu__toggle"
            );
            if (toggle) toggle.setAttribute("aria-expanded", "false");
        });
    }

    // ═══════════════════════════════════════════════════════════════════
    // 3. DESKTOP: Force hover-to-open (override WP's open-on-click)
    // ═══════════════════════════════════════════════════════════════════

    function initDesktopHover() {
        var parentItems = document.querySelectorAll(
            ".wp-block-navigation-item.has-child, .wp-block-navigation-submenu"
        );

        parentItems.forEach(function (item) {
            var submenu = item.querySelector(
                ".wp-block-navigation__submenu-container"
            );
            if (!submenu) return;

            // Force show submenu on hover (overrides WP's click-only behavior)
            item.addEventListener("mouseenter", function () {
                if (isMobile()) return;

                // Close any other open submenus at this level
                var siblings = item.parentElement.querySelectorAll(
                    ":scope > .wp-block-navigation-submenu, :scope > .wp-block-navigation-item.has-child"
                );
                siblings.forEach(function (sib) {
                    if (sib !== item) {
                        var sibSub = sib.querySelector(".wp-block-navigation__submenu-container");
                        if (sibSub) {
                            sibSub.style.display = "none";
                            sibSub.style.opacity = "0";
                            sibSub.style.visibility = "hidden";
                            sibSub.style.pointerEvents = "none";
                        }
                    }
                });

                // Show this submenu
                submenu.style.display = "block";
                submenu.style.opacity = "1";
                submenu.style.visibility = "visible";
                submenu.style.pointerEvents = "auto";

                // GSAP stagger animation
                if (hasGSAP && !prefersReducedMotion) {
                    var subItems = submenu.querySelectorAll(
                        ":scope > .wp-block-navigation-item"
                    );
                    if (subItems.length > 0) {
                        gsap.fromTo(
                            subItems,
                            { opacity: 0, y: -8 },
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.25,
                                stagger: 0.03,
                                ease: "power2.out",
                            }
                        );
                    }
                }
            });

            item.addEventListener("mouseleave", function () {
                if (isMobile()) return;

                // Hide submenu
                submenu.style.display = "";
                submenu.style.opacity = "";
                submenu.style.visibility = "";
                submenu.style.pointerEvents = "";

                if (hasGSAP) {
                    var subItems = submenu.querySelectorAll(
                        ":scope > .wp-block-navigation-item"
                    );
                    gsap.killTweensOf(subItems);
                    gsap.set(subItems, { clearProps: "all" });
                }
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════════
    // BOOT
    // ═══════════════════════════════════════════════════════════════════

    // ═══════════════════════════════════════════════════════════════════
    // 4. ACCESSIBILITY SETUP — ARIA attributes for screen readers
    // ═══════════════════════════════════════════════════════════════════

    function initAccessibility() {
        // Find all parent items with submenus
        var parentItems = document.querySelectorAll(
            ".wp-block-navigation-item.has-child, .wp-block-navigation-submenu"
        );

        parentItems.forEach(function (item) {
            var link = item.querySelector(
                ":scope > .wp-block-navigation-item__content"
            );
            if (!link) return;

            // On mobile: parent links act as toggles, not navigation
            // Set initial ARIA state
            link.setAttribute("aria-expanded", "false");
            link.setAttribute("aria-haspopup", "true");

            // Mark submenu items with menuitem role
            var submenu = item.querySelector(
                ".wp-block-navigation__submenu-container"
            );
            if (submenu) {
                var subItems = submenu.querySelectorAll(
                    ":scope > .wp-block-navigation-item > .wp-block-navigation-item__content"
                );
                subItems.forEach(function (subLink) {
                    subLink.setAttribute("role", "menuitem");
                });
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════
    // 5. OVERVIEW LINKS — Add "Übersicht" as first submenu item
    // ═══════════════════════════════════════════════════════════════════

    function initOverviewLinks() {
        var parentItems = document.querySelectorAll(
            ".wp-block-navigation-submenu"
        );

        parentItems.forEach(function (item) {
            var toggle = item.querySelector(
                ":scope > .wp-block-navigation-submenu__toggle"
            );
            if (!toggle) return;

            var label = toggle.textContent.trim();
            var submenu = item.querySelector(
                ".wp-block-navigation__submenu-container"
            );
            if (!submenu) return;

            // Check if overview link already exists
            if (submenu.querySelector(".sengeku-overview-link")) return;

            // Get parent URL from data attribute (injected by PHP)
            // or from href (if WP kept it as a link)
            var parentUrl = item.getAttribute("data-sengeku-parent-url")
                || toggle.getAttribute("href");

            // If no URL available, skip
            if (!parentUrl || parentUrl === "#") return;

            // Create overview list item
            var overviewLi = document.createElement("li");
            overviewLi.className = "wp-block-navigation-item sengeku-overview-item";

            var overviewLink = document.createElement("a");
            overviewLink.className = "wp-block-navigation-item__content sengeku-overview-link";
            overviewLink.href = parentUrl;
            overviewLink.innerHTML = '<span class="wp-block-navigation-item__label">' +
                label + ' — Übersicht</span>';
            overviewLink.setAttribute("role", "menuitem");

            overviewLi.appendChild(overviewLink);
            submenu.insertBefore(overviewLi, submenu.firstChild);
        });
    }

    function boot() {
        initAccessibility();
        initMobileAccordion();
        initMenuObserver();
        initDesktopHover();

        console.log(
            "Sengeku Nav — Active" +
            (hasGSAP ? " (GSAP)" : " (CSS only)") +
            (prefersReducedMotion ? " (reduced motion)" : "")
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();
