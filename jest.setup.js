import '@testing-library/jest-dom'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => <h2 {...props}>{children}</h2>,
    header: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => <header {...props}>{children}</header>,
    form: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => <form {...props}>{children}</form>,
    input: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => <input {...props}>{children}</input>,
    button: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => <button {...props}>{children}</button>,
    textarea: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => <textarea {...props}>{children}</textarea>,
    section: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => <section {...props}>{children}</section>,
    span: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => <span {...props}>{children}</span>,
    select: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => <select {...props}>{children}</select>,
    label: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => <label {...props}>{children}</label>,
    p: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => <p {...props}>{children}</p>,
    a: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => <a {...props}>{children}</a>,
    footer: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => <footer {...props}>{children}</footer>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Car: () => <div data-testid="car-icon">Car</div>,
  DollarSign: () => <div data-testid="dollar-icon">DollarSign</div>,
  Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
  Gauge: () => <div data-testid="gauge-icon">Gauge</div>,
  Fuel: () => <div data-testid="fuel-icon">Fuel</div>,
  Wrench: () => <div data-testid="wrench-icon">Wrench</div>,
  Shield: () => <div data-testid="shield-icon">Shield</div>,
  MapPin: () => <div data-testid="map-pin-icon">MapPin</div>,
  TrendingUp: () => <div data-testid="trending-up-icon">TrendingUp</div>,
  TrendingDown: () => <div data-testid="trending-down-icon">TrendingDown</div>,
  AlertCircle: () => <div data-testid="alert-circle-icon">AlertCircle</div>,
  CheckCircle: () => <div data-testid="check-circle-icon">CheckCircle</div>,
  Loader: () => <div data-testid="loader-icon">Loader</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  Sparkles: () => <div data-testid="sparkles-icon">Sparkles</div>,
  Star: () => <div data-testid="star-icon">Star</div>,
  ChevronRight: () => <div data-testid="chevron-right-icon">ChevronRight</div>,
  Zap: () => <div data-testid="zap-icon">Zap</div>,
  BarChart3: () => <div data-testid="bar-chart-icon">BarChart3</div>,
  Clock: () => <div data-testid="clock-icon">Clock</div>,
  Award: () => <div data-testid="award-icon">Award</div>,
  TrendingDown: () => <div data-testid="trending-down-icon">TrendingDown</div>,
  Github: () => <div data-testid="github-icon">Github</div>,
  Twitter: () => <div data-testid="twitter-icon">Twitter</div>,
  Linkedin: () => <div data-testid="linkedin-icon">Linkedin</div>,
  Mail: () => <div data-testid="mail-icon">Mail</div>,
  Phone: () => <div data-testid="phone-icon">Phone</div>,
}))

// Mock fetch globally
global.fetch = jest.fn()

// Reset fetch mock before each test
beforeEach(() => {
  fetch.mockClear()
})
