import Image from 'next/image'

export default function ProfilePhoto ({ src, alt, username, width, height, isComment }) {
  return (

    <div className={`flex ${isComment ? 'flex-row hover:underline hover:text-blue-700 ' : 'flex-col'} items-center justify-center gap-3`}>
      <Image src={src} alt={alt} width={width} height={height} priority />
      <span className='font-bold  '>
        @{username}
      </span>
    </div>

  )
}
