/**
 * Additional comprehensive tests to improve coverage
 */

import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../pages/index'

// Mock fetch
global.fetch = jest.fn()

describe('Home Page - Additional Coverage Tests', () => {
  // Clear all mocks before each test to avoid interference
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Form Validation and State Management', () => {
    it('shows that form is invalid when required fields are missing', () => {
      render(<Home />)
      
      const analyzeButton = screen.getByRole('button', { name: /analyze price/i })
      expect(analyzeButton).toBeDisabled()
    })

    it('enables submit button when all required fields are filled', async () => {
      const user = userEvent.setup()
      render(<Home />)
      
      // Fill required fields
      const makeSelect = screen.getByRole('combobox', { name: /make/i })
      await user.selectOptions(makeSelect, 'Toyota')
      
      await user.type(screen.getByPlaceholderText('e.g., Camry, Civic, X3'), 'Camry')
      await user.type(screen.getByPlaceholderText('e.g., 200000'), '180000')
      
      const analyzeButton = screen.getByRole('button', { name: /analyze price/i })
      expect(analyzeButton).not.toBeDisabled()
    })

    it('clears analysis when form is modified', async () => {
      const user = userEvent.setup()
      
      // Mock successful response with proper PriceAnalysis structure
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          userCar: {
            make: 'Toyota',
            model: 'Camry', 
            year: 2020,
            mileage: 50000,
            color: 'white',
            owners: 1,
            price: 180000,
            fuelType: 'petrol',
            transmission: 'automatic',
            seats: 5,
            engineCC: 2000
          },
          marketPrice: {
            average: 175000,
            median: 170000,
            min: 150000,
            max: 200000,
            count: 25
          },
          priceRating: 'fair',
          priceDifference: 5000,
          percentageDifference: 2.9,
          marketComparison: {
            lowerPriced: 10,
            similarPriced: 5,
            higherPriced: 10
          },
          recommendations: ['Consider lowering price by 5-10%'],
          similarCars: [],
          factors: {
            makeModel: 0.8,
            year: 0.9,
            mileage: 0.7,
            owners: 0.9,
            color: 0.8,
            fuelType: 0.8,
            transmission: 0.9,
            overall: 0.83
          },
          marketTrends: {
            priceRange: [],
            popularColors: [],
            mileageImpact: []
          }
        }),
      })

      render(<Home />)
      
      // Fill and submit form
      const makeSelect = screen.getByRole('combobox', { name: /make/i })
      await user.selectOptions(makeSelect, 'Toyota')
      await user.type(screen.getByPlaceholderText('e.g., Camry, Civic, X3'), 'Camry')
      await user.type(screen.getByPlaceholderText('e.g., 200000'), '180000')
      
      const analyzeButton = screen.getByRole('button', { name: /analyze price/i })
      await user.click(analyzeButton)
      
      // Wait for analysis to appear - look for Fair Price text
      await waitFor(() => {
        expect(screen.getByText(/Fair Price/i)).toBeInTheDocument()
      })
      
      // Modify form - this should clear analysis
      await user.type(screen.getByPlaceholderText('e.g., Camry, Civic, X3'), ' Modified')
      
      // Analysis should be cleared (this tests the handleInputChange logic)
      await waitFor(() => {
        expect(screen.queryByText(/Fair Price/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Price Analysis Display', () => {
    it('displays comprehensive analysis with all sections', async () => {
      const user = userEvent.setup()
      
      const mockResponse = {
        userCar: {
          make: 'Toyota',
          model: 'Camry', 
          year: 2020,
          mileage: 50000,
          color: 'white',
          owners: 1,
          price: 250000,
          fuelType: 'petrol',
          transmission: 'automatic',
          seats: 5,
          engineCC: 2000
        },
        marketPrice: {
          average: 250000,
          median: 245000,
          min: 220000,
          max: 280000,
          count: 25
        },
        priceRating: 'excellent',
        priceDifference: 0,
        percentageDifference: 0,
        marketComparison: {
          lowerPriced: 5,
          similarPriced: 15,
          higherPriced: 5
        },
        recommendations: ['Great pricing for the market'],
        similarCars: [],
        factors: {
          makeModel: 0.9,
          year: 0.9,
          mileage: 0.8,
          owners: 0.9,
          color: 0.8,
          fuelType: 0.8,
          transmission: 0.9,
          overall: 0.87
        },
        marketTrends: {
          priceRange: [],
          popularColors: [],
          mileageImpact: []
        }
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      render(<Home />)
      
      // Fill and submit form
      const makeSelect = screen.getByRole('combobox', { name: /make/i })
      await user.selectOptions(makeSelect, 'Toyota')
      await user.type(screen.getByPlaceholderText('e.g., Camry, Civic, X3'), 'Camry')
      await user.type(screen.getByPlaceholderText('e.g., 200000'), '250000')
      
      await user.click(screen.getByRole('button', { name: /analyze price/i }))
      
      // Wait for and verify analysis sections  
      await waitFor(() => {
        expect(screen.getAllByText(/HK\$250,000/)).toHaveLength(2) // Your Price and Market Average
        expect(screen.getByText(/Excellent Price/i)).toBeInTheDocument()
        expect(screen.getAllByText(/Market Average/i)).toHaveLength(2) // Label and description
        expect(screen.getByText(/Great pricing for the market/i)).toBeInTheDocument()
      })
    })

    it('handles different price ratings correctly', async () => {
      const testCases = [
        { rating: 'excellent', expectedText: 'Excellent Price' },
        { rating: 'good', expectedText: 'Good Price' },
        { rating: 'fair', expectedText: 'Fair Price' },
        { rating: 'high', expectedText: 'High Price' },
        { rating: 'very_high', expectedText: 'Very high Price' }
      ]

      for (const testCase of testCases) {
        const user = userEvent.setup()
        
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            userCar: {
              make: 'Toyota',
              model: 'Camry', 
              year: 2020,
              mileage: 50000,
              color: 'white',
              owners: 1,
              price: 200000,
              fuelType: 'petrol',
              transmission: 'automatic',
              seats: 5,
              engineCC: 2000
            },
            marketPrice: {
              average: 200000,
              median: 195000,
              min: 180000,
              max: 220000,
              count: 20
            },
            priceRating: testCase.rating,
            priceDifference: 0,
            percentageDifference: 0,
            marketComparison: {
              lowerPriced: 5,
              similarPriced: 10,
              higherPriced: 5
            },
            recommendations: [],
            similarCars: [],
            factors: {
              makeModel: 0.8,
              year: 0.9,
              mileage: 0.7,
              owners: 0.9,
              color: 0.8,
              fuelType: 0.8,
              transmission: 0.9,
              overall: 0.83
            },
            marketTrends: {
              priceRange: [],
              popularColors: [],
              mileageImpact: []
            }
          }),
        })

        render(<Home />)
        
        // Fill and submit form
        const makeSelect = screen.getAllByRole('combobox', { name: /make/i })[0]
        await user.selectOptions(makeSelect, 'Toyota')
        const modelInputs = screen.getAllByPlaceholderText('e.g., Camry, Civic, X3')
        await user.type(modelInputs[0], 'Camry')
        const priceInputs = screen.getAllByPlaceholderText('e.g., 200000')
        await user.type(priceInputs[0], '200000')
        
        await user.click(screen.getAllByRole('button', { name: /analyze price/i })[0])
        
        await waitFor(() => {
          expect(screen.getAllByText(/HK\$200,000/).length).toBeGreaterThanOrEqual(1) // At least one price shown
          expect(screen.getByText(testCase.expectedText)).toBeInTheDocument()
        })

        // Clean up for next iteration
        fetch.mockClear()
      }
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      // Clear any previous state before each error test
      jest.clearAllMocks()
    })

    it('displays specific error messages from API', async () => {
      const user = userEvent.setup()
      
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid car data provided' }),
      })

      render(<Home />)
      
      const makeSelect = screen.getByRole('combobox', { name: /make/i })
      await user.selectOptions(makeSelect, 'Toyota')
      const modelInputs = screen.getAllByPlaceholderText('e.g., Camry, Civic, X3')
      await user.type(modelInputs[0], 'Camry')
      const priceInputs = screen.getAllByPlaceholderText('e.g., 200000')
      await user.type(priceInputs[0], '200000')
      
      await user.click(screen.getByRole('button', { name: /analyze price/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/Failed to analyze car/i)).toBeInTheDocument()
      })
    })

    it('handles network timeouts gracefully', async () => {
      const user = userEvent.setup()
      
      fetch.mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Network timeout')), 100)
        )
      )

      render(<Home />)
      
      const makeSelect = screen.getByRole('combobox', { name: /make/i })
      await user.selectOptions(makeSelect, 'Toyota')
      const modelInputs = screen.getAllByPlaceholderText('e.g., Camry, Civic, X3')
      await user.type(modelInputs[0], 'Camry')
      const priceInputs = screen.getAllByPlaceholderText('e.g., 200000')
      await user.type(priceInputs[0], '200000')
      
      await user.click(screen.getByRole('button', { name: /analyze price/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/Network timeout/i)).toBeInTheDocument()
      }, { timeout: 2000 })
    })
  })

  describe('Loading States', () => {
    it('shows loading state during API call', async () => {
      const user = userEvent.setup()
      
      // Create a promise that resolves after a delay
      let resolvePromise
      const delayedPromise = new Promise((resolve) => {
        resolvePromise = resolve
      })

      fetch.mockImplementationOnce(() => delayedPromise)

      render(<Home />)
      
      const makeSelect = screen.getByRole('combobox', { name: /make/i })
      await user.selectOptions(makeSelect, 'Toyota')
      await user.type(screen.getByPlaceholderText('e.g., Camry, Civic, X3'), 'Camry')
      await user.type(screen.getByPlaceholderText('e.g., 200000'), '200000')
      
      await user.click(screen.getByRole('button', { name: /analyze price/i }))
      
      // Should show loading state
      expect(screen.getByText('Analyzing your car...')).toBeInTheDocument()
      
      // Resolve the promise
      resolvePromise({
        ok: true,
        json: async () => ({
          userCar: {
            make: 'Toyota',
            model: 'Camry', 
            year: 2020,
            mileage: 50000,
            color: 'white',
            owners: 1,
            price: 200000,
            fuelType: 'petrol',
            transmission: 'automatic',
            seats: 5,
            engineCC: 2000
          },
          marketPrice: {
            average: 200000,
            median: 195000,
            min: 180000,
            max: 220000,
            count: 20
          },
          priceRating: 'fair',
          priceDifference: 0,
          percentageDifference: 0,
          marketComparison: {
            lowerPriced: 5,
            similarPriced: 10,
            higherPriced: 5
          },
          recommendations: [],
          similarCars: [],
          factors: {
            makeModel: 0.8,
            year: 0.9,
            mileage: 0.7,
            owners: 0.9,
            color: 0.8,
            fuelType: 0.8,
            transmission: 0.9,
            overall: 0.83
          },
          marketTrends: {
            priceRange: [],
            popularColors: [],
            mileageImpact: []
          }
        }),
      })
      
      // Loading should disappear
      await waitFor(() => {
        expect(screen.queryByText('Analyzing your car...')).not.toBeInTheDocument()
      })
    })
  })

  describe('Form Input Handling', () => {
    it('handles all form field changes correctly', async () => {
      const user = userEvent.setup()
      render(<Home />)
      
      // Test make selection
      const makeSelect = screen.getByRole('combobox', { name: /make/i })
      await user.selectOptions(makeSelect, 'Honda')
      expect(makeSelect).toHaveValue('Honda')
      
      // Test model input
      const modelInput = screen.getByPlaceholderText('e.g., Camry, Civic, X3')
      await user.type(modelInput, 'Civic')
      expect(modelInput).toHaveValue('Civic')
      
      // Test year selection
      const yearSelect = screen.getByRole('combobox', { name: /year/i })
      await user.selectOptions(yearSelect, '2020')
      expect(yearSelect).toHaveValue('2020')
      
      // Test mileage input (number input)
      const mileageInput = screen.getByPlaceholderText('e.g., 50000')
      await user.type(mileageInput, '45000')
      expect(mileageInput).toHaveValue(45000)
      
      // Test price input (number input)
      const priceInput = screen.getByPlaceholderText('e.g., 200000')
      await user.type(priceInput, '180000')
      expect(priceInput).toHaveValue(180000)
    })
  })
})
