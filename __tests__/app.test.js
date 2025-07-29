/**
 * Tests for the Next.js App component
 */

import React from 'react'
import { render } from '@testing-library/react'
import App from '../pages/_app'

// Mock a test component to pass to App
const MockComponent = ({ testProp }: { testProp?: string }) => (
  <div data-testid="mock-component">
    Mock Component {testProp && `with ${testProp}`}
  </div>
)

describe('_app.tsx', () => {
  it('renders the passed Component with pageProps', () => {
    const mockPageProps = { testProp: 'test data' }
    
    const { getByTestId, getByText } = render(
      <App Component={MockComponent} pageProps={mockPageProps} />
    )

    expect(getByTestId('mock-component')).toBeInTheDocument()
    expect(getByText('Mock Component with test data')).toBeInTheDocument()
  })

  it('renders Component without props when pageProps is empty', () => {
    const { getByTestId, getByText } = render(
      <App Component={MockComponent} pageProps={{}} />
    )

    expect(getByTestId('mock-component')).toBeInTheDocument()
    expect(getByText('Mock Component')).toBeInTheDocument()
  })

  it('renders different components correctly', () => {
    const AnotherMockComponent = () => (
      <div data-testid="another-mock">Another Component</div>
    )

    const { getByTestId } = render(
      <App Component={AnotherMockComponent} pageProps={{}} />
    )

    expect(getByTestId('another-mock')).toBeInTheDocument()
  })
})
