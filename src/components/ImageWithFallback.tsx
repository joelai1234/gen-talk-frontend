import { useEffect, useState } from 'react'

interface ImageWithFallbackProps {
  className?: string
  src: string
  alt: string
  fallbackSrc: string
}

export default function ImageWithFallback({
  className,
  src,
  alt,
  fallbackSrc
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)

  const handleError = () => {
    console.error('Image loading failed:', src)
    setImgSrc(fallbackSrc)
  }

  useEffect(() => {
    const image = new Image()
    image.src = src
    image.onload = () => setImgSrc(src)
    image.onerror = handleError
  }, [src])

  return (
    <img className={className} src={imgSrc} alt={alt} onError={handleError} />
  )
}
