import { useEffect, Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { supabase } from '../supabaseClient'
import Header from './Header'
import Sidebar from './Sidebar'
import getBase64 from '../utils/getBase64'
import { loginUser, loginUser as loginUserAction } from '../store/action'
import { useDispatch } from 'react-redux'
import { Listbox, Transition } from '@headlessui/react'
import { HiSelector, HiCheck } from 'react-icons/hi'

const languagesList = [
  {
    value: 'javascript',
    name: 'JavaScript',
    color: 'green',
  },
  {
    value: 'typescript',
    name: 'TypeScript',
    color: 'emerald',
  },
  {
    value: 'react',
    name: 'React',
    color: 'blue',
  },
  {
    value: 'ruby',
    name: 'Ruby',
    color: 'rose',
  },
]

interface Language {
  name: string
  value: string
}

const Profile = () => {
  // const dispatch = useDispatch()
  const navigate = useNavigate()
  const loginUser = useSelector((state) => (state as any).loginUser)
  const isCheckingLogin = useSelector((state) => (state as any).isCheckingLogin)

  const [saving, setSaving] = useState(false)
  const [bio, setBio] = useState(loginUser.bio || '')

  const [selected, setSelected] = useState<string[]>(loginUser.languages || [])

  useEffect(() => {
    setBio(loginUser.bio || '')
  }, [loginUser.bio])

  useEffect(() => {
    setSelected(loginUser.languages || [])
  }, [loginUser.languages])

  // const [imageFiles, setImageFiles] = useState<any[]>([])
  // const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
  //   accept: 'image/*',
  //   onDrop: (acceptedFiles) => {
  //     acceptedFiles.forEach((file) => {
  //       getBase64(file, async (result: any) => {
  //         const res = await fetch(result)
  //         const blob = await res.blob()
  //         setImageFiles((prev) => [...prev, { ...file, preview: result, blob }])
  //       })
  //     })
  //   },
  // })
  // const [userPhotos, setUserPhotos] = useState<Blob[] | any[]>([])
  // const [uploading, setUploading] = useState(false)

  // const uploadPhotosOnSupabase = async (blob: Blob) => {
  //   const fileName = `${loginUser.id}-profile-${uuidv4().split('-')[0]}.jpg`
  //   await supabase.storage.from('user-upload').upload(fileName, blob)
  //   return fileName
  // }

  // const savePhotos = async () => {
  //   setUploading(true)

  //   if (imageFiles.length === 0) {
  //     setUploading(false)
  //     return
  //   }

  //   const fileNames = await Promise.all(
  //     imageFiles.map((file) => {
  //       return uploadPhotosOnSupabase(file.blob)
  //     }),
  //   )

  //   let photos = [...fileNames]
  //   if (loginUser.photos && loginUser.photos.length > 0) {
  //     photos = [...loginUser.photos, ...fileNames]
  //   }

  //   const { data, error } = await supabase
  //     .from('users')
  //     .update({ photos })
  //     .match({ id: loginUser.id })
  //     .single()

  //   dispatch(loginUserAction(data))

  //   setImageFiles([])

  //   setUploading(false)
  // }

  // const thumbs = imageFiles.map((file) => (
  //   <div style={thumbInner} className="w-[200px]" key={file.path}>
  //     <img src={file.preview} style={img} alt="" className="rounded" />
  //   </div>
  // ))

  useEffect(() => {
    if (isCheckingLogin === false && Object.keys(loginUser).length === 0) navigate('/login')
  }, [loginUser, isCheckingLogin, navigate])

  // useEffect(() => {
  //   const fetchPhotos = async () => {
  //     setUserPhotos([])

  //     for (const p of loginUser.photos) {
  //       const { data, error } = await supabase.storage.from('user-upload').download(p)

  //       if (!error)
  //         setUserPhotos((prev) => {
  //           const url = URL.createObjectURL(data as Blob)
  //           return [...prev, url]
  //         })
  //     }
  //   }

  //   if (loginUser.photos && loginUser.photos.length > 0) fetchPhotos()
  // }, [loginUser])

  if (isCheckingLogin) return <div className="flex items-center justify-center h-screen">Loading...</div>

  const saveProfile = async () => {
    setSaving(true)

    await supabase
      .from('users')
      .update({
        bio,
        languages: selected,
      })
      .eq('id', loginUser.id)

    setSaving(false)
  }

  return (
    <div className="flex h-screen">
      <Sidebar isSettingPage={true} />
      <div className="flex-1">
        <Header />
        <div className="p-8">
          <div className="px-4 py-5 space-y-6 bg-white sm:p-6">
            <div className="">
              <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <div className="p-2 border rounded-md shadow-sm cursor-not-allowed bg-slate-100 border-slate-300">
                  {loginUser.username}
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <div className="mt-1">
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  className="block w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400 sm:text-sm"
                  placeholder="I know nothing about programming."
                  defaultValue={bio}
                  onChange={(e) => {
                    setBio(e.target.value)
                  }}
                />
              </div>
            </div>

            <div className="flex space-x-3">
              {selected.map((language) => {
                const languageInfo = languagesList.find((l) => l.value === language)
                const { color } = languageInfo as any

                return (
                  <div
                    key={language}
                    className={`inline-block px-3 py-1 text-sm font-semibold text-${color}-500 bg-${color}-100 rounded-full`}
                  >
                    {language}
                  </div>
                )
              })}
            </div>

            <Listbox
              value={selected}
              onChange={(e: unknown) => {
                const selectedItem = e as Language

                const isDuplicated = selected.indexOf(selectedItem.value) !== -1

                const selectedClone = [...selected]

                if (isDuplicated) {
                  const filtered = selectedClone.filter((s) => s !== selectedItem.value)

                  setSelected(filtered)
                  return
                }

                selectedClone.push(selectedItem.value)
                setSelected(selectedClone)
              }}
            >
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                  <span className="block truncate">Choose</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <HiSelector className="w-5 h-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {languagesList.map((language) => (
                      <Listbox.Option
                        key={language.value}
                        className={({ active }) =>
                          `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
                          cursor-default select-none relative py-2 pl-10 pr-4`
                        }
                        value={language}
                      >
                        {({ active }) => (
                          <>
                            <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                              {language.name}
                            </span>
                            {selected.includes(language.value) ? (
                              <span
                                className={`${active ? 'text-amber-600' : 'text-amber-600'}
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                              >
                                <HiCheck className="w-5 h-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            {saving ? (
              <div className="inline-block px-4 py-2 font-bold text-white bg-green-500 rounded-full">
                Saving...
              </div>
            ) : (
              <button
                type="submit"
                className="inline-block px-4 py-2 font-bold text-white bg-green-500 rounded-full"
                onClick={(e) => {
                  e.preventDefault()
                  saveProfile()
                }}
              >
                Save
              </button>
            )}
          </div>
        </div>

        {/* <div className="p-12">
          <div className="text-lg font-semibold">Pictures</div>
          <div className="flex flex-wrap mt-3 space-x-4 rounded">
            {userPhotos.map((p, index) => {
              return (
                <div className="w-[200px]">
                  <img src={p} alt="" key={index} className="rounded" />
                </div>
              )
            })}
          </div>
          <div
            {...getRootProps({ className: 'dropzone' })}
            className="py-10 mt-4 border border-gray-300 rounded-md cursor-pointer"
          >
            <input {...getInputProps()} />
            <p className="p-3 text-center">Drag 'n' drop photos here</p>
          </div>
          <div className="flex flex-wrap mt-4 space-x-4">{thumbs}</div>
          {uploading ? (
            <button className="px-4 py-2 mt-3 font-semibold text-white bg-green-300 border border-green-500 rounded-md shadow cursor-wait">
              Uploading...
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault()
                savePhotos()
              }}
              className="px-4 py-2 mt-3 font-semibold text-white bg-green-500 border border-green-600 rounded-md shadow hover:bg-green-600"
            >
              Save photos
            </button>
          )}
        </div> */}
      </div>
    </div>
  )
}

export default Profile
