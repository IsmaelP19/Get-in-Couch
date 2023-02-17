import Image from 'next/image'

export default function ProfilePhoto (props) {
  return (
    <Image src={props.src} alt={props.alt} width='100' height='100' />

  )
}
