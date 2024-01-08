'use client'

import { ChangeEventHandler, useState } from "react"

export default function ScanPage() {

  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleSelectImageFile = () => {
    document.getElementById('input-image')?.click()
  }

  const handleChangeImageFile: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      setImageFile(e.target.files[0])
    }
  }

  return (
    <main className='max-w-[1200px] mx-auto'>
      <section>
        <div className='flex items-center justify-between border-2 p-2 border-indigo-400 rounded-md'>
          {
            imageFile ? (
              <p className='text-indigo-400 font-medium text-sm'>
                {imageFile.name}
              </p>
            ) :
              (
                <p className='text-gray-500 font-medium text-sm'>
                  No Hay Ninguna Foto Seleccionada
                </p>
              )
          }
          <button onClick={handleSelectImageFile} className='px-2 py-1 text-white font-medium bg-indigo-400 hover:bg-indigo-500 rounded-md transition'>Seleccionar Foto</button>
          <input id='input-image' type='file' accept='image/*' onChange={handleChangeImageFile} hidden />
        </div>
      </section>
    </main>
  )
}