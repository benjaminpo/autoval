# AutoVal Testing Suite

This document describes the comprehensive testing suite for the AutoVal car price analysis application.

## Test Structure

The testing suite is divided into frontend and backend tests:

### Frontend Tests (React/Next.js)
- **Location**: `__tests__/` directory
- **Framework**: Jest with React Testing Library
- **Test Files**:
  - `index.test.js` - Main page component tests
  - `integration.test.js` - API integration tests

### Backend Tests (Python/Flask)
- **Location**: `backend/` directory
- **Framework**: pytest
- **Test Files**:
  - `test_app.py` - API endpoint and function tests
  - `test_integration.py` - Integration tests

## Running Tests

### Frontend Tests

```bash
# Run all frontend tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Backend Tests

```bash
# Run all backend tests
npm run test:backend

# Run backend tests with verbose output
npm run test:backend:verbose

# Run backend tests with coverage
npm run test:backend:coverage
```

### All Tests

```bash
# Run both frontend and backend tests
npm run test:all
```

## Test Coverage

### Frontend Tests Cover:
- **Component Rendering**: Verify all UI elements are rendered correctly
- **Form Validation**: Test input validation and error messages
- **User Interactions**: Test form submission and user events
- **API Integration**: Test API calls and response handling
- **Loading States**: Test loading indicators and states
- **Error Handling**: Test error scenarios and error messages
- **Results Display**: Test prediction results display

### Backend Tests Cover:
- **API Endpoints**: Test all API routes and responses
- **Input Validation**: Test request validation and error handling
- **Business Logic**: Test price prediction and market analysis functions
- **CORS Headers**: Test cross-origin resource sharing
- **Edge Cases**: Test boundary conditions and error scenarios
- **Integration**: Test complete API workflow

## Test Categories

### Unit Tests
- Test individual functions and components in isolation
- Mock external dependencies
- Fast execution

### Integration Tests
- Test interaction between components
- Test API endpoints with real Flask client
- Test complete user workflows

### Validation Tests
- Test input validation for all form fields
- Test API request/response validation
- Test error handling scenarios

## Key Test Scenarios

### Frontend Test Scenarios:
1. **Form Rendering**: All form fields and labels are displayed
2. **Input Validation**: Required fields, year range, mileage validation
3. **Form Submission**: Valid data submission triggers API call
4. **Loading State**: Loading indicator shown during API call
5. **Success Response**: Prediction results displayed correctly
6. **Error Handling**: API errors displayed to user
7. **Reset Functionality**: "Analyze Another Car" resets form

### Backend Test Scenarios:
1. **Valid Requests**: API returns correct prediction structure
2. **Invalid Requests**: API returns appropriate error messages
3. **Input Validation**: All input fields validated correctly
4. **Business Logic**: Price prediction logic works correctly
5. **Market Analysis**: Market analysis returns valid data
6. **CORS Headers**: Cross-origin requests handled properly
7. **Health Check**: Health endpoint returns status

## Test Data

### Sample Car Data:
```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2020,
  "mileage": 40000,
  "fuel_type": "gasoline",
  "transmission": "automatic",
  "condition": "good",
  "location": "San Francisco, CA"
}
```

### Expected API Response:
```json
{
  "prediction": {
    "predicted_price": 25000,
    "confidence": 85,
    "price_range": {
      "min": 22000,
      "max": 28000
    }
  },
  "market_analysis": {
    "market_trend": "stable",
    "depreciation_rate": 15,
    "comparable_sales": [
      {
        "price": 24000,
        "mileage": 45000,
        "year": 2020
      }
    ]
  }
}
```

## Test Configuration

### Jest Configuration (`jest.config.js`):
- Next.js integration
- jsdom test environment
- Module name mapping
- Coverage collection
- Transform configuration

### Pytest Configuration (`pytest.ini`):
- Test discovery patterns
- Output formatting
- Markers for test categorization
- Coverage reporting

## Mocking Strategy

### Frontend Mocks:
- **framer-motion**: Mocked to avoid animation issues
- **lucide-react**: Mocked icon components
- **fetch**: Global fetch mock for API calls

### Backend Mocks:
- **External Dependencies**: Mock external API calls
- **Database**: Mock database operations
- **File System**: Mock file operations

## Continuous Integration

Tests are designed to run in CI/CD environments:
- No external dependencies required
- Fast execution
- Deterministic results
- Clear failure reporting

## Test Maintenance

### Adding New Tests:
1. Follow existing naming conventions
2. Include both positive and negative test cases
3. Mock external dependencies
4. Test edge cases and error conditions
5. Update this documentation

### Test Best Practices:
- Keep tests focused and isolated
- Use descriptive test names
- Test behavior, not implementation
- Include setup and teardown as needed
- Maintain test data consistency

## Debugging Tests

### Frontend Test Debugging:
```bash
# Run specific test file
npm test -- index.test.js

# Run tests with debug output
npm test -- --verbose

# Run single test
npm test -- --testNamePattern="renders the main heading"
```

### Backend Test Debugging:
```bash
# Run specific test file
cd backend && python -m pytest test_app.py -v

# Run specific test function
cd backend && python -m pytest test_app.py::TestPredictEndpoint::test_predict_success -v

# Run with debug output
cd backend && python -m pytest -s -v
```

## Test Metrics

The testing suite aims for:
- **Line Coverage**: >80%
- **Branch Coverage**: >70%
- **Function Coverage**: >90%
- **Test Execution Time**: <30 seconds total
- **Test Reliability**: 100% pass rate in clean environment
