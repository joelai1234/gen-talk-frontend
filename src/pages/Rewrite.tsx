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
import EmojiPicker from 'emoji-picker-react'
import { useRef, useState } from 'react'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

import { AiOutlineImport } from 'react-icons/ai'
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { IoMdAdd } from 'react-icons/io'
import { BsThreeDots } from 'react-icons/bs'
import { PersonaLanguage, PersonaStyle, PersonaTone } from '@/enum/persona'
import { cn } from '@/lib/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/services/auth/hooks/useAuth'
import {
  createPersona,
  deletePersona,
  getMePersonas,
  rewriteMessage,
  updatePersona
} from '@/apis/persona'
import { TempPersonaData } from '@/model/persona'
import { formatPersona } from '@/utils/persona'
import {
  CreatePersonaPayload,
  RewriteMessagePayload
} from '@/apis/model/persona'
import { IoIosArrowUp } from 'react-icons/io'
import MobileRewritePersonaNav from '@/components/rewrite/MobileRewritePersonaNav'
import { useMedia } from 'react-use'
import PersonaItem from '@/components/PersonaItem'
import SearchPersonaModal from '@/components/SearchPersonaModal'
import TextCopyClipboard from '@/components/TextCopyClipboard'

export default function Rewrite() {
  const scrollBoxRef = useRef<HTMLDivElement | null>(null)
  const { authAxios, userData } = useAuth()
  const user_id = userData?.me?.id
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [inputMessage, setInputMessage] = useState('')
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isShowMobilePersonaUi, setIsShowMobilePersonaUi] = useState(false)
  const [rewriteMessages, setRewriteMessages] = useState<string[]>([])
  const isMobile = useMedia('(max-width: 640px)')

  const { data: mePersonasRes } = useQuery({
    queryKey: ['getMePersonas', user_id, authAxios],
    queryFn: () => {
      if (!user_id || !authAxios) return
      return getMePersonas(authAxios!)({ user_id })
    },
    enabled: !!authAxios
  })

  const personasApiData = mePersonasRes?.data ?? []
  const personasData = personasApiData.map((data) => formatPersona(data))

  const [persona, setPersona] = useState<TempPersonaData>({
    avatar: defaultPersonaIcon,
    name: '',
    description: '',
    tone: PersonaTone.Empathetic,
    language: PersonaLanguage.Formal,
    style: PersonaStyle.Direct,
    messageColor: '#EBEBEB'
  })

  const createPersonaMutation = useMutation({
    mutationFn: (payload: CreatePersonaPayload) => {
      return createPersona(authAxios!)(payload)
    },
    onSuccess: (data) => {
      setPersona((prev) => ({ ...prev, id: data.data.persona_id }))
      queryClient.invalidateQueries({ queryKey: ['getMePersonas'] })
      setIsShowMobilePersonaUi(false)
    }
  })

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
      setIsShowMobilePersonaUi(false)
    }
  })

  const deletePersonaMutation = useMutation({
    mutationFn: (personaId: number) => {
      return deletePersona(authAxios!)({
        persona_id: Number(personaId)
      })
    },
    onSuccess: () => {
      setDeleteDialogOpen(false)
      // scrollBoxRef.current?.scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'start'
      // })
      // scrollBoxRef.current?.scrollTo({ behavior: 'smooth', top: 0 })
      setIsShowMobilePersonaUi(false)
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
    if (isMobile) {
      setIsShowMobilePersonaUi(true)
    }
  }

  const handleSave = () => {
    if (persona.id) {
      updatePersonaMutation.mutate(persona.id)
    } else {
      if (!user_id) return
      createPersonaMutation.mutate({
        persona_name: persona.name,
        tone: persona.tone,
        lang: persona.language,
        style: persona.style,
        persona_description: persona.description,
        user_id: user_id,
        icon: persona.avatar,
        message_color: persona.messageColor
      })
    }
  }

  const handleDelete = () => {
    if (persona.id) {
      deletePersonaMutation.mutate(persona.id)
    }
  }

  const personaTemplates = personasApiData
    .filter((item) => {
      return item.user_id == '-1'
    })
    .map((data) => formatPersona(data))

  const handleImportPersona = (id: number) => {
    setPersona({
      ...personaTemplates.find((persona) => persona.id == id)!,
      id: undefined,
      isPreset: false
    })
  }

  const rewriteMutation = useMutation({
    mutationFn: (payload: RewriteMessagePayload) => {
      return rewriteMessage(authAxios!)(payload)
    },
    onSuccess: (data) => {
      setRewriteMessages((prev) => [...prev, data.data.response])
    }
  })

  const personaOptionsData = personasData
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
    <div className="box-border flex min-h-[calc(var(--vh)*100-60px)] flex-col gap-2 pb-6 sm:h-[calc(var(--vh)*100-60px)] sm:flex-row sm:px-16 sm:pb-16">
      <MobileRewritePersonaNav
        persona={persona}
        onChangePersona={(id) => {
          setPersona(personasData.find((persona) => persona.id == id)!)
        }}
        personaOptions={personaSearchOptionsData}
        search={search}
        onChangeSearch={setSearch}
        onClickNewPersona={handleNew}
        onClickAdjustments={() => setIsShowMobilePersonaUi((prev) => !prev)}
      />
      <div className="mx-auto flex w-full max-w-[1113px] flex-1 flex-col gap-8 pb-6 sm:flex-row sm:pb-0">
        <div
          className={cn(
            'box-border flex-1 shrink-0 rounded-[20px] relative bg-[#f7f7f7] py-4 sm:flex sm:overflow-hidden',
            {
              hidden: !isShowMobilePersonaUi
            }
          )}
          style={{ boxShadow: '0px 8px 40px 0 rgba(65,76,65,0.16)' }}
        >
          <div
            className="absolute bottom-0 left-1/2 flex size-10 -translate-x-1/2 translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#EBEBEB] bg-white"
            onClick={() => setIsShowMobilePersonaUi(false)}
          >
            <IoIosArrowUp />
          </div>
          <div className="size-full overflow-y-auto px-2 sm:px-6">
            <div ref={scrollBoxRef} />
            <div className="sm:pb-10">
              <div className="mt-2 space-y-6 px-4 pb-10 sm:px-0 sm:pb-0">
                <div className="hidden space-y-2 sm:block">
                  <div className="flex items-center justify-between">
                    <p className="text-base text-[#4c4c4c]">Rewrite with</p>
                  </div>
                  <div className="flex gap-4">
                    {personaOptionsData.map((data) => (
                      <div
                        key={data.id}
                        className="flex w-14 cursor-pointer flex-col items-center gap-1"
                        onClick={() => {
                          setPersona(data)
                        }}
                      >
                        <div
                          className={cn(
                            'flex size-10 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-xl outline outline-transparent transition-all hover:bg-earth-green hover:outline-2 hover:outline-[#DDE7DD]',
                            {
                              'outline-[#DDE7DD] bg-earth-green':
                                data.id === persona.id
                            }
                          )}
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
                      <SearchPersonaModal
                        className="mr-[413px] w-[495px]"
                        personaOptions={personasData}
                        onClickNewPersona={handleNew}
                        onChangePersona={setPersona}
                      >
                        <div className="flex w-14 cursor-pointer flex-col items-center gap-1">
                          <div className="group flex size-10 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-xl outline outline-transparent transition-all hover:bg-earth-green hover:outline-2 hover:outline-[#DDE7DD]">
                            <BsThreeDots className="text-[#4C4C4C] group-hover:text-white" />
                          </div>
                          <p className="text-xs text-[#4c4c4c]">More</p>
                        </div>
                      </SearchPersonaModal>
                    )}
                  </div>
                </div>
                <div className="hidden h-px w-full bg-[#EBEBEB] sm:block" />
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
                  {personasApiData.find(
                    (_persona) =>
                      _persona.persona_id == persona.id &&
                      _persona.user_id !== '-1'
                  ) && (
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
                              disabled={deletePersonaMutation.isPending}
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
                              isLoading={deletePersonaMutation.isPending}
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
                  <Button
                    className="w-[120px]"
                    onClick={handleSave}
                    isLoading={
                      createPersonaMutation.isPending ||
                      updatePersonaMutation.isPending
                    }
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-[calc(var(--vh)*100-180px)] shrink-0 grow flex-col gap-6 sm:h-auto sm:flex-1">
          <div
            className="box-border flex flex-1 overflow-hidden rounded-[20px] bg-[#f7f7f7] sm:flex-1"
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
              <div className="h-1/2 space-y-4 overflow-auto border-t border-t-[#EBEBEB] bg-white px-4 py-6 text-[#9a9a9a]">
                {rewriteMessages.length === 0 && 'Output'}
                {[...rewriteMessages].reverse().map((message) => (
                  <TextCopyClipboard key={message} text={message} />
                ))}
              </div>
            </div>
          </div>
          <Button
            className="mx-6"
            onClick={() => {
              if (inputMessage !== '') {
                if (persona.id && user_id) {
                  rewriteMutation.mutate({
                    persona_id: persona.id,
                    user_id: user_id,
                    message: inputMessage
                  })
                }
              }
            }}
            isLoading={rewriteMutation.isPending}
            disabled={
              !personasData.find((_persona) => _persona.id == persona.id)
            }
          >
            Rewrite
          </Button>
        </div>
      </div>
    </div>
  )
}
