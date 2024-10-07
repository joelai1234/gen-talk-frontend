import { AxiosResponse } from 'axios'
import { useCallback, useState } from 'react'

export function useSSEMutation<T>({
  mutationFn,
  onDownloadProgress
}: {
  mutationFn: (payload: T) => Promise<AxiosResponse<ReadableStream<Uint8Array>>>
  onDownloadProgress: (value: string, payload: T) => void
}) {
  const [isLoading, setIsLoading] = useState(false) // Add loading state

  const mutate = useCallback(
    async (payload: T) => {
      setIsLoading(true) // Set loading to true
      const response = await mutationFn(payload)
      const stream = response.data

      const reader = stream.pipeThrough(new TextDecoderStream()).getReader()
      let result = ''
      let isFirstTimeRead = true
      do {
        const { value, done } = await reader.read()
        if (isFirstTimeRead) {
          setIsLoading(false)
          isFirstTimeRead = false
        }

        if (done) break

        result += value
          .replaceAll('data: ', '')
          .replaceAll('\n\n', '')
          .replaceAll('[DONE]', '')
        // console.log(`|${value}|`)
        onDownloadProgress(result, payload)
        // eslint-disable-next-line no-constant-condition
      } while (true)
    },
    [mutationFn, onDownloadProgress]
  )

  return { mutate, isLoading }
}
