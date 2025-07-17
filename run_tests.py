#!/usr/bin/env python3
"""Simple test runner script for AutoVal"""

import subprocess
import sys
import os

def run_frontend_tests():
    """Run frontend tests"""
    print("🚀 Running Frontend Tests...")
    try:
        result = subprocess.run(['npm', 'test', '--watchAll=false'], 
                              capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        return result.returncode == 0
    except Exception as e:
        print(f"Error running frontend tests: {e}")
        return False

def run_backend_tests():
    """Run backend tests"""
    print("🚀 Running Backend Tests...")
    try:
        os.chdir('backend')
        result = subprocess.run(['python', '-m', 'pytest', '-v'], 
                              capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        os.chdir('..')
        return result.returncode == 0
    except Exception as e:
        print(f"Error running backend tests: {e}")
        return False

def main():
    """Main test runner"""
    print("🧪 AutoVal Test Suite")
    print("=" * 50)
    
    # Run backend tests
    backend_success = run_backend_tests()
    
    # Run frontend tests
    frontend_success = run_frontend_tests()
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print(f"Backend Tests: {'✅ PASSED' if backend_success else '❌ FAILED'}")
    print(f"Frontend Tests: {'✅ PASSED' if frontend_success else '❌ FAILED'}")
    
    if backend_success and frontend_success:
        print("\n🎉 All tests passed!")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed. Check the output above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
