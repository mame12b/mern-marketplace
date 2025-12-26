#!/bin/bash

# Authentication Testing Script for MERN Marketplace
# This script helps test the authentication endpoints

BASE_URL="http://localhost:5000/api"

echo "=================================="
echo "MERN Marketplace Auth Test Script"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test data
TEST_EMAIL="testuser@example.com"
TEST_PASSWORD="password123"
TEST_FIRSTNAME="Test"
TEST_LASTNAME="User"

echo "${YELLOW}1. Testing Health Endpoint...${NC}"
response=$(curl -s -w "\n%{http_code}" http://localhost:5000/health)
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
    echo "${GREEN}✓ Health check passed${NC}"
    echo "Response: $body"
else
    echo "${RED}✗ Health check failed (HTTP $http_code)${NC}"
    exit 1
fi

echo ""
echo "${YELLOW}2. Testing User Registration...${NC}"
register_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"$TEST_FIRSTNAME\",
    \"lastName\": \"$TEST_LASTNAME\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"role\": \"buyer\"
  }")

reg_http_code=$(echo "$register_response" | tail -n1)
reg_body=$(echo "$register_response" | head -n-1)

if [ "$reg_http_code" = "201" ] || [ "$reg_http_code" = "200" ]; then
    echo "${GREEN}✓ Registration successful${NC}"
    TOKEN=$(echo "$reg_body" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "Token: ${TOKEN:0:20}..."
elif [ "$reg_http_code" = "400" ]; then
    echo "${YELLOW}⚠ User already exists, proceeding to login...${NC}"
else
    echo "${RED}✗ Registration failed (HTTP $reg_http_code)${NC}"
    echo "Response: $reg_body"
fi

echo ""
echo "${YELLOW}3. Testing User Login...${NC}"
login_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

login_http_code=$(echo "$login_response" | tail -n1)
login_body=$(echo "$login_response" | head -n-1)

if [ "$login_http_code" = "200" ]; then
    echo "${GREEN}✓ Login successful${NC}"
    TOKEN=$(echo "$login_body" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "Token: ${TOKEN:0:20}..."
    echo ""
    echo "Full Response:"
    echo "$login_body" | python3 -m json.tool 2>/dev/null || echo "$login_body"
else
    echo "${RED}✗ Login failed (HTTP $login_http_code)${NC}"
    echo "Response: $login_body"
    exit 1
fi

echo ""
echo "${YELLOW}4. Testing Protected Route (Get Me)...${NC}"
if [ -z "$TOKEN" ]; then
    echo "${RED}✗ No token available${NC}"
    exit 1
fi

me_response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN")

me_http_code=$(echo "$me_response" | tail -n1)
me_body=$(echo "$me_response" | head -n-1)

if [ "$me_http_code" = "200" ]; then
    echo "${GREEN}✓ Protected route access successful${NC}"
    echo "User Data:"
    echo "$me_body" | python3 -m json.tool 2>/dev/null || echo "$me_body"
else
    echo "${RED}✗ Protected route access failed (HTTP $me_http_code)${NC}"
    echo "Response: $me_body"
fi

echo ""
echo "${YELLOW}5. Testing Invalid Token...${NC}"
invalid_response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer invalid_token_here")

invalid_http_code=$(echo "$invalid_response" | tail -n1)

if [ "$invalid_http_code" = "401" ]; then
    echo "${GREEN}✓ Invalid token correctly rejected${NC}"
else
    echo "${RED}✗ Invalid token not rejected properly (HTTP $invalid_http_code)${NC}"
fi

echo ""
echo "${YELLOW}6. Testing Logout...${NC}"
logout_response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/auth/logout" \
  -H "Authorization: Bearer $TOKEN")

logout_http_code=$(echo "$logout_response" | tail -n1)
logout_body=$(echo "$logout_response" | head -n-1)

if [ "$logout_http_code" = "200" ]; then
    echo "${GREEN}✓ Logout successful${NC}"
else
    echo "${RED}✗ Logout failed (HTTP $logout_http_code)${NC}"
    echo "Response: $logout_body"
fi

echo ""
echo "=================================="
echo "${GREEN}Authentication Tests Complete!${NC}"
echo "=================================="
