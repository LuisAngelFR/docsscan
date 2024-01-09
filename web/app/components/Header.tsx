import Link from "next/link";
import { GitHubIcon } from "./icons";

export default function Header() {
  return (
    <div className='flex max-w-[1200px] mx-auto justify-between items-center p-4'>
      <Link href='/' className='font-jua uppercase text-xl'>docsscan</Link>

      <nav>
        <Link href='https://github.com/LuisAngelFR/docsscan/' target='_blank' rel='noopener noreferrer' className='flex items-center gap-2 font-semibold'>
          <GitHubIcon className='size-6' />
          GitHub
        </Link>
      </nav>
    </div>
  )
}