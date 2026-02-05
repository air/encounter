#!/bin/bash
# validate.sh - Quick validation script for code quality
# Usage: ./validate.sh

echo "🔍 Encounter Code Quality Validator"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the repository root"
    exit 1
fi

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

echo "1️⃣  Checking JavaScript syntax..."
for file in js/modules/*.js; do
    if node -c "$file" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file"
        ((errors++))
    fi
done
echo ""

echo "2️⃣  Checking for security issues..."
# Check for eval() usage
if grep -r "eval(" js/modules/ --include="*.js" | grep -v "// SAFE:" | grep -v "evaluate"; then
    echo -e "${RED}✗ Found eval() usage - potential security risk${NC}"
    ((errors++))
else
    echo -e "${GREEN}✓ No unsafe eval() found${NC}"
fi

# Check for innerHTML usage (XSS risk)
if grep -r "innerHTML" js/modules/ --include="*.js"; then
    echo -e "${YELLOW}⚠ Found innerHTML usage - verify it's safe${NC}"
    ((warnings++))
else
    echo -e "${GREEN}✓ No innerHTML found${NC}"
fi
echo ""

echo "3️⃣  Checking error handling..."
# Check for throw() with strings
bad_throws=$(grep -r "throw(" js/modules/ --include="*.js" | grep -v "throw new Error" | grep -v "throw(new" | wc -l)
if [ "$bad_throws" -gt 0 ]; then
    echo -e "${RED}✗ Found $bad_throws throw() statements without Error objects${NC}"
    ((errors++))
else
    echo -e "${GREEN}✓ All throw statements use Error objects${NC}"
fi
echo ""

echo "4️⃣  Checking TODO/FIXME comments..."
todo_count=$(grep -r "FIXME\|TODO" js/modules/ --include="*.js" | grep -v "CLAUDE-TODO" | wc -l)
if [ "$todo_count" -gt 0 ]; then
    echo -e "${YELLOW}⚠ Found $todo_count TODO/FIXME comments${NC}"
    echo "   Run 'grep -rn \"FIXME\|TODO\" js/modules/' to see them"
    ((warnings++))
else
    echo -e "${GREEN}✓ No TODO/FIXME comments${NC}"
fi
echo ""

echo "5️⃣  Checking console statements..."
# Check for console.log in production code (excluding UTIL.js logging functions)
console_count=$(grep -r "console\." js/modules/ --include="*.js" | grep -v "UTIL.js" | grep -v "dump:" | wc -l)
if [ "$console_count" -gt 0 ]; then
    echo -e "${YELLOW}⚠ Found $console_count console statements outside UTIL.js${NC}"
    ((warnings++))
else
    echo -e "${GREEN}✓ No stray console statements${NC}"
fi
echo ""

echo "6️⃣  Checking for magic numbers..."
# This is a simple heuristic - look for numeric literals > 10 that aren't in constants
magic_count=$(grep -r "[^a-zA-Z0-9_][0-9]\{3,\}[^0-9]" js/modules/ --include="*.js" | grep -v "export const" | grep -v "var.*=" | grep -v "let.*=" | wc -l)
if [ "$magic_count" -gt 20 ]; then
    echo -e "${YELLOW}⚠ Potentially high number of magic numbers (rough estimate: $magic_count)${NC}"
    echo "   Consider extracting more constants"
    ((warnings++))
else
    echo -e "${GREEN}✓ Reasonable use of constants${NC}"
fi
echo ""

# Summary
echo "===================================="
echo "📊 Summary:"
if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $warnings warning(s), 0 errors${NC}"
    echo "Code quality is good, but consider addressing warnings."
    exit 0
else
    echo -e "${RED}❌ $errors error(s), $warnings warning(s)${NC}"
    echo "Please fix errors before committing."
    exit 1
fi
