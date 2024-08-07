import Chip from '@/components/Chip'
import InputColor from '@/components/InputColor'
import { Button } from '@/components/ui/button'
import {
  personaLanguageOptions,
  personaStyleOptions,
  personaToneOptions
} from '@/data/persona'
import { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { RiDeleteBin5Line } from 'react-icons/ri'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import EmojiPicker from 'emoji-picker-react'
import { deletePersona, getOnePersona, updatePersona } from '@/apis/persona'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { PersonaData } from '@/model/persona'
// import { PersonaLanguage, PersonaStyle, PersonaTone } from '@/enum/persona'
import { useAuth } from '@/services/auth/hooks/useAuth'
import { PersonaData } from '@/model/persona'
import { PersonaLanguage, PersonaStyle, PersonaTone } from '@/enum/persona'

const user_id = 1

export default function EditPersona() {
  const { authAxios } = useAuth()
  const navigate = useNavigate()
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  // const { mockPersonasData, setMockPersonasData, deleteMockPersonaData } =
  //   useMockDataStore()
  const { personaId } = useParams()
  // const [persona, setPersona] = useState(
  //   mockPersonasData.find((persona) => persona.id == personaId)!
  // )
  const [persona, setPersona] = useState<PersonaData>({
    id: 1,
    avatar: '',
    name: '',
    description: '',
    tone: PersonaTone.Empathetic,
    language: PersonaLanguage.Formal,
    style: PersonaStyle.Direct,
    messageColor: '#EBEBEB'
  })

  const { data: personaRes } = useQuery({
    queryKey: ['getOnePersona', personaId],
    queryFn: () => {
      return getOnePersona(authAxios!)({ persona_id: Number(personaId) })
    },
    enabled: !!authAxios
  })

  useEffect(() => {
    if (personaRes)
      setPersona({
        id: personaRes.data.persona_id,
        avatar: '🌳',
        name: personaRes.data.persona_name,
        description: personaRes.data.persona_description,
        tone: personaRes.data.tone,
        language: personaRes.data.lang,
        style: personaRes.data.style,
        messageColor: '#EBEBEB'
      })
  }, [personaRes])

  const queryClient = useQueryClient()

  const updatePersonaMutation = useMutation({
    mutationFn: () => {
      return updatePersona(authAxios!)({
        persona_id: Number(personaId),
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
      navigate('/')
    }
  })

  const deletePersonaMutation = useMutation({
    mutationFn: () => {
      return deletePersona(authAxios!)({
        persona_id: Number(personaId)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMePersonas'] })
      navigate('/')
    }
  })

  // const handleSave = () => {
  //   setMockPersonasData(
  //     mockPersonasData.map((item) => (item.id === persona.id ? persona : item))
  //   )
  //   navigate('/')
  // }

  // const handleDelete = () => {
  //   deleteMockPersonaData(persona.id)
  //   navigate('/')
  // }

  const handleSave = () => {
    updatePersonaMutation.mutate()
  }

  const handleDelete = () => {
    deletePersonaMutation.mutate()
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
              navigate('/')
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
                    navigate('/')
                  }}
                >
                  <FaArrowLeft />
                </button>
              </div>
              <div className="flex size-8 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-lg">
                {persona.avatar}
              </div>
              <h3 className="text-base text-[#4c4c4c] sm:text-2xl">
                {persona.name}
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
                          disabled={persona.isPreset}
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
                        disabled={persona.isPreset}
                        placeholder="Enter the description of this persona"
                        rows={3}
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
                  <div className="mt-10 flex justify-end space-x-4">
                    {!persona.isPreset && (
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
                                disabled={deletePersonaMutation.isPending}
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
                      disabled={updatePersonaMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="w-[120px]"
                      onClick={handleSave}
                      isLoading={updatePersonaMutation.isPending}
                    >
                      Save
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
