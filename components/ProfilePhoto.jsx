import Image from 'next/image'

export default function ProfilePhoto ({ src, alt, username }) {
  return (

    <div className='flex flex-col items-center justify-center gap-3'>
      <Image src={src} alt={alt} width='100' height='100' priority />
      <span className='font-bold'>
        @{username}
      </span>
    </div>

  )
}
