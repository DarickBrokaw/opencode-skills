#!/bin/bash

echo "🚀 Starting Clippy Website Verification..."
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python3 first."
    exit 1
fi

# Start the HTTP server in background
echo "📡 Starting HTTP server on port 3000..."
python3 -m http.server 3000 &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Test if server is responding
echo "🔍 Testing server response..."
if curl -s --head http://localhost:3000 | head -1 | grep "200\|302" > /dev/null; then
    echo "✅ Server is responding on http://localhost:3000"
else
    echo "❌ Server is not responding. Check if port 3000 is available."
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Test HTML content
echo "📄 Testing HTML content..."
HTML_CONTENT=$(curl -s http://localhost:3000)

if echo "$HTML_CONTENT" | grep -q "Clippy - File Conversion Tool"; then
    echo "✅ Page title is correct"
else
    echo "❌ Page title not found"
fi

if echo "$HTML_CONTENT" | grep -q "Upload Your Image"; then
    echo "✅ Upload section found"
else
    echo "❌ Upload section not found"
fi

if echo "$HTML_CONTENT" | grep -q "Choose File"; then
    echo "✅ Upload button found"
else
    echo "❌ Upload button not found"
fi

if echo "$HTML_CONTENT" | grep -q "PDF\|PNG\|JPG"; then
    echo "✅ Format options found"
else
    echo "❌ Format options not found"
fi

echo ""
echo "🎯 MANUAL TESTING REQUIRED:"
echo "1. Open Chrome browser"
echo "2. Navigate to: http://localhost:3000"
echo "3. Verify the website loads and UI is visible"
echo "4. Test file upload and conversion functionality"
echo "5. Check responsive design on different screen sizes"
echo ""
echo "🔗 Test Suite: Open test-suite.html in browser for automated checks"
echo ""
echo "💡 Server is running in background (PID: $SERVER_PID)"
echo "   Press Ctrl+C to stop the server when done testing"

# Wait for user input
trap "echo ''; echo '🛑 Stopping server...'; kill $SERVER_PID 2>/dev/null; exit 0" INT
wait