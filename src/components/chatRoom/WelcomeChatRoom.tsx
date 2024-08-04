export default function WelcomeChatRoom() {
  return (
    <div className="flex size-full items-center justify-center">
      <div className="flex h-[164px] w-[265px] -translate-y-6 flex-col items-center justify-center space-y-1">
        <img src="/images/mountain.png" alt="mountain" />
        <p className="text-center text-base text-[#4c4c4c]">Welcome!</p>
        <p className="text-center text-sm text-[#9a9a9a]">
          Pick a persona from the menu and start your conversation.
        </p>
      </div>
    </div>
  )
}
