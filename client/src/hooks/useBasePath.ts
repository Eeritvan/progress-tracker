import { useLocation } from 'wouter'

export const useBasePath = () => {
  const [location] = useLocation()
  const basePath = '/' + location.split('/')[1]

  const matches = (path: string) => {
    const normalizedPath = '/' + path.split('/')[1]
    return normalizedPath === basePath
  }

  return { basePath, matches }
}
