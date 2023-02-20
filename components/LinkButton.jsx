import Link from 'next/link'

export default function LinkButton ({ name, link, style, setOpenDrawer, isOpen }) {
  const handleClick = () => {
    setOpenDrawer(!isOpen)
  }
  return (
    <Link href={link} className={`${style} py-2 px-6 rounded-full duration-200 border-2 border-gray-200 font-bold`} onClick={handleClick}> {name} </Link>

  )
}
