import { CreatePersonaPayload } from '@/apis/model/persona'
import { createPersona } from '@/apis/persona'
import Chip from '@/components/Chip'
import InputColor from '@/components/InputColor'
import { Button } from '@/components/ui/button'
import {
  defaultPersonaIcon,
  personaLanguageOptions,
  personaStyleOptions,
  personaToneOptions
} from '@/data/persona'
import { PersonaLanguage, PersonaStyle, PersonaTone } from '@/enum/persona'
import { PersonaData } from '@/model/persona'
import { useAuth } from '@/services/auth/hooks/useAuth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import EmojiPicker from 'emoji-picker-react'
import { useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export default function CreatePersona() {
  const { authAxios, userData } = useAuth()
  const user_id = userData?.me?.id
  const navigate = useNavigate()
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const [persona, setPersona] = useState<PersonaData>({
    id: Date.now(),
    avatar: defaultPersonaIcon,
    name: '',
    description: '',
    tone: PersonaTone.Empathetic,
    language: PersonaLanguage.Formal,
    style: PersonaStyle.Direct,
    messageColor: '#EBEBEB'
  })

  const queryClient = useQueryClient()

  const createPersonaMutation = useMutation({
    mutationFn: (payload: CreatePersonaPayload) => {
      return createPersona(authAxios!)(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMePersonas'] })
      queryClient.invalidateQueries({ queryKey: ['getChatroomPersonas'] })
      navigate(-1)
    }
  })

  const handleCreate = () => {
    if (!user_id) return
    createPersonaMutation.mutate({
      name: persona.name,
      tone: persona.tone,
      lang: persona.language,
      style: persona.style,
      description: persona.description,
      icon: persona.avatar,
      message_color: persona.messageColor
    })
  }

  return (
    <div className="h-[calc(calc(var(--vh)*100-60px)] flex pt-6 sm:px-16 sm:pb-16">
      <div
        className="box-border flex flex-1 justify-center overflow-hidden rounded-t-[20px] bg-[#f7f7f7] sm:rounded-b-[20px]"
        style={{ boxShadow: '0px 8px 40px 0 rgba(65,76,65,0.16)' }}
      >
        <div className="hidden w-28 sm:block sm:py-10">
          <button
            className="flex size-10 items-center justify-center rounded-full border border-[#EBEBEB]"
            onClick={() => {
              navigate(-1)
            }}
          >
            <FaArrowLeft />
          </button>
        </div>
        <div className="flex size-full sm:w-auto sm:py-10">
          <div className="size-full">
            <div className="relative flex h-[56px] items-center justify-center gap-2 bg-white sm:h-auto sm:bg-transparent sm:pr-28">
              <div className="absolute left-4 top-2 sm:hidden">
                <button
                  className="flex size-10 items-center justify-center"
                  onClick={() => {
                    navigate(-1)
                  }}
                >
                  <FaArrowLeft />
                </button>
              </div>
              <div className="flex size-8 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-lg">
                {persona.avatar}
              </div>
              <h3 className="text-base text-[#4c4c4c] sm:text-2xl">
                {persona.name || 'New'}
              </h3>
            </div>
            <div className="size-full overflow-auto  sm:pr-28">
              <div className="pb-10  sm:max-w-xl">
                <div className="mt-8 px-4 pb-10 sm:px-0 sm:pb-0">
                  <div className="space-y-8">
                    <div className="space-y-1">
                      <p className="text-base text-[#4c4c4c]">
                        Persona Icon &amp; Name
                      </p>
                      <div className="flex space-x-1">
                        <button
                          className="relative flex size-[46px] shrink-0 items-center justify-center rounded-lg border border-[#ebebeb] bg-white"
                          onClick={() => {
                            setEmojiPickerOpen(true)
                          }}
                        >
                          <div className="flex size-full items-center justify-center text-2xl">
                            {persona.avatar}
                          </div>
                          {emojiPickerOpen && (
                            <div className="absolute size-full">
                              <EmojiPicker
                                open={true}
                                onReactionClick={() => {
                                  setEmojiPickerOpen(false)
                                }}
                                onEmojiClick={(emojiData) => {
                                  setEmojiPickerOpen(false)
                                  setPersona((prev) => ({
                                    ...prev,
                                    avatar: emojiData.emoji
                                  }))
                                }}
                              />
                            </div>
                          )}
                        </button>
                        <input
                          className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
                          type="text"
                          placeholder="Name"
                          value={persona.name}
                          onChange={(e) => {
                            setPersona((prev) => ({
                              ...prev,
                              name: e.target.value
                            }))
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-base text-[#4c4c4c]">Tone</p>
                      <div className="space-x-2 space-y-2">
                        {personaToneOptions.map((option) => (
                          <Chip
                            key={option.value}
                            label={option.label}
                            selected={persona.tone === option.value}
                            onClick={() => {
                              setPersona((prev) => ({
                                ...prev,
                                tone: option.value
                              }))
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-base text-[#4c4c4c]">Language</p>
                      <div className="space-x-2 space-y-2">
                        {personaLanguageOptions.map((option) => (
                          <Chip
                            key={option.value}
                            label={option.label}
                            selected={persona.language === option.value}
                            onClick={() => {
                              setPersona((prev) => ({
                                ...prev,
                                language: option.value
                              }))
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-base text-[#4c4c4c]">Style</p>
                      <div className="space-x-2 space-y-2">
                        {personaStyleOptions.map((option) => (
                          <Chip
                            key={option.value}
                            label={option.label}
                            selected={persona.style === option.value}
                            onClick={() => {
                              setPersona((prev) => ({
                                ...prev,
                                style: option.value
                              }))
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-base text-[#4c4c4c]">Description</p>
                      <textarea
                        className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
                        rows={3}
                        placeholder="Enter the description of this persona"
                        value={persona.description}
                        onChange={(e) => {
                          setPersona((prev) => ({
                            ...prev,
                            description: e.target.value
                          }))
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base text-[#4c4c4c]">
                        User Message Color
                      </p>
                      <InputColor
                        value={persona.messageColor}
                        onChange={(value) => {
                          setPersona((prev) => ({
                            ...prev,
                            messageColor: value
                          }))
                        }}
                      />
                    </div>
                  </div>
                  <div className=" mt-10 flex justify-end space-x-4">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        navigate(-1)
                      }}
                      disabled={createPersonaMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      className=" w-[120px]"
                      onClick={handleCreate}
                      isLoading={createPersonaMutation.isPending}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
