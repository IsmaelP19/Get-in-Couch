import { useAppContext } from '../context/state'
export default function Hamburger () {
  const { isOpen, setOpenDrawer } = useAppContext()
  return (
    <button type='button' onClick={() => { setOpenDrawer(!isOpen) }} className='text-3xl absolute top-[18px] right-6 cursor-pointer md:hidden ' title='signup-btn'>
      <div className='transition-opacity w-6 h-6 text-gray-100'>
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className={!isOpen ? 'opacity-100' : 'hidden'}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
        </svg>
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className={isOpen ? 'opacity-100' : 'hidden'}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
        </svg>
      </div>
    </button>
  )
}
