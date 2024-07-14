import Chip from '@/components/Chip'
import InputColor from '@/components/InputColor'
import { Button } from '@/components/ui/button'
import {
  personaLanguageOptions,
  personaStyleOptions,
  personaToneOptions
} from '@/data/persona'
import { useMockDataStore } from '@/store/useMockDataStore'
import { useState } from 'react'
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

export default function EditPersona() {
  const navigate = useNavigate()
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const { mockPersonasData, setMockPersonasData, deleteMockPersonaData } =
    useMockDataStore()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { personaId } = useParams()
  const [persona, setPersona] = useState(
    mockPersonasData.find((persona) => persona.id == personaId)!
  )

  const handleSave = () => {
    setMockPersonasData(
      mockPersonasData.map((item) => (item.id === persona.id ? persona : item))
    )
    navigate('/')
  }

  const handleDelete = () => {
    deleteMockPersonaData(persona.id)
    navigate('/')
  }

  if (!persona) {
    return <div>Error</div>
  }

  return (
    <div className="flex h-[calc(100vh-56px)] px-16 pb-16 pt-6">
      <div
        className="box-border flex flex-1 justify-center overflow-hidden rounded-[20px] bg-[#f7f7f7] py-10"
        style={{ boxShadow: '0px 8px 40px 0 rgba(65,76,65,0.16)' }}
      >
        <div className="w-28">
          <button
            className="flex size-10 items-center justify-center rounded-full border border-[#EBEBEB]"
            onClick={() => {
              navigate('/')
            }}
          >
            <FaArrowLeft />
          </button>
        </div>
        <div className="flex overflow-auto">
          <div className="w-full max-w-xl">
            <div className="flex items-center justify-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-lg">
                {persona.avatar}
              </div>
              <h3 className="text-2xl text-[#4c4c4c]">{persona.name}</h3>
            </div>
            <div className="mt-8">
              <div className="space-y-8">
                <div className="space-y-1">
                  <p className="text-base text-[#4c4c4c]">
                    Persona Icon &amp; Name
                  </p>
                  <div className="flex space-x-1">
                    <div className="relative flex size-[46px] shrink-0 items-center justify-center rounded-lg border border-[#ebebeb] bg-white">
                      <button
                        className=" text-2xl"
                        onClick={() => {
                          setEmojiPickerOpen(true)
                        }}
                      >
                        {persona.avatar}
                      </button>
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
                    </div>
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
                  <div className="space-x-2">
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
                  <div className="space-x-2">
                    {personaLanguageOptions.map((option) => (
                      <Chip
                        key={option.value}
                        label={option.label}
                        selected={persona.language === option.value}
                        disabled={
                          persona.isPreset && persona.language !== option.value
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
                  <div className="space-x-2">
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
                  <p className="text-base text-[#4c4c4c]">User Message Color</p>
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
                <Button className=" w-[120px]" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </div>
          </div>
          <div className="w-28"></div>
        </div>
      </div>
    </div>
  )
}
