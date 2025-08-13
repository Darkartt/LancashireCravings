#!/bin/bash

# Comprehensive test runner for WoodCrave Artisan Website
# This script runs all quality assurance tests in the correct order

set -e  # Exit on any error

echo "🎯 Starting WoodCrave Website Quality Assurance Suite"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if dependencies are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_success "Dependencies check passed"
}

# Install npm dependencies
install_dependencies() {
    print_status "Installing npm dependencies..."
    npm ci
    print_success "Dependencies installed"
}

# Run linting
run_linting() {
    print_status "Running ESLint..."
    
    if npm run lint; then
        print_success "Linting passed"
    else
        print_warning "Linting found issues (continuing with tests)"
    fi
}

# Run unit tests
run_unit_tests() {
    print_status "Running unit tests..."
    
    if npm run test:unit; then
        print_success "Unit tests passed"
    else
        print_error "Unit tests failed"
        exit 1
    fi
}

# Run integration tests
run_integration_tests() {
    print_status "Running integration tests..."
    
    if npm run test:integration; then
        print_success "Integration tests passed"
    else
        print_error "Integration tests failed"
        exit 1
    fi
}

# Run accessibility tests
run_accessibility_tests() {
    print_status "Running accessibility tests..."
    
    if npm run test:accessibility; then
        print_success "Accessibility tests passed"
    else
        print_error "Accessibility tests failed"
        exit 1
    fi
}

# Run performance tests
run_performance_tests() {
    print_status "Running performance tests..."
    
    if npm run test:performance; then
        print_success "Performance tests passed"
    else
        print_error "Performance tests failed"
        exit 1
    fi
}

# Build the application
build_application() {
    print_status "Building application..."
    
    if npm run build; then
        print_success "Application built successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Run E2E tests
run_e2e_tests() {
    print_status "Running E2E tests..."
    
    # Start the application in background
    npm start &
    SERVER_PID=$!
    
    # Wait for server to start
    print_status "Waiting for server to start..."
    sleep 10
    
    # Check if server is running
    if ! curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_error "Server failed to start"
        kill $SERVER_PID 2>/dev/null || true
        exit 1
    fi
    
    # Run E2E tests
    if npm run test:e2e; then
        print_success "E2E tests passed"
    else
        print_error "E2E tests failed"
        kill $SERVER_PID 2>/dev/null || true
        exit 1
    fi
    
    # Stop the server
    kill $SERVER_PID 2>/dev/null || true
    print_success "Server stopped"
}

# Run visual regression tests
run_visual_tests() {
    print_status "Running visual regression tests..."
    
    # Start the application in background
    npm start &
    SERVER_PID=$!
    
    # Wait for server to start
    print_status "Waiting for server to start..."
    sleep 10
    
    # Run visual tests
    if npm run test:visual; then
        print_success "Visual regression tests passed"
    else
        print_warning "Visual regression tests found differences (review required)"
    fi
    
    # Stop the server
    kill $SERVER_PID 2>/dev/null || true
}

# Run Lighthouse performance audit
run_lighthouse_audit() {
    print_status "Running Lighthouse performance audit..."
    
    if npm run lighthouse; then
        print_success "Lighthouse audit passed"
    else
        print_warning "Lighthouse audit found issues (review required)"
    fi
}

# Generate test coverage report
generate_coverage() {
    print_status "Generating test coverage report..."
    
    if npm run test:coverage; then
        print_success "Coverage report generated"
        print_status "Coverage report available at: coverage/lcov-report/index.html"
    else
        print_warning "Coverage generation had issues"
    fi
}

# Main execution
main() {
    echo "Starting at: $(date)"
    START_TIME=$(date +%s)
    
    # Parse command line arguments
    SKIP_BUILD=false
    SKIP_E2E=false
    SKIP_VISUAL=false
    SKIP_LIGHTHOUSE=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            --skip-e2e)
                SKIP_E2E=true
                shift
                ;;
            --skip-visual)
                SKIP_VISUAL=true
                shift
                ;;
            --skip-lighthouse)
                SKIP_LIGHTHOUSE=true
                shift
                ;;
            --help)
                echo "Usage: $0 [options]"
                echo "Options:"
                echo "  --skip-build       Skip application build"
                echo "  --skip-e2e         Skip E2E tests"
                echo "  --skip-visual      Skip visual regression tests"
                echo "  --skip-lighthouse  Skip Lighthouse audit"
                echo "  --help             Show this help message"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Run test suite
    check_dependencies
    install_dependencies
    run_linting
    run_unit_tests
    run_integration_tests
    run_accessibility_tests
    run_performance_tests
    
    if [ "$SKIP_BUILD" != true ]; then
        build_application
    fi
    
    if [ "$SKIP_E2E" != true ]; then
        run_e2e_tests
    fi
    
    if [ "$SKIP_VISUAL" != true ]; then
        run_visual_tests
    fi
    
    if [ "$SKIP_LIGHTHOUSE" != true ]; then
        run_lighthouse_audit
    fi
    
    generate_coverage
    
    # Calculate execution time
    END_TIME=$(date +%s)
    EXECUTION_TIME=$((END_TIME - START_TIME))
    
    print_success "All tests completed successfully!"
    print_status "Total execution time: ${EXECUTION_TIME} seconds"
    echo "Finished at: $(date)"
}

# Run main function with all arguments
main "$@"
