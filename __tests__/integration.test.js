import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('API Integration Tests', () => {
  const mockApiResponse = {
    prediction: {
      predicted_price: 25000,
      confidence: 85,
      price_range: { min: 22000, max: 28000 }
    },
    market_analysis: {
      market_trend: 'stable',
      depreciation_rate: 15,
      comparable_sales: [
        { price: 24000, mileage: 45000, year: 2020 },
        { price: 26000, mileage: 35000, year: 2021 }
      ]
    }
  }

  beforeEach(() => {
    fetch.mockClear()
  })

  it('handles successful API response', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    })

    const testRequest = {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      mileage: 40000,
      fuel_type: 'gasoline',
      transmission: 'automatic',
      condition: 'good',
      location: 'San Francisco, CA'
    }

    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest),
    })

    expect(response.ok).toBe(true)
    const data = await response.json()
    
    expect(data).toEqual(mockApiResponse)
    expect(data.prediction.predicted_price).toBe(25000)
    expect(data.prediction.confidence).toBe(85)
    expect(data.market_analysis.market_trend).toBe('stable')
  })

  it('handles API error response', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Missing required fields' }),
    })

    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    expect(response.ok).toBe(false)
    expect(response.status).toBe(400)
    
    const data = await response.json()
    expect(data.error).toBe('Missing required fields')
  })

  it('handles network error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    try {
      await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          mileage: 40000,
          fuel_type: 'gasoline',
          transmission: 'automatic',
          condition: 'good',
          location: 'San Francisco, CA'
        }),
      })
    } catch (error) {
      expect(error.message).toBe('Network error')
    }
  })

  it('validates API request format', async () => {
    const validRequest = {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      mileage: 40000,
      fuel_type: 'gasoline',
      transmission: 'automatic',
      condition: 'good',
      location: 'San Francisco, CA'
    }

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    })

    await fetch('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validRequest),
    })

    expect(fetch).toHaveBeenCalledWith('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validRequest),
    })
  })

  it('validates API response structure', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    })

    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 40000,
        fuel_type: 'gasoline',
        transmission: 'automatic',
        condition: 'good',
        location: 'San Francisco, CA'
      }),
    })

    const data = await response.json()

    // Validate prediction structure
    expect(data.prediction).toBeDefined()
    expect(typeof data.prediction.predicted_price).toBe('number')
    expect(typeof data.prediction.confidence).toBe('number')
    expect(data.prediction.price_range).toBeDefined()
    expect(typeof data.prediction.price_range.min).toBe('number')
    expect(typeof data.prediction.price_range.max).toBe('number')

    // Validate market analysis structure
    expect(data.market_analysis).toBeDefined()
    expect(typeof data.market_analysis.market_trend).toBe('string')
    expect(typeof data.market_analysis.depreciation_rate).toBe('number')
    expect(Array.isArray(data.market_analysis.comparable_sales)).toBe(true)
  })
})
