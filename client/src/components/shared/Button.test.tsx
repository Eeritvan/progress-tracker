import { render, screen } from '@testing-library/react'
import Button from './Button'
import '@testing-library/jest-dom'

describe('<Button /> component', () => {
  test('renders with default props', () => {
    render(<Button isSubmitting={false} />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  test('handles submitting state correctly', () => {
    const { rerender } = render(<Button isSubmitting={false} />)
    expect(screen.getByRole('button')).toBeEnabled()
    expect(screen.getByText('Continue')).toBeInTheDocument()

    rerender(<Button isSubmitting={true} />)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByText('loading')).toBeInTheDocument()
  })

  test('handles error states properly', () => {
    const { rerender } = render(<Button isSubmitting={false} />)
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument()

    rerender(<Button isSubmitting={false} error="test error message" />)
    expect(screen.getByText('test error message')).toBeInTheDocument()
  })

  test('has correct styling', () => {
    render(<Button isSubmitting={false} />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass( 'h-12', 'w-[400px]', 'text-white', 'font-bold',
      'bg-blue-600', 'rounded-xl'
    )
  })
})
