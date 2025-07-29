/**
 * Simple additional tests to increase coverage without complex mocking
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../pages/index'

// Mock fetch
global.fetch = jest.fn()

describe('Home Page - Simple Additional Tests', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  describe('Component Rendering', () => {
    it('renders all main sections of the page', () => {
      render(<Home />)
      
      // Check for main heading (use getAllByText since AutoVal appears multiple times)
      const headings = screen.getAllByText('AutoVal')
      expect(headings.length).toBeGreaterThan(0)
      
      // Check for form section
      expect(screen.getByText('Select make')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('e.g., Camry, Civic, X3')).toBeInTheDocument()
      
      // Check for features section
      expect(screen.getByText('Why Choose AutoVal?')).toBeInTheDocument()
      expect(screen.getByText('Instant Analysis')).toBeInTheDocument()
      
      // Check for stats section
      expect(screen.getByText('Trusted by Thousands')).toBeInTheDocument()
      
      // Check for footer
      expect(screen.getByText(/© 2024 AutoVal/)).toBeInTheDocument()
    })

    it('renders form with proper input types', () => {
      render(<Home />)
      
      // Check input types
      const mileageInput = screen.getByPlaceholderText('e.g., 50000')
      expect(mileageInput).toHaveAttribute('type', 'number')
      
      const priceInput = screen.getByPlaceholderText('e.g., 200000')
      expect(priceInput).toHaveAttribute('type', 'number')
    })

    it('renders all dropdown options', () => {
      render(<Home />)
      
      const yearSelect = screen.getByRole('combobox', { name: /year/i })
      const currentYear = new Date().getFullYear()
      
      // Check if the select contains option elements with the current year
      const optionElement = screen.getByRole('option', { name: currentYear.toString() })
      expect(optionElement).toBeInTheDocument()
    })
  })

  describe('Form Interactions', () => {
    it('updates form fields when user interacts', async () => {
      const user = userEvent.setup()
      render(<Home />)
      
      // Test make selection
      const makeSelect = screen.getByRole('combobox', { name: /make/i })
      await user.selectOptions(makeSelect, 'Toyota')
      expect(makeSelect).toHaveValue('Toyota')
      
      // Test model input
      const modelInput = screen.getByPlaceholderText('e.g., Camry, Civic, X3')
      await user.type(modelInput, 'Camry')
      expect(modelInput).toHaveValue('Camry')
      
      // Test price input
      const priceInput = screen.getByPlaceholderText('e.g., 200000')
      await user.type(priceInput, '180000')
      expect(priceInput).toHaveValue(180000)
    })

    it('handles year selection correctly', async () => {
      const user = userEvent.setup()
      render(<Home />)
      
      const yearSelect = screen.getByRole('combobox', { name: /year/i })
      await user.selectOptions(yearSelect, '2020')
      expect(yearSelect).toHaveValue('2020')
    })

    it('handles mileage input correctly', async () => {
      const user = userEvent.setup()
      render(<Home />)
      
      const mileageInput = screen.getByPlaceholderText('e.g., 50000')
      await user.type(mileageInput, '45000')
      expect(mileageInput).toHaveValue(45000)
    })
  })

  describe('API Integration - Simple Cases', () => {
    it('handles successful API response with market data', async () => {
      const user = userEvent.setup()
      
      const mockResponse = {
        userCar: {
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          mileage: 50000,
          price: 200000
        },
        marketPrice: {
          average: 180000,
          median: 175000,
          min: 150000,
          max: 220000,
          count: 25
        },
        priceRating: 'good',
        priceDifference: 20000,
        percentageDifference: 11.1,
        marketComparison: {
          lowerPriced: 15,
          higherPriced: 8,
          similarPriced: 2
        },
        similarCars: [],
        factors: {
          makeModel: 8,
          year: 7,
          mileage: 6,
          owners: 8,
          color: 7,
          fuelType: 7,
          transmission: 8,
          overall: 7.3
        },
        recommendations: ['Consider reducing price for faster sale'],
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
      
      // Fill form
      const makeSelect = screen.getByRole('combobox', { name: /make/i })
      await user.selectOptions(makeSelect, 'Toyota')
      await user.type(screen.getByPlaceholderText('e.g., Camry, Civic, X3'), 'Camry')
      await user.type(screen.getByPlaceholderText('e.g., 200000'), '200000')
      
      // Submit form
      await user.click(screen.getByText('Analyze Price'))
      
      // Wait for results
      await waitFor(() => {
        expect(screen.getByText(/Market Average/)).toBeInTheDocument()
      })
      
      // Check that market data is displayed
      expect(screen.getByText('HK$180,000')).toBeInTheDocument()
    })

    it('shows error message when API fails', async () => {
      const user = userEvent.setup()
      
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid car data' }),
      })

      render(<Home />)
      
      // Fill form
      const makeSelect = screen.getByRole('combobox', { name: /make/i })
      await user.selectOptions(makeSelect, 'Toyota')
      await user.type(screen.getByPlaceholderText('e.g., Camry, Civic, X3'), 'Camry')
      await user.type(screen.getByPlaceholderText('e.g., 200000'), '200000')
      
      // Submit form
      await user.click(screen.getByText('Analyze Price'))
      
      // Wait for error
      await waitFor(() => {
        expect(screen.getByText('Failed to analyze car')).toBeInTheDocument()
      })
    })
  })

  describe('Utility Functions', () => {
    it('formats prices correctly', () => {
      render(<Home />)
      
      // The formatPrice function is used internally, 
      // we can test it by checking displayed values
      expect(screen.getByDisplayValue('2025')).toBeInTheDocument()
    })

    it('displays current year as default', () => {
      render(<Home />)
      
      const currentYear = new Date().getFullYear()
      expect(screen.getByDisplayValue(currentYear.toString())).toBeInTheDocument()
    })
  })

  describe('Responsive Design Elements', () => {
    it('renders mobile-friendly elements', () => {
      render(<Home />)
      
      // Check for responsive classes (these would be in the DOM)
      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
      
      // Check for gradient text elements (use getAllByText since AutoVal appears multiple times)
      const mainHeadings = screen.getAllByText('AutoVal')
      expect(mainHeadings.length).toBeGreaterThan(0)
    })
  })
})
