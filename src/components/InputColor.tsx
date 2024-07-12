interface InputColorProps {
  value: string
  onChange?: (value: string) => void
}

export default function InputColor({ value, onChange }: InputColorProps) {
  return (
    <div className="flex w-36 items-center gap-1 rounded-lg border border-[#ebebeb] bg-white pr-2">
      <input
        className="w-1 flex-1 bg-transparent px-3 py-2 text-sm text-[#4e4e4e] outline-none"
        type="text"
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value)
        }}
      />
      <label
        htmlFor="color"
        className="size-[18px] shrink-0 cursor-pointer rounded"
        style={{
          backgroundColor: value as string
        }}
      >
        <input
          id="color"
          type="color"
          className="size-0 opacity-0"
          value={value ?? '#000000'}
          onChange={(e) => {
            onChange?.(e.target.value)
          }}
        />
      </label>
    </div>
  )
}
