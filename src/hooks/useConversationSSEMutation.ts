import { AxiosResponse } from 'axios'
import { useCallback, useState } from 'react'

export function useConversationSSEMutation<T>({
  mutationFn,
  onDownloadProgress,
  onFinished // Add onFinished callback
}: {
  mutationFn: (payload: T) => Promise<AxiosResponse<ReadableStream<Uint8Array>>>
  onDownloadProgress?: (
    value: { type: string; persona: number; content: string }[],
    payload: T
  ) => void
  onFinished?: () => void // Define the type for onFinished
}) {
  const [isLoading, setIsLoading] = useState(false) // Add loading state

  const mutate = useCallback(
    async (payload: T) => {
      setIsLoading(true) // Set loading to true
      const response = await mutationFn(payload)
      const stream = response.data

      const reader = stream.pipeThrough(new TextDecoderStream()).getReader()
      const result = []
      let isFirstTimeRead = true
      do {
        const { value, done } = await reader.read()
        if (isFirstTimeRead) {
          setIsLoading(false)
          isFirstTimeRead = false
        }
        // console.log('value: ', value)
        if (done) break

        const cleanedData = value.replace(/^\s*[\r\n]+/gm, '')
        // 使用正則表達式匹配每個 `data: {...}` JSON 區段
        const regex = /data: (\{.*?\})(?=\n|$)/gs
        const matches = [...cleanedData.matchAll(regex)]

        // 解析每一段 JSON，並移除無效控制字符
        const parsedData = matches.map((match) => {
          const cleanJsonString = match[1]
            .replace(/\\n/g, ' ') // 將 \n 替換為空格
            .replace(/\\r/g, '') // 移除 \r
            .replace(/\\t/g, ' ') // 將 \t 替換為空格
            .replace(/\s+/g, ' ') // 確保多個空格替換為單一空格
            .replace(/\\"/g, `'`) // 確保多個空格替換為單一空格
            .trim() // 移除前後的多餘空格
          // console.log(cleanJsonString)

          const jsonObject = JSON.parse(cleanJsonString)

          // 如果 content 有 "data: " 前綴，將其移除，並對 content 進行 trim() 以移除結尾的空格
          if (jsonObject.content && jsonObject.content.startsWith('data: ')) {
            jsonObject.content = jsonObject.content.replace('data: ', '').trim()
          }

          return jsonObject
        })

        result.push(...parsedData)
        onDownloadProgress?.(result, payload)
        // onDownloadProgress?.(result, payload)
        // eslint-disable-next-line no-constant-condition
      } while (true)

      onFinished?.() // Call onFinished after the loop ends
    },
    [mutationFn, onDownloadProgress, onFinished] // Add onFinished to dependencies
  )

  return { mutate, isLoading }
}
