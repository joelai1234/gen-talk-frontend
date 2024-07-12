import Chip from '@/components/Chip'
import ImageWithFallback from '@/components/ImageWithFallback'
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

export default function EditPersona() {
  const navigate = useNavigate()
  const { mockPersonasData, setMockPersonasData } = useMockDataStore()

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
              <div className="flex size-8 items-center justify-center rounded-full border border-[#EBEBEB] bg-white">
                <ImageWithFallback
                  className="size-[16px] object-contain"
                  src={persona.avatar}
                  fallbackSrc={mockPersonasData[0].avatar}
                  alt={persona.name}
                />
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
                    <div className="flex size-[46px] shrink-0 items-center justify-center rounded-lg border border-[#ebebeb] bg-white">
                      <ImageWithFallback
                        className="size-6 object-contain"
                        src={persona.avatar}
                        fallbackSrc={mockPersonasData[0].avatar}
                        alt={persona.name}
                      />
                    </div>
                    <input
                      className="w-full rounded-lg border border-[#ebebeb] bg-[#ebebeb] px-3 py-2 text-base"
                      type="text"
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
                    className="w-full rounded-lg border border-[#ebebeb] bg-[#ebebeb] px-3 py-2 text-base outline-none"
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
              <div className=" mt-10 flex justify-end space-x-4">
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
