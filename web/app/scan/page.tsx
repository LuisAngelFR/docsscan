'use client'

import { ChangeEventHandler, useState } from 'react'
import { toast } from 'sonner'

export default function ScanPage() {

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [pdfFile, setPdfFile] = useState<Blob | null>(null)
  const [filename, setFilename] = useState<string | null>(null)

  const handleSelectImageFile = () => {
    document.getElementById('input-image')?.click()
  }

  const handleChangeImageFile: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) {
      return
    }

    const file = e.target.files[0]

    setImageFile(file)

    const scanPromise = new Promise((resolve, reject) => {

      const formData = new FormData()

      formData.append('img', file)

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/scan-doc`, {
        method: 'POST',
        body: formData
      }).then(res => {
        if (res.ok) {
          return res.json()
        }
      }).then(data => {
        if (data.preview && data.pdf && data.filename) {
          setPreview(`data:image/jpg;base64,${data.preview}`)
          setFilename(data.filename)

          const byteCharacters = atob(data.pdf)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const blob = new Blob([byteArray], { type: 'application/pdf' })
          setPdfFile(blob)
        }

        resolve('')
      }).catch(e => {
        console.error(e)
        reject('')
      })
    })

    toast.promise(scanPromise, {
      'loading': 'Procesando documento...',
      'error': 'La imagen no es válida',
      'success': 'Documento Escaneado Correctamente'
    })
  }

  const handleDownloadPdf = () => {
    if (!pdfFile) {
      return
    }
    const link = document.createElement('a')
    link.href = URL.createObjectURL(pdfFile)
    link.download = `${filename}.pdf`
    link.click()
    URL.revokeObjectURL(link.href)

    toast.message('Descargando PDF')
  }

  return (
    <main className='w-[90%] max-w-[1200px] mx-auto'>
      <section>
        <div className='flex items-center justify-between border-2 p-2 border-indigo-400 rounded-md'>
          {
            imageFile ? (
              <p className='text-indigo-400 font-medium text-sm'>
                {imageFile.name}
              </p>
            ) :
              (
                <p className='text-gray-500 font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis'>
                  No Hay Ninguna Foto Seleccionada
                </p>
              )
          }
          <button onClick={handleSelectImageFile} className='whitespace-nowrap px-2 py-1 text-white font-medium bg-indigo-400 hover:bg-indigo-500 rounded-md transition'>Seleccionar Foto</button>
          <input id='input-image' type='file' accept='image/*' onChange={handleChangeImageFile} hidden />
        </div>
      </section>
      <section className='flex flex-col items-center pt-6'>
        <div onClick={handleSelectImageFile} className='flex justify-center items-center border-2 border-indigo-200 w-[95%] max-w-[500px] aspect-[210/279] rounded-md bg-indigo-200/20 cursor-pointer'>
          {
            preview ? (
              <img src={preview} alt='' className='rounded-md w-full h-full object-contain'></img>
            ) : (
              <p className='text-indigo-300 font-semibold'>
                No hay una vista previa aun
              </p>
            )
          }
        </div>
        <button onClick={handleDownloadPdf} className={`mt-4 border-2 py-1 px-2 rounded-md border-indigo-200 font-semibold ${preview ? 'border-indigo-400 bg-indigo-400 text-white hover:bg-indigo-500 hover:border-indigo-600' : 'text-indigo-300'} transition`} disabled={!preview}>Descargar PDF</button>
      </section>
    </main>
  )
}