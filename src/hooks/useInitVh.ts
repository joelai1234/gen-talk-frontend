import { useEffect } from 'react'

export const useInitVh = () => {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    // 初次加載時設置高度
    setVh()

    // 在視窗大小改變時重新計算高度
    window.addEventListener('resize', setVh)

    // 清理事件監聽器
    return () => {
      window.removeEventListener('resize', setVh)
    }
  }, [])
}
