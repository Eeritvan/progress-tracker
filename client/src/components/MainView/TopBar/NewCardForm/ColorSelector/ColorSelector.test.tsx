import { render, screen } from '@testing-library/react'
import ColorSelector from './index'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

describe('<ColorSelector /> component', () => {
  const mock = vi.fn()

  test('renders all colors', () => {
    render(<ColorSelector register={mock} />)
    const colorInputs = screen.getAllByRole('radio')
    expect(colorInputs).toHaveLength(15)
  })

  test('handles error state properly', () => {
    const { rerender } = render(<ColorSelector register={mock} />)
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument()

    rerender(<ColorSelector register={mock} error='test error'/>)
    expect(screen.queryByText('test error')).toBeInTheDocument()
  })
})
