import { render } from '@testing-library/react'
import { PWARegister } from '../pwa-register'

describe('PWARegister', () => {
  beforeEach(() => {
    // Mock service worker registration
    Object.defineProperty(window, 'navigator', {
      value: {
        serviceWorker: {
          register: jest.fn().mockResolvedValue({
            scope: '/test-scope',
          }),
        },
      },
      writable: true,
    })
    
    // Mock addEventListener
    window.addEventListener = jest.fn()
  })
  
  it('should register service worker on load', () => {
    render(<PWARegister />)
    
    // Simulate load event
    const loadCallback = (window.addEventListener as jest.Mock).mock.calls.find(
      call => call[0] === 'load'
    )?.[1]
    
    if (loadCallback) {
      loadCallback()
      expect(window.navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js')
    } else {
      fail('Load event listener not found')
    }
  })
  
  it('should add event listeners for PWA installation', () => {
    render(<PWARegister />)
    
    // Check that event listeners were added
    expect(window.addEventListener).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function))
    expect(window.addEventListener).toHaveBeenCalledWith('appinstalled', expect.any(Function))
  })
})
