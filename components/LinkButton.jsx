import Link from 'next/link'
import { useAppContext } from '../context/state'

export default function LinkButton ({ name, link, style, drawer }) {
  const { isOpen, setOpenDrawer } = useAppContext()

  const handleClick = () => {
    drawer &&
    isOpen &&
    setOpenDrawer(!isOpen)
  }
  return (
    <Link href={link} className={`${style} py-2 px-6 rounded-full duration-200 border-2 border-gray-200 font-bold`} onClick={handleClick}> {name} </Link>

  )
}
