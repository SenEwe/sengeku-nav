#!/bin/bash
# Sengeku Nav — Test Script

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PLUGIN_NAME="sengeku-nav"

PHP="/Users/senewe/Library/Application Support/Local/lightning-services/php-8.4.4+2/bin/darwin-arm64/bin/php"
WP_ROOT="/Users/senewe/Local Sites/gluecklich/app/public"
MYSQL_SOCK="/Users/senewe/Library/Application Support/Local/run/v1zNb934J/mysql/mysqld.sock"
WP_CLI="/tmp/wp-cli.phar"

echo "═══════════════════════════════════════════"
echo "  Sengeku Nav — Test Suite"
echo "═══════════════════════════════════════════"

# 1. PHP Syntax Check
echo ""
echo "▶ PHP Syntax Check..."
"$PHP" -l "$PLUGIN_DIR/sengeku-nav.php" 2>&1
echo "  ✓ Done"

# 2. Deploy to Local
echo ""
echo "▶ Deploying to Local..."
DEST="$WP_ROOT/wp-content/plugins/$PLUGIN_NAME"
mkdir -p "$DEST/assets/css" "$DEST/assets/js" "$DEST/languages"
cp "$PLUGIN_DIR/sengeku-nav.php" "$DEST/"
cp "$PLUGIN_DIR/assets/css/nav.css" "$DEST/assets/css/"
cp "$PLUGIN_DIR/assets/js/nav.js" "$DEST/assets/js/"
echo "  ✓ Deployed"

# 3. Activate
echo ""
echo "▶ Activating..."
"$PHP" -d "mysqli.default_socket=$MYSQL_SOCK" "$WP_CLI" --path="$WP_ROOT" plugin activate "$PLUGIN_NAME" --quiet 2>&1 && echo "  ✓ Activated" || echo "  ✗ ACTIVATION FAILED"

# 4. WP Plugin Check
echo ""
echo "▶ WP Plugin Check..."
"$PHP" -d "mysqli.default_socket=$MYSQL_SOCK" "$WP_CLI" --path="$WP_ROOT" plugin check "$PLUGIN_NAME" 2>&1

# 5. Frontend Check
echo ""
echo "▶ Frontend Check..."
HTTP=$(curl -s -o /dev/null -w "%{http_code}" "http://gluecklich.local/")
echo "  HTTP: $HTTP"
NAV=$(curl -s "http://gluecklich.local/" | grep -c "sengeku-nav")
echo "  Nav references: $NAV"

echo ""
echo "═══════════════════════════════════════════"
echo "  Done"
echo "═══════════════════════════════════════════"
