import Chip from '@/components/Chip'
import {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  defaultPersonaIcon,
  personaLanguageOptions,
  personaStyleOptions,
  personaToneOptions
} from '@/data/persona'
import { useMockDataStore } from '@/store/useMockDataStore'
import EmojiPicker from 'emoji-picker-react'
import { useState } from 'react'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { FaArrowDown } from 'react-icons/fa6'
import { AiOutlineImport } from 'react-icons/ai'
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { IoMdAdd, IoMdSearch } from 'react-icons/io'
import { BsThreeDots } from 'react-icons/bs'
import { PersonaLanguage, PersonaStyle, PersonaTone } from '@/enum/persona'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'

const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string

export default function Rewrite() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [inputMessage, setInputMessage] = useState('')
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const {
    mockPersonasData: personasData,
    setMockPersonasData,
    addMockPersonaData,
    deleteMockPersonaData
  } = useMockDataStore()
  const [persona, setPersona] = useState(
    personasData[0] || {
      id: Date.now(),
      avatar: defaultPersonaIcon,
      name: '',
      description: '',
      tone: PersonaTone.Empathetic,
      language: PersonaLanguage.Formal,
      style: PersonaStyle.Direct,
      messageColor: '#EBEBEB'
    }
  )

  const handleNew = () => {
    setPersona({
      id: Date.now(),
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
    if (personasData.find((_persona) => _persona.id == persona.id)) {
      setMockPersonasData(
        personasData.map((item) =>
          item.id === persona.id ? { ...persona, updatedAt: new Date() } : item
        )
      )
    } else {
      addMockPersonaData({
        ...persona,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
  }

  const handleDelete = () => {
    deleteMockPersonaData(persona.id)
  }

  const handleImportPersona = (id: number | string) => {
    setPersona({
      ...personasData.find((persona) => persona.id == id)!,
      id: Date.now(),
      isPreset: false
    })
  }

  const rewriteMutation = useMutation({
    mutationFn: () => {
      return axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are now playing a role, and the following are the character's stats. Please rewrite the content I input in this character's style.
            name: ${persona?.name}.
            description: ${persona?.description}.
            tone: ${persona?.tone}.
            style: ${persona?.style}.
            language: ${persona?.language}.
            `
            },
            { role: 'user', content: inputMessage }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${VITE_OPENAI_API_KEY}`
          }
        }
      )
    },
    onSuccess: () => {
      setMockPersonasData(
        personasData.map((item) =>
          item.id === persona.id ? { ...persona, updatedAt: new Date() } : item
        )
      )
    }
  })

  const personaOptionsData = [...personasData]
    .reverse()
    .sort((a, b) => {
      const aLastMessageSentAt = a.lastMessageSentAt?.getTime() ?? 0
      const bLastMessageSentAt = b.lastMessageSentAt?.getTime() ?? 0
      const aUpdatedAt = a.updatedAt?.getTime() ?? 0
      const bUpdatedAt = b.updatedAt?.getTime() ?? 0
      const aTime =
        aLastMessageSentAt > aUpdatedAt ? aLastMessageSentAt : aUpdatedAt
      const bTime =
        bLastMessageSentAt > bUpdatedAt ? bLastMessageSentAt : bUpdatedAt
      return bTime - aTime
    })
    .slice(0, 5)

  const personaSearchOptionsData = personasData
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .reverse()
    .sort((a, b) => {
      const aLastMessageSentAt = a.lastMessageSentAt?.getTime() ?? 0
      const bLastMessageSentAt = b.lastMessageSentAt?.getTime() ?? 0
      const aUpdatedAt = a.updatedAt?.getTime() ?? 0
      const bUpdatedAt = b.updatedAt?.getTime() ?? 0
      const aTime =
        aLastMessageSentAt > aUpdatedAt ? aLastMessageSentAt : aUpdatedAt
      const bTime =
        bLastMessageSentAt > bUpdatedAt ? bLastMessageSentAt : bUpdatedAt
      return bTime - aTime
    })

  return (
    <div className="flex h-[calc(var(--vh)*100-60px)] pt-6 sm:px-16 sm:pb-16">
      <div className="mx-auto flex w-full max-w-[1113px] gap-8">
        <div
          className="box-border flex flex-1 shrink-0 overflow-hidden rounded-t-[20px] bg-[#f7f7f7] py-4 sm:rounded-b-[20px]"
          style={{ boxShadow: '0px 8px 40px 0 rgba(65,76,65,0.16)' }}
        >
          <div className="size-full overflow-y-auto px-6">
            <div className="pb-10">
              <div className="mt-2 space-y-6 px-4 pb-10 sm:px-0 sm:pb-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-base text-[#4c4c4c]">Rewrite with</p>
                  </div>
                  <div className="flex gap-4">
                    {personaOptionsData.map((data) => (
                      <div
                        key={data.id}
                        className="flex w-14 cursor-pointer flex-col items-center gap-1"
                      >
                        <div
                          className={cn(
                            'flex size-10 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-xl outline outline-transparent transition-all hover:bg-earth-green hover:outline-2 hover:outline-[#DDE7DD]',
                            {
                              'outline-[#DDE7DD] bg-earth-green':
                                data.id === persona.id
                            }
                          )}
                          onClick={() => {
                            setPersona(data)
                          }}
                        >
                          {data.avatar}
                        </div>
                        <p className="text-xs text-[#4c4c4c]">{data.name}</p>
                      </div>
                    ))}
                    <div
                      className="flex w-14 cursor-pointer flex-col items-center gap-1"
                      onClick={handleNew}
                    >
                      <div className="group flex size-10 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-xl outline outline-transparent transition-all hover:bg-earth-green hover:outline-2 hover:outline-[#DDE7DD]">
                        <IoMdAdd className="text-earth-green group-hover:text-white" />
                      </div>
                      <p className="text-xs text-[#4c4c4c]">New</p>
                    </div>
                    {personasData.length > 5 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="flex w-14 cursor-pointer flex-col items-center gap-1">
                            <div className="group flex size-10 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-xl outline outline-transparent transition-all hover:bg-earth-green hover:outline-2 hover:outline-[#DDE7DD]">
                              <BsThreeDots className="text-[#4C4C4C] group-hover:text-white" />
                            </div>
                            <p className="text-xs text-[#4c4c4c]">More</p>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="mr-[413px] w-[495px] overflow-hidden rounded-[20px] px-0 py-3">
                          <div className="relative mb-3 w-full rounded-xl px-4">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                              <IoMdSearch className="size-4 text-[#9a9a9a]" />
                            </div>
                            <input
                              className="w-full rounded-xl border border-[#ebebeb] py-2 pl-10 pr-4 text-sm placeholder:text-[#9a9a9a] focus:outline-none"
                              type="text"
                              placeholder="Search"
                              value={search}
                              onChange={(event) =>
                                setSearch(event.currentTarget.value)
                              }
                            />
                          </div>
                          <div className=" max-h-[430px]  overflow-auto">
                            {personaSearchOptionsData.map((data) => (
                              <PopoverClose
                                key={data.id}
                                className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 transition hover:bg-[#f7f7f7]"
                                onClick={() => {
                                  setPersona(data)
                                }}
                              >
                                <div className="flex size-8 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-xl">
                                  {data.avatar}
                                </div>
                                <p className="text-[#4c4c4c]">{data.name}</p>
                              </PopoverClose>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>
                <div className="h-px w-full bg-[#EBEBEB]" />
                <div className="space-y-8">
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
                        <PopoverContent className="-mr-20 w-[200px] overflow-hidden rounded-[20px] p-0">
                          {personasData.map((persona) => (
                            <PopoverClose
                              key={persona.id}
                              className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 transition hover:bg-[#f7f7f7]"
                              onClick={() => {
                                handleImportPersona(persona.id)
                              }}
                            >
                              <div className="flex size-8 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-xl">
                                {persona.avatar}
                              </div>
                              <p className="text-[#4c4c4c]">{persona.name}</p>
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
                        disabled={persona.isPreset}
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
                          disabled={
                            persona.isPreset && persona.tone !== option.value
                          }
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
                          disabled={
                            persona.isPreset &&
                            persona.language !== option.value
                          }
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
                          disabled={
                            persona.isPreset && persona.style !== option.value
                          }
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
                      placeholder="Enter the description of this persona"
                      rows={3}
                      disabled={persona.isPreset}
                      value={persona.description}
                      onChange={(e) => {
                        setPersona((prev) => ({
                          ...prev,
                          description: e.target.value
                        }))
                      }}
                    />
                  </div>
                </div>
                <div className="mt-10 flex justify-end space-x-4">
                  {personasData.find((persona) => persona.id == persona.id) && (
                    <AlertDialog
                      open={deleteDialogOpen}
                      onOpenChange={setDeleteDialogOpen}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          className="mr-auto text-[#EA4663]"
                          variant="secondary"
                        >
                          <RiDeleteBin5Line className="mr-1" />
                          <span>Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-[414px]">
                        <AlertDialogHeader className="hidden">
                          <AlertDialogTitle>Delete Persona</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div>
                          <div className="flex flex-col items-center gap-2">
                            <div className=" flex size-8 items-center justify-center rounded-full bg-[#FFEEF2]">
                              <RiDeleteBin5Line className=" text-xl text-[#EA4663]" />
                            </div>
                            <p className="text-center text-xl text-[#ea4663]">
                              Delete Persona
                            </p>
                          </div>
                          <p className="mt-3 text-base text-[#4c4c4c]">
                            This action cannot be undone. All conversations
                            associated with this persona will be lost.
                          </p>
                          <div className="mt-8 flex justify-end gap-6">
                            <Button
                              className="px-6"
                              variant="waring-secondary"
                              onClick={() => {
                                setDeleteDialogOpen(false)
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="px-6"
                              variant="warning"
                              onClick={handleDelete}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => {
                      navigate('/')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button className="w-[120px]" onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 shrink-0 flex-col gap-6">
          <div
            className="box-border flex flex-1 overflow-hidden rounded-t-[20px] bg-[#f7f7f7] sm:rounded-b-[20px]"
            style={{ boxShadow: '0px 8px 40px 0 rgba(65,76,65,0.16)' }}
          >
            <div className="relative size-full">
              <div className="h-1/2 bg-white">
                <textarea
                  className="size-full resize-none overflow-y-auto px-4 py-6 text-base placeholder:text-[#9a9a9a] focus:outline-none"
                  placeholder="Type or paste the content you’d like the persona to rewrite."
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value)
                  }}
                />
              </div>
              <div
                className={cn('h-1/2 bg-[#f7f7f7] px-4 py-6 text-[#9a9a9a]', {
                  'text-black':
                    !!rewriteMutation.data?.data.choices[0].message.content
                })}
              >
                {rewriteMutation.data?.data.choices[0].message.content ??
                  'Output'}
              </div>
              <div className=" absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-earth-green">
                <FaArrowDown className="text-white" />
              </div>
            </div>
          </div>
          <Button
            onClick={() => {
              if (inputMessage !== '') {
                rewriteMutation.mutate()
              }
            }}
          >
            Rewrite
          </Button>
        </div>
      </div>
    </div>
  )
}
