export default function ProfileButton ({ handleClick, children, style }) {
  return (
    <button className={`${style} flex flex-row items-center justify-center gap-3 py-2 px-4 my-2 rounded-3xl border border-slate-600 transition-colors duration-200 ease-in-out `} onClick={handleClick}>
      {children}
    </button>
  )
}
