export default function Tag ({ text, style }) {
  return (
    <div className='text-xl self-start '>
      <span className={`rounded-full border border-slate-600 px-4 p-1 ${style}`}>{text}</span>
    </div>
  )
}
