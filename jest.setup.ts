import '@testing-library/jest-dom'

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})

class IntersectionObserver {
    observe = jest.fn()
    disconnect = jest.fn()
    unobserve = jest.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserver,
})

Object.defineProperty(window, 'IntersectionObserverEntry', {
    writable: true,
    configurable: true,
    value: jest.fn(),
})

process.env.NEXT_PUBLIC_API_URL = 'https://test-api.com'
process.env.NEXT_PUBLIC_API_SEED = 'test-seed'
