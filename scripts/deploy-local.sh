#!/bin/bash
# Quick deploy to Local site — run after every code change

PLUGIN_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PLUGIN_NAME="sengeku-nav"
WP_ROOT="/Users/senewe/Local Sites/gluecklich/app/public"
DEST="$WP_ROOT/wp-content/plugins/$PLUGIN_NAME"

echo "▶ Deploying $PLUGIN_NAME to Local..."

# Sync files (only plugin files, no docs/poc/scripts)
rsync -av --delete \
    --exclude='.git' \
    --exclude='.vscode' \
    --exclude='docs' \
    --exclude='poc' \
    --exclude='scripts' \
    --exclude='node_modules' \
    --exclude='.DS_Store' \
    --exclude='.gitignore' \
    --exclude='.editorconfig' \
    "$PLUGIN_DIR/" "$DEST/"

echo "✓ Deployed. Reload http://gluecklich.local/"
