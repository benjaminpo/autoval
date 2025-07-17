import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../pages/index'

// Mock fetch
global.fetch = jest.fn()

describe('Home Page', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('renders the main heading', () => {
    render(<Home />)
    // Use getAllByText to handle multiple instances of "AutoVal"
    const headings = screen.getAllByText('AutoVal')
    expect(headings.length).toBeGreaterThan(0)
    expect(screen.getByText(/Get instant, AI-powered car price analysis/i)).toBeInTheDocument()
  })

  it('renders the form fields', () => {
    render(<Home />)
    // Check for dropdown with "Select make" text instead of placeholder
    expect(screen.getByText('Select make')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('e.g., Camry, Civic, X3')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2025')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('e.g., 50000')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('e.g., 200000')).toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup()
    fetch.mockRejectedValueOnce(new Error('API Error'))
    
    render(<Home />)
    
    // Select make from dropdown instead of typing
    const makeSelect = screen.getByRole('combobox', { name: /make/i })
    await user.selectOptions(makeSelect, 'Toyota')
    
    await user.type(screen.getByPlaceholderText('e.g., Camry, Civic, X3'), 'Camry')
    await user.type(screen.getByPlaceholderText('e.g., 50000'), '40000')
    await user.type(screen.getByPlaceholderText('e.g., 200000'), '250000')
    
    const submitButton = screen.getByText('Analyze Price')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument()
    })
  })
})
