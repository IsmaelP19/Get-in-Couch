import Link from 'next/link'
export default function Column ({ header, links, handleClick }) {
  return (
    <div className='flex flex-col justify-center md:items-start items-center md:my-0 my-5'>
      <span className='text-lg font-bold uppercase'>
        {header}
      </span>
      <ul className='flex flex-col md:items-start items-center'>
        {links.map((link) => (
          <li key={link.id} className='text-base cursor-pointer md:my-0 my-3'>
            <Link
              href={link.link} className='text-gray-400 hover:text-[#0099ff] duration-100 hover:underline'
            >{link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
