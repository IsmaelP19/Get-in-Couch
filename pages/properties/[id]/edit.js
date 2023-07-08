import propertiesService from '../../../services/properties'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAppContext } from '../../../context/state'
import PropertyForm from '../../../components/PropertyForm'
import Notification from '../../../components/Notification'

export default function EditProperty ({ property }) {
  const { user, message, done } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (done && (!user?.isOwner || property.owner.id !== user?.id)) {
      router.push('/403')
    }
  }, [user, router, done, property])

  return (user?.isOwner && property.owner.id === user?.id) && (
    <>
      <div className='flex flex-col justify-center w-full'>
        <Notification message={message[0]} type={message[1]} />
        <PropertyForm property={property} />
      </div>
    </>
  )
}

export async function getServerSideProps (context) {
  const id = context.params.id

  const property = await propertiesService.getProperty(id)
  if (property.error) {
    context.res.writeHead(302, { Location: '/404' })
    context.res.end()
  }

  return {
    props: {
      property,
      title: 'Detalles del inmueble'
    }
  }
}
