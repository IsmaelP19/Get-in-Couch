import UsersSearch from '../components/UserSearch'

export default function Users () {
  return (
    <UsersSearch />
  )
}

export async function getServerSideProps () {
  return {
    props: {
      title: 'Buscar usuarios'
    }
  }
}
