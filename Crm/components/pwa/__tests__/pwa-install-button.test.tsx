import { render, screen } from '@testing-library/react'
import { PWAInstallButton } from '../pwa-install-button'

describe('PWAInstallButton', () => {
  it('should not render when not installable', () => {
    render(<PWAInstallButton />)
    
    // The button should not be in the document initially
    const button = screen.queryByRole('button', { name: /zainstaluj aplikację/i })
    expect(button).not.toBeInTheDocument()
  })

  it('should render when installable', () => {
    // Mock the beforeinstallprompt event
    const beforeInstallPromptEvent = new Event('beforeinstallprompt')
    beforeInstallPromptEvent.preventDefault = jest.fn()
    
    // Mock the userChoice promise
    Object.defineProperty(beforeInstallPromptEvent, 'userChoice', {
      value: Promise.resolve({ outcome: 'accepted' }),
    })
    
    // Mock the prompt method
    Object.defineProperty(beforeInstallPromptEvent, 'prompt', {
      value: jest.fn(),
    })
    
    // Dispatch the event before rendering
    window.dispatchEvent(beforeInstallPromptEvent)
    
    render(<PWAInstallButton />)
    
    // The button should now be in the document
    const button = screen.getByRole('button', { name: /zainstaluj aplikację/i })
    expect(button).toBeInTheDocument()
  })
})
