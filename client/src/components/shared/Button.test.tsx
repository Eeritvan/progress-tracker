import { render, screen } from '@testing-library/react'
import Button from './Button'
import '@testing-library/jest-dom'

describe('<Button /> component', () => {
  test('continue text when not submitting', () => {
    render(<Button isSubmitting={false} />)
    expect(screen.getByText('Continue')).toBeInTheDocument()
  })

  test('loading text when submitting', () => {
    render(<Button isSubmitting={true} />)
    expect(screen.getByText('loading')).toBeInTheDocument()
  })

  test('button is disabled when submitting', () => {
    render(<Button isSubmitting={true} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  test('button is enabled when not submitting', () => {
    render(<Button isSubmitting={false} />)
    expect(screen.getByRole('button')).toBeEnabled()
  })

  test('displays error message when error prop is provided', () => {
    render(<Button isSubmitting={false} error="Test error" />)
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  test('does not display error message when no error prop', () => {
    render(<Button isSubmitting={false} />)
    expect(screen.queryByText('error')).not.toBeInTheDocument()
  })
})

