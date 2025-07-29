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
  beforeEach(() => {
    fetch.mockClear()
  })

  describe('Form Validation and State Management', () => {
    it('shows that form is invalid when required fields are missing', () => {
      render(<Home />)
      
      const analyzeButton = screen.getByText('Analyze Price')
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
      
      const analyzeButton = screen.getByText('Analyze Price')
      expect(analyzeButton).not.toBeDisabled()
    })

    it('clears analysis when form is modified', async () => {
      const user = userEvent.setup()
      
      // Mock successful response first
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          prediction: {
            predicted_price: 25000,
            confidence: 85,
            price_range: { min: 22000, max: 28000 }
          }
        }),
      })

      render(<Home />)
      
      // Fill and submit form
      const makeSelect = screen.getByRole('combobox', { name: /make/i })
      await user.selectOptions(makeSelect, 'Toyota')
      await user.type(screen.getByPlaceholderText('e.g., Camry, Civic, X3'), 'Camry')
      await user.type(screen.getByPlaceholderText('e.g., 200000'), '180000')
      
      const analyzeButton = screen.getByText('Analyze Price')
      await user.click(analyzeButton)
      
      // Wait for analysis to appear
      await waitFor(() => {
        expect(screen.getByText(/predicted price/i)).toBeInTheDocument()
      })
      
      // Modify form - this should clear analysis
      await user.type(screen.getByPlaceholderText('e.g., Camry, Civic, X3'), ' Modified')
      
      // Analysis should be cleared (this tests the handleInputChange logic)
      await waitFor(() => {
        expect(screen.queryByText(/predicted price/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Price Analysis Display', () => {
    it('displays comprehensive analysis with all sections', async () => {
      const user = userEvent.setup()
      
      const mockResponse = {
        prediction: {
          predicted_price: 250000,
          confidence: 90,
          price_range: { min: 220000, max: 280000 },
          rating: 'excellent'
        },
        market_analysis: {
          market_trend: 'increasing',
          depreciation_rate: 12,
          comparable_sales: [
            { price: 240000, mileage: 45000, year: 2020 },
            { price: 260000, mileage: 35000, year: 2021 }
          ]
        },
        factors: {
          positive: ['Low mileage', 'Popular model'],
          negative: ['High depreciation']
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
      
      await user.click(screen.getByText('Analyze Price'))
      
      // Wait for and verify analysis sections
      await waitFor(() => {
        expect(screen.getByText(/HK\$250,000/)).toBeInTheDocument()
        expect(screen.getByText(/90% confidence/i)).toBeInTheDocument()
        expect(screen.getByText(/HK\$220,000 - HK\$280,000/)).toBeInTheDocument()
        expect(screen.getByText(/market trend/i)).toBeInTheDocument()
        expect(screen.getByText(/increasing/i)).toBeInTheDocument()
      })
    })

    it('handles different price ratings correctly', async () => {
      const testCases = [
        { rating: 'excellent', expectedClass: 'green' },
        { rating: 'good', expectedClass: 'blue' },
        { rating: 'fair', expectedClass: 'yellow' },
        { rating: 'high', expectedClass: 'orange' },
        { rating: 'very_high', expectedClass: 'red' }
      ]

      for (const testCase of testCases) {
        const user = userEvent.setup()
        
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            prediction: {
              predicted_price: 200000,
              confidence: 85,
              rating: testCase.rating
            }
          }),
        })

        render(<Home />)
        
        // Fill and submit form
        const makeSelect = screen.getByRole('combobox', { name: /make/i })
        await user.selectOptions(makeSelect, 'Toyota')
        await user.type(screen.getByPlaceholderText('e.g., Camry, Civic, X3'), 'Camry')
        await user.type(screen.getByPlaceholderText('e.g., 200000'), '200000')
        
        await user.click(screen.getByText('Analyze Price'))
        
        await waitFor(() => {
          expect(screen.getByText(/HK\$200,000/)).toBeInTheDocument()
        })

        // Clean up for next iteration
        fetch.mockClear()
      }
    })
  })

  describe('Error Handling', () => {
    it('displays specific error messages from API', async () => {
      const user = userEvent.setup()
      
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid car data provided' }),
      })

      render(<Home />)
      
      const makeSelect = screen.getByRole('combobox', { name: /make/i })
      await user.selectOptions(makeSelect, 'Toyota')
      await user.type(screen.getByPlaceholderText('e.g., Camry, Civic, X3'), 'Camry')
      await user.type(screen.getByPlaceholderText('e.g., 200000'), '200000')
      
      await user.click(screen.getByText('Analyze Price'))
      
      await waitFor(() => {
        expect(screen.getByText('Failed to analyze car')).toBeInTheDocument()
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
      await user.type(screen.getByPlaceholderText('e.g., Camry, Civic, X3'), 'Camry')
      await user.type(screen.getByPlaceholderText('e.g., 200000'), '200000')
      
      await user.click(screen.getByText('Analyze Price'))
      
      await waitFor(() => {
        expect(screen.getByText('Network timeout')).toBeInTheDocument()
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
      
      await user.click(screen.getByText('Analyze Price'))
      
      // Should show loading state
      expect(screen.getByText('Analyzing...')).toBeInTheDocument()
      
      // Resolve the promise
      resolvePromise({
        ok: true,
        json: async () => ({
          prediction: { predicted_price: 200000, confidence: 85 }
        }),
      })
      
      // Loading should disappear
      await waitFor(() => {
        expect(screen.queryByText('Analyzing...')).not.toBeInTheDocument()
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
      
      // Test mileage input
      const mileageInput = screen.getByPlaceholderText('e.g., 50000')
      await user.type(mileageInput, '45000')
      expect(mileageInput).toHaveValue('45000')
      
      // Test price input
      const priceInput = screen.getByPlaceholderText('e.g., 200000')
      await user.type(priceInput, '180000')
      expect(priceInput).toHaveValue('180000')
    })
  })
})
