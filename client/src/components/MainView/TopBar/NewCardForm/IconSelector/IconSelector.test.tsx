import { render, screen } from '@testing-library/react'
import IconSelector from './index'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

describe('<IconSelector /> component', () => {
  const mock = vi.fn()

  test('renders all icons', () => {
    render(<IconSelector register={mock} />)
    const radioInputs = screen.getAllByRole('radio')
    expect(radioInputs).toHaveLength(11)
  })

  test('handles error state properly', () => {
    const { rerender } = render(<IconSelector register={mock} />)
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument()

    rerender(<IconSelector register={mock} error='test error'/>)
    expect(screen.queryByText('test error')).toBeInTheDocument()
  })

  test('has correct styling', () => {
    render(<IconSelector register={mock} />)
    const radioInputs = screen.getAllByRole('radio')

    radioInputs.forEach(radio => {
      expect(radio).toHaveClass('appearance-none', 'bg-iconbg',
        'aspect-square', 'rounded-lg')
    })
  })
})
