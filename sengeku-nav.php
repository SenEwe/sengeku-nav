<?php
/**
 * Plugin Name: Sengeku Nav
 * Description: Apple-Style Mobile Navigation für WordPress Block Themes. Smooth Overlay mit Backdrop-Blur, Stagger-Animationen und Drilldown-Submenüs. Arbeitet mit dem nativen WP-Menüsystem — ersetzt nichts, styled nur um.
 * Version: 1.2.0
 * Author: Sengeku
 * License: GPL-2.0-or-later
 */

if (!defined('ABSPATH')) {
    exit;
}

define('SENGEKU_NAV_URL', plugin_dir_url(__FILE__));
define('SENGEKU_NAV_VER', '1.5.0');

class Sengeku_Nav {

    public static function init() {
        add_action('wp_enqueue_scripts', [__CLASS__, 'enqueue_assets']);
        add_filter('render_block', [__CLASS__, 'inject_parent_urls'], 10, 2);
    }

    /**
     * When WordPress renders a navigation-submenu block (parent with children),
     * it converts the <a> to a <button> and loses the href.
     * We find the original page URL and inject it as a data attribute.
     */
    public static function inject_parent_urls($block_content, $block) {
        if ($block['blockName'] !== 'core/navigation-submenu') {
            return $block_content;
        }

        // Get the URL from the block attributes
        $url = isset($block['attrs']['url']) ? $block['attrs']['url'] : '';

        if (!empty($url)) {
            // Inject the parent URL as a data attribute on the <li> element
            $block_content = preg_replace(
                '/(<li[^>]*class="[^"]*wp-block-navigation-submenu[^"]*")/',
                '$1 data-sengeku-parent-url="' . esc_attr($url) . '"',
                $block_content,
                1
            );
        }

        return $block_content;
    }

    public static function enqueue_assets() {
        if (is_admin()) {
            return;
        }

        // CSS — always load (navigation is global)
        wp_enqueue_style(
            'sengeku-nav',
            SENGEKU_NAV_URL . 'assets/css/nav.css',
            [],
            SENGEKU_NAV_VER
        );

        // Check if GSAP is already registered (by sengeku-motion)
        $gsap_dep = [];
        if (wp_script_is('gsap', 'registered') || wp_script_is('gsap', 'enqueued')) {
            $gsap_dep = ['gsap'];
        } else {
            // Fallback: load GSAP ourselves
            wp_enqueue_script(
                'gsap',
                'https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js',
                [],
                '3.12.7',
                true
            );
            $gsap_dep = ['gsap'];
        }

        // Our nav script
        wp_enqueue_script(
            'sengeku-nav',
            SENGEKU_NAV_URL . 'assets/js/nav.js',
            $gsap_dep,
            SENGEKU_NAV_VER,
            true
        );
    }
}

add_action('init', ['Sengeku_Nav', 'init']);
