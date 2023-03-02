import PropertyCard from '../../components/PropertyCard'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import userService from '../../services/users'

export default function Catalogue ({ properties }) {
  const [user, setUser] = useState(null)

  // if the logged user is an owner, a button to create a property will be shown
  async function getUser () {
    const loggedUser = localStorage.getItem('loggedUser')
    if (loggedUser) {
      const loggedUsername = JSON.parse(loggedUser).username
      const loggedUserObject = await userService.getUser(loggedUsername)
      setUser(loggedUserObject)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <div className='w-full flex flex-col'>
      <h1 className='p-10 font-bold text-3xl text-center'>Inmuebles</h1>

      {user && user.isOwner && (
        <div className='w-full flex items-center justify-center'>
          <Link href='/properties/create'>
            <button className='bg-green-400  hover:bg-green-800 hover:text-white transition-all text-black font-bold py-2 px-4 rounded-lg'>
              Crear nuevo anuncio
            </button>
          </Link>
        </div>
      )}

      <div className='flex items-center justify-center row gap-40 m-10 flex-wrap'>
        {properties.map(property => (
          <Link href={`/properties/${property.id}`} key={property.id}>
            <PropertyCard key={property.id} property={property} />
          </Link>
        ))}

      </div>

    </div>
  )
}

// maybe getting the properties from serverside props it's better than using useEffect
export async function getServerSideProps (context) {
  const page = context.query.page || 1
  const url = `${process.env.API_URL}/properties/?page=${page}`
  const response = await fetch(url)

  // if the response status is 404, redirect to 404 page
  if (response.status === 404) {
    return {
      notFound: true
    }
  }

  const properties = await response.json()

  return {
    props: {
      properties,
      title: 'Catálogo'
    }
  }
}