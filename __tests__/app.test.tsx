/**
 * Tests for the Next.js App component
 */

import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../pages/_app'

// Simple test component
const MockComponent = () => <div data-testid="mock-component">Test Component</div>

// Mock Next.js router with minimal required properties
const mockRouter: any = {
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  // Add missing properties with mock values
  components: {},
  sdc: {},
  sbc: {},
  sub: jest.fn(),
  clc: jest.fn(),
  pageLoader: {},
  _bps: jest.fn(),
  onPopState: jest.fn(),
  isFallback: false,
  isReady: true,
  isLocaleDomain: false,
  basePath: '',
  domainLocales: [],
  locales: [],
  defaultLocale: 'en',
  locale: 'en',
  isPreview: false,
}

describe('_app.tsx', () => {
  it('renders the passed Component', () => {
    const { getByTestId } = render(
      <App 
        Component={MockComponent} 
        pageProps={{}} 
        router={mockRouter}
      />
    )

    expect(getByTestId('mock-component')).toBeInTheDocument()
  })

  it('passes pageProps to the Component', () => {
    const ComponentWithProps = ({ message }: { message: string }) => (
      <div data-testid="component-with-props">{message}</div>
    )

    const { getByText } = render(
      <App 
        Component={ComponentWithProps} 
        pageProps={{ message: 'Hello World' }} 
        router={mockRouter}
      />
    )

    expect(getByText('Hello World')).toBeInTheDocument()
  })
})
