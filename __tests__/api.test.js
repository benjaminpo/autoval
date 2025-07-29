/**
 * API endpoint tests for analyze-car
 */

import { createMocks } from 'node-mocks-http'
import handler from '../pages/api/analyze-car'

// Mock fetch globally
global.fetch = jest.fn()

describe('/api/analyze-car', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('should return 405 for non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(405)
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Method not allowed'
    })
  })

  it('should handle successful backend response', async () => {
    const mockResponse = {
      prediction: {
        predicted_price: 25000,
        confidence: 85,
        price_range: { min: 22000, max: 28000 }
      },
      market_analysis: {
        market_trend: 'stable',
        depreciation_rate: 15
      }
    }

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 50000,
        price: 200000
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(mockResponse)
    expect(fetch).toHaveBeenCalledWith('http://localhost:5001/api/analyze-car', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    })
  })

  it('should handle backend error responses', async () => {
    const errorResponse = { error: 'Invalid data' }

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => errorResponse,
    })

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        make: 'Toyota',
        model: 'Camry',
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(400)
    expect(JSON.parse(res._getData())).toEqual(errorResponse)
  })

  it('should handle network errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 50000,
        price: 200000
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(500)
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Failed to connect to analysis service',
      details: 'Network error'
    })
  })

  it('should forward request body correctly', async () => {
    const requestBody = {
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      mileage: 60000,
      price: 180000,
      color: 'red',
      fuelType: 'petrol'
    }

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    const { req, res } = createMocks({
      method: 'POST',
      body: requestBody,
    })

    await handler(req, res)

    expect(fetch).toHaveBeenCalledWith('http://localhost:5001/api/analyze-car', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
  })
})
