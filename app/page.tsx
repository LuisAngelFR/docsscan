import Link from "next/link";
import FeatureCard from "./components/FeatureCard";

export default function Home() {
  return (
    <main className='flex flex-col items-center max-w-[1200px] mx-auto p-4'>
      <section className='flex flex-col pt-44 pb-24 items-center'>
        <h1 className='text-7xl uppercase font-bold font-jua'>docsscan</h1>
        <p className='font-medium text-gray-700'>Digitaliza Documentos Fácilmente</p>
      </section>
      <section className='w-full flex gap-4'>
        <FeatureCard title="Escanear Documento" description="Transforma una Imagen a un documento PDF" href="/scan" />
      </section>
    </main>
  )
}
