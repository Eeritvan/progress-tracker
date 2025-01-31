import { render, screen } from '@testing-library/react'
import FormField from './FormField'
import '@testing-library/jest-dom'

describe('<FormField /> component', () => {
  const mock = vi.fn()

  test('renders input with correct attributes', () => {
    render(
      <FormField
        type="text"
        name="text-field"
        register={mock}
        placeholder="text here"
      />
    )
    const input = screen.getByPlaceholderText('text here')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  test('handles password correctly', () => {
    render(
      <FormField
        type='password'
        name='password-field'
        register={mock}
        placeholder='password here'
      />
    )
    const input = screen.getByPlaceholderText('password here')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'password')
  })

  test('handles error state properly', () => {
    const { rerender } = render(
      <FormField
        type='text'
        name='text-field'
        register={mock}
        placeholder='text here'
      />
    )
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument()

    rerender(
      <FormField
        type='text'
        error='test error message'
        name='text-field'
        register={mock}
        placeholder='text here'
      />
    )
    expect(screen.queryByText('test error message')).toBeInTheDocument()
  })

  test('has correct styling', () => {
    const { rerender } = render(
      <FormField
        type="text"
        name="test-field"
        register={mock}
        placeholder="text here"
      />
    )

    const input = screen.getByPlaceholderText('text here')
    expect(input).toHaveClass(
      'w-[400px]',
      'h-12',
      'rounded-xl',
      'p-4',
      'border-2',
      'border-neutral-200'
    )

    rerender(
      <FormField
        type="text"
        name="test-field"
        error="Error message"
        register={mock}
        placeholder="text here"
      />
    )

    expect(input).toHaveClass(
      'w-[400px]',
      'h-12',
      'rounded-xl',
      'p-4',
      'border-2',
      'border-red-500'
    )
  })
})
