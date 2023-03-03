import LinkButton from './LinkButton'

export default function InfoCard ({ title, description, buttonName, buttonLink, buttonStyle }) {
  return (
    <div className='flex flex-col bg-slate-800 w-10/12 md:w-5/12 lg:w-[420px] items-center justify-center rounded-3xl bg-opacity-90 border-solid border-x-2 border-y-2 border-black px-0 md:px-10 py-5'>
      <h1 className='text-white md:text-3xl text-2xl font-bold text-center'>
        {title}
      </h1>

      <p className='text-gray-200 text-xl p-3 text-center'>
        {description}
      </p>
      <LinkButton name={buttonName} link={buttonLink} style={buttonStyle} />
    </div>
  )
}
