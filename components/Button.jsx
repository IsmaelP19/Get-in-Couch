import Link from 'next/link'

export default function Button ({ name, link, style }) {
  return (
    <button type='button' className={`${style} py-2 px-6 rounded-full duration-200 border-2 border-gray-200`}>
      <Link href={link} className='font-bold'> {name} </Link>
    </button>

  )
}
