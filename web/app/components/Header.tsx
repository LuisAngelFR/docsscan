import Link from "next/link";

export default function Header() {
  return (
    <div className='flex max-w-[1200px] mx-auto justify-between items-center p-4'>
      <Link href='/' className='font-jua uppercase'>docsscan</Link>
    </div>
  )
}