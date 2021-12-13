import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { supabase } from '../supabaseClient'
import Header from './Header'
import Sidebar from './Sidebar'
import getBase64 from '../utils/getBase64'
import { loginUser as loginUserAction } from '../store/action'
import { useDispatch } from 'react-redux'

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
}

const img = {
  display: 'block',
  width: 'auto',
  height: '100%',
}

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loginUser = useSelector((state) => (state as any).loginUser)
  const isCheckingLogin = useSelector((state) => (state as any).isCheckingLogin)
  const [imageFiles, setImageFiles] = useState<any[]>([])
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        getBase64(file, async (result: any) => {
          const res = await fetch(result)
          const blob = await res.blob()
          setImageFiles((prev) => [...prev, { ...file, preview: result, blob }])
        })
      })
    },
  })
  const [userPhotos, setUserPhotos] = useState<Blob[] | any[]>([])
  const [uploading, setUploading] = useState(false)

  const uploadPhotosOnSupabase = async (blob: Blob) => {
    const fileName = `${loginUser.id}-profile-${uuidv4().split('-')[0]}.jpg`
    await supabase.storage.from('user-upload').upload(fileName, blob)
    return fileName
  }

  const savePhotos = async () => {
    setUploading(true)

    if (imageFiles.length === 0) {
      setUploading(false)
      return
    }

    const fileNames = await Promise.all(
      imageFiles.map((file) => {
        return uploadPhotosOnSupabase(file.blob)
      }),
    )

    let photos = [...fileNames]
    if (loginUser.photos && loginUser.photos.length > 0) {
      photos = [...loginUser.photos, ...fileNames]
    }

    const { data, error } = await supabase
      .from('users')
      .update({ photos })
      .match({ id: loginUser.id })
      .single()

    dispatch(loginUserAction(data))

    setImageFiles([])

    setUploading(false)
  }

  const thumbs = imageFiles.map((file) => (
    <div style={thumbInner} className="w-[200px]" key={file.path}>
      <img src={file.preview} style={img} alt="" className="rounded" />
    </div>
  ))

  useEffect(() => {
    if (isCheckingLogin === false && Object.keys(loginUser).length === 0) navigate('/login')
  }, [loginUser, isCheckingLogin, navigate])

  useEffect(() => {
    const fetchPhotos = async () => {
      setUserPhotos([])

      for (const p of loginUser.photos) {
        const { data, error } = await supabase.storage.from('user-upload').download(p)

        if (!error)
          setUserPhotos((prev) => {
            const url = URL.createObjectURL(data as Blob)
            return [...prev, url]
          })
      }
    }

    if (loginUser.photos && loginUser.photos.length > 0) fetchPhotos()
  }, [loginUser])

  if (isCheckingLogin) return <div className="flex items-center justify-center h-screen">Loading...</div>

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-12">
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
        </div>
      </div>
    </div>
  )
}

export default Profile
