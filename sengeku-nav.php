<?php
/**
 * Plugin Name: Sengeku Nav
 * Description: Apple-style Mega Menu for WordPress Block Themes. Fullwidth hover panels, smooth transitions, mobile accordion. Works WITH the native Navigation block.
 * Version: 3.0.0
 * Author: Sengeku
 * License: GPL-2.0-or-later
 */

if (!defined('ABSPATH')) {
    exit;
}

define('SENGEKU_NAV_URL', plugin_dir_url(__FILE__));
define('SENGEKU_NAV_VER', '3.0.0');

class Sengeku_Nav {

    public static function init() {
        add_action('wp_enqueue_scripts', [__CLASS__, 'enqueue_assets']);
        add_filter('render_block', [__CLASS__, 'inject_parent_urls'], 10, 2);
    }

    public static function enqueue_assets() {
        if (is_admin()) return;

        wp_enqueue_style(
            'sengeku-nav',
            SENGEKU_NAV_URL . 'assets/css/nav.css',
            [],
            SENGEKU_NAV_VER
        );

        // JS — no external dependencies, GSAP is optional (from sengeku-motion)
        $deps = [];
        if (wp_script_is('gsap', 'registered') || wp_script_is('gsap', 'enqueued')) {
            $deps = ['gsap'];
        }

        wp_enqueue_script(
            'sengeku-nav',
            SENGEKU_NAV_URL . 'assets/js/nav.js',
            $deps,
            SENGEKU_NAV_VER,
            true
        );

        // View Transitions
        add_action('wp_head', function() {
            echo '<meta name="view-transition" content="same-origin">' . "\n";
            echo '<style>@view-transition { navigation: auto; }</style>' . "\n";
        }, 1);
    }

    /**
     * Preserve parent URL that WP converts to button
     */
    public static function inject_parent_urls($block_content, $block) {
        if ($block['blockName'] !== 'core/navigation-submenu') {
            return $block_content;
        }

        $url = isset($block['attrs']['url']) ? $block['attrs']['url'] : '';
        if (!empty($url)) {
            $block_content = preg_replace(
                '/(<li[^>]*class="[^"]*wp-block-navigation-submenu[^"]*")/',
                '$1 data-sengeku-parent-url="' . esc_attr($url) . '"',
                $block_content,
                1
            );
        }

        return $block_content;
    }
}

add_action('init', ['Sengeku_Nav', 'init']);
