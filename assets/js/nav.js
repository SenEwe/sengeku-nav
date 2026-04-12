/**
 * Sengeku Nav 3.0 — Minimal JS
 *
 * CSS does the heavy lifting (hover, fullwidth panels).
 * JS only handles:
 * 1. Mobile accordion tap-to-toggle
 * 2. ARIA for accessibility
 * 3. Desktop panel positioning (fixed panels need top value)
 * 4. Menu close reset
 */
(function () {
    "use strict";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function isMobile() {
        return window.innerWidth < 783;
    }

    // ═══════════════════════════════════════════════════════════════
    // 1. MOBILE ACCORDION
    // ═══════════════════════════════════════════════════════════════

    function initMobileAccordion() {
        var navs = document.querySelectorAll(".wp-block-navigation");

        navs.forEach(function (nav) {
            nav.addEventListener("click", function (e) {
                if (!isMobile()) return;

                var overlay = e.target.closest(
                    ".wp-block-navigation__responsive-container.is-menu-open"
                );
                if (!overlay) return;

                var parentItem = e.target.closest(
                    ".wp-block-navigation-item.has-child, .wp-block-navigation-submenu"
                );
                if (!parentItem) return;

                var clicked = e.target.closest(
                    ".wp-block-navigation-item__content, .wp-block-navigation-submenu__toggle"
                );
                if (!clicked) return;

                var clickedItem = clicked.closest(
                    ".wp-block-navigation-item, .wp-block-navigation-submenu"
                );
                if (clickedItem !== parentItem) return;

                e.preventDefault();
                e.stopPropagation();

                // Close siblings
                var siblings = parentItem.parentElement.querySelectorAll(
                    ":scope > .sengeku-submenu-open"
                );
                siblings.forEach(function (sib) {
                    if (sib !== parentItem) sib.classList.remove("sengeku-submenu-open");
                });

                parentItem.classList.toggle("sengeku-submenu-open");
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // 2. ARIA
    // ═══════════════════════════════════════════════════════════════

    function initAria() {
        var parents = document.querySelectorAll(
            ".wp-block-navigation-item.has-child, .wp-block-navigation-submenu"
        );

        parents.forEach(function (item) {
            var link = item.querySelector(
                ":scope > .wp-block-navigation-item__content, :scope > .wp-block-navigation-submenu__toggle"
            );
            if (link) {
                link.setAttribute("aria-haspopup", "true");
            }

            var submenu = item.querySelector(".wp-block-navigation__submenu-container");
            if (submenu) {
                var label = link ? link.textContent.trim() : "";
                submenu.setAttribute("role", "menu");
                submenu.setAttribute("aria-label", label + " Unterseiten");
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // 3. DESKTOP PANEL POSITION — fixed panels need correct top
    // ═══════════════════════════════════════════════════════════════

    function initDesktopPanelPosition() {
        if (isMobile()) return;

        var nav = document.querySelector("nav.wp-block-navigation");
        if (!nav) return;

        function updatePosition() {
            if (isMobile()) return;
            var rect = nav.getBoundingClientRect();
            var topPos = rect.bottom;
            var panels = nav.querySelectorAll(
                ".wp-block-navigation__submenu-container"
            );
            panels.forEach(function (panel) {
                panel.style.top = topPos + "px";
            });
        }

        updatePosition();
        window.addEventListener("scroll", updatePosition, { passive: true });
        window.addEventListener("resize", updatePosition);
    }

    // ═══════════════════════════════════════════════════════════════
    // 4. MENU CLOSE RESET
    // ═══════════════════════════════════════════════════════════════

    function initMenuObserver() {
        var containers = document.querySelectorAll(
            ".wp-block-navigation__responsive-container"
        );

        containers.forEach(function (container) {
            var wasOpen = false;
            new MutationObserver(function () {
                var isOpen = container.classList.contains("is-menu-open");
                if (!isOpen && wasOpen) {
                    container.querySelectorAll(".sengeku-submenu-open").forEach(function (el) {
                        el.classList.remove("sengeku-submenu-open");
                    });
                }
                wasOpen = isOpen;
            }).observe(container, { attributes: true, attributeFilter: ["class"] });
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // BOOT
    // ═══════════════════════════════════════════════════════════════

    function boot() {
        initAria();
        initMobileAccordion();
        initMenuObserver();
        initDesktopPanelPosition();
        console.log("Sengeku Nav 3.0 — Active");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();
