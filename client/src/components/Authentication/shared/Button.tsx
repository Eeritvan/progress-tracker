interface ButtonProps {
  isSubmitting: boolean
  error?: string
}

const Button = ({ isSubmitting, error }: ButtonProps) => {
  return (
    <>
      <button disabled={isSubmitting}
        type='submit'
        className='bg-blue-600 rounded-xl h-12 w-[400px] text-white font-bold'
      >
        {isSubmitting ? 'loading' : 'Continue'}
      </button>
      {error && <p>{error}</p>}
    </>
  )
}

export default Button
