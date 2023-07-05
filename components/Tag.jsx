import { LuVerified } from 'react-icons/lu'

export default function Tag ({ text, style, verified }) {
  return (
    <div className='text-xl'>

      <span className={`rounded-full border border-slate-600 px-4 p-1 ${style}`}>
        {verified && <LuVerified className='inline-block mr-2 mb-1' />}
        {text}
      </span>
    </div>
  )
}
