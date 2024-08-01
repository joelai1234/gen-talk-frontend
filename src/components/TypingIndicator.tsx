import React, { useEffect, useState } from 'react'

const TypingIndicator: React.FC = () => {
  const [dotIndex, setDotIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDotIndex((prevIndex) => (prevIndex + 1) % 3)
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex space-x-1">
      <div
        className={`size-2 rounded-full ${
          dotIndex === 0 ? 'bg-earth-green' : 'bg-gray-300'
        }`}
      ></div>
      <div
        className={`size-2 rounded-full ${
          dotIndex === 1 ? 'bg-earth-green' : 'bg-gray-300'
        }`}
      ></div>
      <div
        className={`size-2 rounded-full ${
          dotIndex === 2 ? 'bg-earth-green' : 'bg-gray-300'
        }`}
      ></div>
    </div>
  )
}

export default TypingIndicator
