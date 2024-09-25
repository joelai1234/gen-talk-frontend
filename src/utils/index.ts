export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ')
}

export const handleEnterKeyPress = (
  event: React.KeyboardEvent<HTMLInputElement>,
  submitForm: () => void,
  nextInputElementId?: string
) => {
  if (event.key !== 'Enter') return

  if (nextInputElementId) {
    const nextInputElement = document.getElementById(nextInputElementId)
    nextInputElement?.focus()
  } else {
    submitForm()
  }
}
