<?php
/**
 * Sengeku Nav — Uninstall
 *
 * Runs when the plugin is deleted (not just deactivated).
 * Cleans up any options/data the plugin stored.
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}

// Currently the plugin stores no options in the database.
// This file exists for WordPress.org compliance and future use.
// If settings are added later, clean them up here.
