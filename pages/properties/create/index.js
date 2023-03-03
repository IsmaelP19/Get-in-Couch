import { useState, useEffect } from 'react'
import PropertyForm from '../../../components/PropertyForm'
import propertiesService from '../../../services/properties'
import Notification from '../../../components/Notification'
import { showMessage } from '../../../utils/utils'
import userService from '../../../services/users'

export default function CreateProperty () {
  const [message, setMessage] = useState([])
  const [user, setUser] = useState({})

  async function getUser () {
    const loggedUser = localStorage.getItem('loggedUser')
    if (loggedUser) {
      const username = JSON.parse(loggedUser).username
      const user = await userService.getUser(username)
      setUser(user)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  const createProperty = (propertyObject) => {
    propertyObject.owner = user.id

    propertiesService.create(propertyObject)
      .then(response => {
        showMessage('Se ha creado correctamente el anuncio de la propiedad 😎', 'success', setMessage, 4000)
        setTimeout(() => {
          location.replace(`/properties/${response.id}`)
        }, 4000)
      })
      .catch(error => {
        if (error.request.response.includes('E11000 duplicate key error collection: production.properties index: location.street_1_location.city_1_location.country_1_location.zipCode_1 dup key: ')) {
          showMessage('Ya existe un anuncio con esa dirección. Comprueba que has introducido el número del domicilio correctamente.', 'info', setMessage, 4000)
        } else {
          showMessage('Ha ocurrido un error al crear el anuncio. Por favor, inténtalo de nuevo.', 'error', setMessage, 4000)
        }
      })
  }

  return (
    <>
      <div className='flex flex-col justify-center w-full'>
        <Notification message={message[0]} type={message[1]} />
        <PropertyForm createProperty={createProperty} />
      </div>
    </>
  )
}

CreateProperty.getInitialProps = async (context) => {
  return { title: 'Nuevo anuncio' }
}
