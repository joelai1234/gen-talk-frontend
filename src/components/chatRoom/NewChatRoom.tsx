interface NewChatRoomProps {
  persona: {
    avatar: string
    name: string
    description: string
  }
}

export default function NewChatRoom({ persona }: NewChatRoomProps) {
  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <div className="flex w-[265px] -translate-y-6 flex-col items-center justify-center space-y-1">
        <div className="flex size-12 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-3xl">
          {persona.avatar}
        </div>
        <p className="text-center text-base text-[#4c4c4c]">{persona.name}</p>
        <p className="text-center text-sm text-[#9a9a9a]">
          {persona.description}
        </p>
      </div>
    </div>
  )
}
