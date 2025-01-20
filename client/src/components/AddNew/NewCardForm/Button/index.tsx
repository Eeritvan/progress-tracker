interface ButtonProps {
  isSubmitting: boolean
  error?: string
}

const Button = ({ isSubmitting, error }: ButtonProps) => {
  return (
    <>
      <button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Loading' : 'Submit'}
      </button>
      {error && <p>{error}</p>}
    </>
  )
}

export default Button
