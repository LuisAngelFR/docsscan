'use client'

import { extractPaper } from '@/utils/scan'
import { ChangeEventHandler, useState } from 'react'
import { toast } from 'sonner'

import { ImageOptions, jsPDF } from 'jspdf'

interface PreviewImage {
  src: string,
  width: number,
  height: number,
  element: HTMLCanvasElement
}

export default function ScanPage() {

  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [preview, setPreview] = useState<PreviewImage | null>(null)
  const [filename, setFilename] = useState<string | null>(null)

  const handleSelectImageFile = () => {
    document.getElementById('input-image')?.click()
  }

  const handleChangeImageFile: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) {
      return
    }

    const file = e.target.files[0]

    setFilename(file.name)

    const reader = new FileReader()

    toast.message('Procesando Imagen')

    reader.onload = (e) => {
      if (e.target?.result) {
        const image = new Image()
        const res = `${e.target.result}`
        setUploadedImage(res)

        image.src = res

        image.onload = function () {
          const imgPreview = document.createElement('img') as HTMLImageElement
          imgPreview.width = image.width
          imgPreview.height = image.height
          imgPreview.src = res

          const canvasRes = extractPaper(imgPreview)

          if (!canvasRes) {
            toast.error('Imagen no procesada correctamente')
            return
          }

          setPreview({
            src: canvasRes.toDataURL(),
            width: canvasRes.width,
            height: canvasRes.height,
            element: canvasRes
          })

          toast.message('Imagen Procesada Correctamente')
        }
      }
    }

    reader.readAsDataURL(file)
  }

  const handleDownloadPdf = () => {

    if (!uploadedImage || !preview) {
      return
    }

    const doc = new jsPDF(preview.width > preview.height ? 'l' : 'p', 'px', [preview.width, preview.height])

    const options: ImageOptions = {
      imageData: preview.src,
      format: 'PNG',
      x: 0,
      y: 0,
      width: preview.width,
      height: preview.height
    }

    doc.addImage(options)

    const out = doc.output()
    const pdfBase64 = 'data:application/pdf;base64,' + btoa(out)
    const link = document.createElement('a')
    link.href = pdfBase64
    link.download = `${filename}.pdf`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <main className='flex flex-col w-[90%] items-center max-w-[1200px] mx-auto'>
      <div className='flex w-full gap-4 justify-center p-4'>
        <section onClick={handleSelectImageFile} className='flex flex-1 items-center border-2 p-1 text-indigo-500 border-indigo-400 justify-center max-w-[500px] aspect-[210/279] rounded-md bg-indigo-200/20 cursor-pointer hover:bg-indigo-400 hover:text-white transition'>
          {
            uploadedImage ? (
              <img src={uploadedImage} alt='' className='rounded-md w-full object-contain'></img>
            ) : (
              <p className='font-medium text-center'>
                No Hay Ninguna Foto Seleccionada, da clic para seleccionar una imagen.
              </p>
            )
          }
          <input id='input-image' type='file' accept='image/*' onChange={handleChangeImageFile} hidden />
        </section>
        <section className='flex flex-1 items-center border-2 border-indigo-200 justify-center max-w-[500px]  rounded-md bg-indigo-200/10 aspect-[210/279]'>
          {
            preview ? (
              <img src={preview.src} alt='' className='rounded-md w-full object-contain'></img>
            ) : (
              <p className='text-indigo-300 font-medium text-sm'>
                Preview no Disponible
              </p>
            )
          }
        </section>
      </div>
      <button onClick={handleDownloadPdf} className={`w-1/2 mt-4 border-2 py-1 px-2 rounded-md border-indigo-200 font-semibold ${preview ? 'border-indigo-400 bg-indigo-400 text-white hover:bg-indigo-500 hover:border-indigo-500' : 'text-indigo-300'} transition`} disabled={!preview}>Descargar PDF</button>
    </main>
  )
}