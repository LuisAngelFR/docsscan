import Link from 'next/link';
import { FileTextIcon } from './icons';

interface FeatureCardProps {
  title: string,
  description: string,
  href: string
}

export default function FeatureCard({ title, description, href }: FeatureCardProps) {
  return (
    <section className='flex flex-col items-center border-2 border-indigo-100 w-[95%] max-w-[400px] mx-auto rounded-md p-4'>
      <FileTextIcon className='size-12 stroke-1'/>
      <h3 className='text-xl font-medium font-jua'>{title}</h3>
      <p>{description}</p>
      <Link href={href} className='text-base border-2 border-indigo-200 w-1/2 text-center mt-2 py-1 px-2 rounded-xl font-semibold text-indigo-500 hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition'>
        Probar
      </Link>
    </section>
  )
}