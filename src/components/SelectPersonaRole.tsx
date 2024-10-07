import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { TempPersonaData } from '@/model/persona'
import {
  defaultPersonaIcon,
  personaLanguageOptions,
  personaStyleOptions,
  personaToneOptions
} from '@/data/persona'
import { PersonaLanguage, PersonaStyle, PersonaTone } from '@/enum/persona'
import { createPersona, getMePersonas, updatePersona } from '@/apis/persona'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { formatPersona } from '@/utils/persona'
import { useAuth } from '@/services/auth/hooks/useAuth'
import Chip from '@/components/Chip'
import EmojiPicker from 'emoji-picker-react'
import { AiOutlineImport } from 'react-icons/ai'
import { CreatePersonaPayload } from '@/apis/model/persona'
import InputColor from '@/components/InputColor'
import { Checkbox } from './ui/checkbox'
import MobileConversationPersonaNav from './conversation/MobileConversationPersonaNav'
import PersonaItem from './PersonaItem'
import SearchPersonaModal from './SearchPersonaModal'
import clsx from 'clsx'

interface SelectPersonaRoleProps {
  defaultPersona?: TempPersonaData
  onSubmitted: (persona: TempPersonaData) => void
  onBack?: () => void
  name: string
}

export default function SelectPersonaRole({
  onSubmitted,
  name,
  defaultPersona,
  onBack
}: SelectPersonaRoleProps) {
  const { authAxios, userData } = useAuth()
  const user_id = userData?.me?.id
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [isSaveToAccount, setIsSaveToAccount] = useState(true)
  const queryClient = useQueryClient()
  const [persona, setPersona] = useState<TempPersonaData | undefined>(
    defaultPersona
  )

  const { data: mePersonasRes } = useQuery({
    queryKey: ['getMePersonas', user_id, authAxios],
    queryFn: () => {
      if (!user_id || !authAxios) return
      return getMePersonas(authAxios)()
    },
    enabled: !!authAxios
  })

  const personasApiData = mePersonasRes?.data ?? []
  const personasData = personasApiData.map((data) => formatPersona(data))

  const createPersonaMutation = useMutation({
    mutationFn: (payload: CreatePersonaPayload) => {
      return createPersona(authAxios!)(payload)
    },
    onSuccess: (data) => {
      setPersona((prev) => {
        if (prev) return { ...prev, id: data.data.persona_id }
      })
      queryClient.invalidateQueries({ queryKey: ['getMePersonas'] })
    }
  })

  const handleImportPersona = (id: number) => {
    setPersona({
      ...personaTemplates.find((persona) => persona.id == id)!,
      id: undefined,
      isPreset: false
    })
  }

  const updatePersonaMutation = useMutation({
    mutationFn: (personaId: number) => {
      return updatePersona(authAxios!)({
        persona_id: personaId,
        payload: {
          persona_name: persona?.name,
          tone: persona?.tone,
          lang: persona?.language,
          style: persona?.style,
          persona_description: persona?.description,
          user_id,
          icon: persona?.avatar,
          message_color: persona?.messageColor
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMePersonas'] })
    }
  })

  const handleNew = () => {
    setPersona({
      avatar: defaultPersonaIcon,
      name: '',
      description: '',
      tone: PersonaTone.Empathetic,
      language: PersonaLanguage.Formal,
      style: PersonaStyle.Direct,
      messageColor: '#EBEBEB'
    })
  }

  const handleSave = () => {
    if (!persona) return
    if (isSaveToAccount) {
      if (persona?.id) {
        updatePersonaMutation.mutate(persona.id, {
          onSuccess: () => {
            onSubmitted(persona)
          }
        })
      } else {
        if (!user_id) return
        createPersonaMutation.mutate(
          {
            persona_name: persona.name,
            tone: persona.tone,
            lang: persona.language,
            style: persona.style,
            persona_description: persona.description,
            user_id,
            icon: persona.avatar,
            message_color: persona.messageColor
          },
          {
            onSuccess: (res) => {
              onSubmitted(formatPersona(res.data))
            }
          }
        )
      }
    } else {
      onSubmitted(persona)
    }
  }

  const personaTemplates = personasApiData
    .filter((item) => {
      return item.user_id == '-1'
    })
    .map((data) => formatPersona(data))

  const personaSearchOptionsData = personasData
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .reverse()
    .sort((a, b) => {
      const aUpdatedAt = a.updatedAt?.getTime() ?? 0
      const bUpdatedAt = b.updatedAt?.getTime() ?? 0
      return bUpdatedAt - aUpdatedAt
    })

  return (
    <div className="flex h-full flex-1 flex-col space-y-4">
      <div className="hidden space-y-1 sm:block">
        <p className="text-[#4c4c4c]">Select a persona</p>
        <SearchPersonaModal
          className="w-[636px]"
          personaOptions={personasData}
          onClickNewPersona={handleNew}
          onChangePersona={setPersona}
        >
          <div>
            {!persona?.id && (
              <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#ebebeb] bg-white px-3 py-2">
                <img src="/images/default-persona.png" alt="default-logo" />
                <p className="text-[#4c4c4c]">{persona ? 'New' : 'Persona'}</p>
                <IoIosArrowDown className="ml-auto" />
              </div>
            )}
            {persona?.id && (
              <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#ebebeb] bg-white px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-xl">
                    {persona?.avatar}
                  </div>
                  <p className="text-[#4c4c4c]">{persona?.name}</p>
                </div>
                <IoIosArrowDown className="ml-auto" />
              </div>
            )}
          </div>
        </SearchPersonaModal>
        {/* <Popover>
          <PopoverTrigger asChild>
            <div>
              {!persona?.id && (
                <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#ebebeb] bg-white px-3 py-2">
                  <img src="/images/default-persona.png" alt="default-logo" />
                  <p className="text-[#4c4c4c]">
                    {persona ? 'New' : 'Persona'}
                  </p>
                  <IoIosArrowDown className="ml-auto" />
                </div>
              )}
              {persona?.id && (
                <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#ebebeb] bg-white px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-xl">
                      {persona?.avatar}
                    </div>
                    <p className="text-[#4c4c4c]">{persona?.name}</p>
                  </div>
                  <IoIosArrowDown className="ml-auto" />
                </div>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[636px] overflow-hidden rounded-[20px] px-0 py-3">
            <div className="relative mb-3 w-full rounded-xl px-6">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-9">
                <IoMdSearch className="size-4 text-[#9a9a9a]" />
              </div>
              <input
                className="w-full rounded-xl border border-[#ebebeb] py-2 pl-8 pr-4 text-sm placeholder:text-[#9a9a9a] focus:outline-none"
                type="text"
                placeholder="Search"
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
              />
            </div>
            <PopoverClose>
              <button
                className="mx-6 mb-4 mt-2 flex items-center gap-1"
                onClick={handleNew}
              >
                <IoMdAdd className="text-earth-green" />
                <p className="text-sm text-earth-green">New Persona</p>
              </button>
            </PopoverClose>
            <div className="max-h-[430px] overflow-auto">
              {personaSearchOptionsData.map((persona, index) => (
                <PopoverClose
                  key={persona.id}
                  className="flex w-full"
                  onClick={() => {
                    setPersona(persona)
                  }}
                >
                  <PersonaItem
                    className={cn({
                      'border-b border-b-[#EDEDED]':
                        index !== personaSearchOptionsData.length - 1
                    })}
                    avatar={persona.avatar}
                    name={persona.name}
                  />
                </PopoverClose>
              ))}
            </div>
          </PopoverContent>
        </Popover> */}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-t-[20px] bg-[#F7F7F7] sm:flex-row sm:rounded-b-[20px]">
        <MobileConversationPersonaNav
          persona={persona}
          onChangePersona={(id) => {
            setPersona(personasData.find((data) => data.id === id))
          }}
          personaOptions={personaSearchOptionsData}
          search={search}
          onChangeSearch={setSearch}
          onClickNewPersona={handleNew}
        />
        {persona && (
          <div className="w-full space-y-8 p-6 pb-10">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-base text-[#4c4c4c]">
                  Persona Icon &amp; Name
                </p>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-1 text-earth-green">
                      <AiOutlineImport />
                      <span className="text-sm">Import template</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="mr-5 w-[200px] overflow-hidden rounded-[20px] p-0 sm:-mr-20">
                    {personaTemplates.map((persona) => (
                      <PopoverClose
                        className="w-full"
                        key={persona.id}
                        onClick={() => {
                          handleImportPersona(persona.id)
                        }}
                      >
                        <PersonaItem
                          avatar={persona.avatar}
                          name={persona.name}
                        />
                      </PopoverClose>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>

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
                          setPersona((prev) => {
                            if (prev)
                              return {
                                ...prev,
                                avatar: emojiData.emoji
                              }
                          })
                        }}
                      />
                    </div>
                  )}
                </button>
                <input
                  className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
                  type="text"
                  placeholder="Name"
                  disabled={persona.isPreset}
                  value={persona.name}
                  onChange={(e) => {
                    setPersona((prev) => {
                      if (prev) {
                        return {
                          ...prev,
                          name: e.target.value
                        }
                      }
                    })
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
                    disabled={persona.isPreset && persona.tone !== option.value}
                    onClick={() => {
                      setPersona((prev) => {
                        if (prev)
                          return {
                            ...prev,
                            tone: option.value
                          }
                      })
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
                    disabled={
                      persona.isPreset && persona.language !== option.value
                    }
                    onClick={() => {
                      setPersona((prev) => {
                        if (prev)
                          return {
                            ...prev,
                            language: option.value
                          }
                      })
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
                    disabled={
                      persona.isPreset && persona.style !== option.value
                    }
                    onClick={() => {
                      setPersona((prev) => {
                        if (prev)
                          return {
                            ...prev,
                            style: option.value
                          }
                      })
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-base text-[#4c4c4c]">Description</p>
              <textarea
                className="w-full rounded-lg border border-[#ebebeb] px-3 py-2 text-base outline-none disabled:bg-[#ebebeb] disabled:text-[#9A9A9A]"
                placeholder="Enter the description of this persona"
                rows={3}
                disabled={persona.isPreset}
                value={persona.description}
                onChange={(e) => {
                  setPersona((prev) => {
                    if (prev)
                      return {
                        ...prev,
                        description: e.target.value
                      }
                  })
                }}
              />
            </div>
            <div className="space-y-1">
              <p className="text-base text-[#4c4c4c]">User Message Color</p>
              <InputColor
                value={persona.messageColor}
                onChange={(value) => {
                  setPersona((prev) => {
                    if (prev)
                      return {
                        ...prev,
                        messageColor: value
                      }
                  })
                }}
              />
            </div>
            <div className="block sm:hidden">
              <div
                className={clsx('flex gap-4', {
                  'justify-end': !onBack
                })}
              >
                {onBack && (
                  <button
                    className="mr-auto text-[#4c4c4c] hover:text-earth-green"
                    onClick={onBack}
                  >
                    Back
                  </button>
                )}
                {persona && (
                  <label
                    className="flex cursor-pointer items-center gap-2"
                    htmlFor="save-backend"
                  >
                    <Checkbox
                      id="save-backend"
                      checked={isSaveToAccount}
                      onCheckedChange={(e) => setIsSaveToAccount(e as boolean)}
                    />
                    <p className="text-sm text-[#4c4c4c]">
                      {persona?.id
                        ? 'Update current persona'
                        : 'Save this persona to my account'}
                    </p>
                  </label>
                )}
                <Button
                  className="w-[120px] "
                  disabled={!persona}
                  onClick={handleSave}
                  isLoading={
                    createPersonaMutation.isPending ||
                    updatePersonaMutation.isPending
                  }
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}
        {!persona && (
          <div className="flex size-full flex-1 flex-col items-center justify-center gap-4">
            <img src="/images/bg-conversation.svg" alt="bg" />
            <p className="w-[297px] text-center text-base text-[#4c4c4c]">
              Select or create a new persona for {name} to simulate a
              conversation.
            </p>
          </div>
        )}
      </div>
      <div
        className={clsx('hidden gap-4 sm:flex', {
          'self-end': !onBack
        })}
      >
        {onBack && (
          <button
            className="mr-auto text-[#4c4c4c] hover:text-earth-green"
            onClick={onBack}
          >
            Back
          </button>
        )}
        {persona && (
          <label
            className="flex cursor-pointer items-center gap-2"
            htmlFor="save-backend"
          >
            <Checkbox
              id="save-backend"
              checked={isSaveToAccount}
              onCheckedChange={(e) => setIsSaveToAccount(e as boolean)}
            />
            <p className="text-sm text-[#4c4c4c]">
              {persona?.id
                ? 'Update current persona'
                : 'Save this persona to my account'}
            </p>
          </label>
        )}
        <Button
          className="w-[120px] "
          disabled={!persona}
          onClick={handleSave}
          isLoading={
            createPersonaMutation.isPending || updatePersonaMutation.isPending
          }
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
