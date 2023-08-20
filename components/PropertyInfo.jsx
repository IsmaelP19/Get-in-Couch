import { useState, useEffect } from 'react'
import { useAppContext } from '../context/state'
import Link from 'next/link'
import Tag from './Tag'
import UserTag from './UserTag'
import usersService from '../services/users'
import propertiesService from '../services/properties'
import { AiOutlineEdit, AiOutlineCheckCircle } from 'react-icons/ai'
import { LiaBedSolid, LiaUserEditSolid } from 'react-icons/lia'
import { TfiAnnouncement } from 'react-icons/tfi'
import { IoBookmark } from 'react-icons/io5'

export default function PropertyInfo ({ property }) {
  const { user, setUser, done } = useAppContext()
  const [isOwner, setIsOwner] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [tenants, setTenants] = useState([])

  useEffect(() => {
    if (done && user) {
      setIsSaved(user.favorites.includes(property.id))
      setIsOwner(user?.properties.includes(property.id))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, user])

  useEffect(() => {
    const fetchTenants = async () => {
      const tenants = await propertiesService.getTenants(property.id, user.id)
      setTenants(tenants)
    }
    if (isOwner) {
      fetchTenants()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner, property])

  const date = property?.lastEdited
    ? new Date(property.lastEdited).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
    : property?.publishDate

  const handleSave = async () => {
    await usersService.updateSavedProperties(user.username, property.id)
    if (isSaved) {
      setUser({ ...user, favorites: user.favorites.filter(p => p !== property.id) })
    } else {
      setUser({ ...user, favorites: [...user.favorites, property.id] })
    }
  }

  return (
    <div className='w-full md:w-3/6 xl:w-3/4 flex flex-col gap-4 p-7 bg-blue-100 rounded-3xl border-2 border-black'>
      <div className='flex flex-row items-center'>
        <h2 className='font-bold text-2xl text-center w-full break-words whitespace-pre-wrap '>{property.title}</h2>
        <IoBookmark className={`text-3xl cursor-pointer duration-150 transition-colors ease-in-out ${isSaved ? 'text-green-600 hover:text-black' : 'text-black hover:text-green-600'}`} onClick={handleSave} />
      </div>

      <p className='text-xl'>{property.description}</p>

      <span className='text-xl font-bold w-full pt-4'>
        <AiOutlineCheckCircle className='inline-block mr-2 mb-1' />
        Características:
      </span>
      <div className='flex flex-row flex-wrap  gap-6 '>
        <Tag text={property.features.propertyType} />
        <Tag text={property.features.propertySize + ' m2'} />
        <Tag text={property.features.numberOfBedrooms + ' habitaciones'} />
        <Tag text={property.features.numberOfBathrooms + ' baños'} />
        <Tag text={property.features.parking} />

        {property.features.airConditioning && <Tag text='Aire acondicionado' />}
        {property.features.heating && <Tag text='Calefacción' />}
        <Tag text={property.features.furniture} />

        {property.features.garden && <Tag text='Jardín' />}
        {property.features.petsAllowed && <Tag text='Se admiten mascotas' />}
        {property.features.smokingAllowed && <Tag text='Se permite fumar' />}

      </div>

      <div className='flex flex-col'>
        <span className='text-xl font-bold w-full pt-4 justify-center'>
          <TfiAnnouncement className='inline-block mr-2 mb-1' />
          Anuncio publicado por <Link href={'/profile/' + property.owner?.username} className='hover:underline hover:text-blue-600'>{property.owner?.name} {property.owner?.surname}</Link>
        </span>
        {isOwner && (
          <div className='flex flex-row flex-wrap items-center gap-2 pt-4'>

            <span className='text-xl  font-bold  justify-center'>
              <LiaBedSolid className='inline-block mr-2 mb-1' />
              Inquilinos:
            </span>
            {tenants.length > 0
              ? (
                <>
                  {tenants.map(t => <UserTag user={t} key={t.id} link />)}
                </>
                )
              : (
                <span className='text-xl'>No hay inquilinos</span>
                )}
            <Link
              href={'/properties/' + property.id + '/tenants'} className='flex  items-center gap-2 rounded-full px-2 py-1 border-slate-700 max-w-fit bg-blue-200 ease-in-out duration-150 transition-all hover:bg-yellow-500 self-center text-black hover:text-black border-2 justify-center font-bold'
            >
              <LiaUserEditSolid className='' />
              Modificar inquilinos
            </Link>

          </div>
        )}

        <span className='text-xl font-bold w-full pt-4'>
          <AiOutlineEdit className='inline-block mr-2 mb-1' />
          Fecha de última edición: {date}
        </span>
      </div>

    </div>
  )
}
