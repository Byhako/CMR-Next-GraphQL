import Layaut from '../components/Layaut';
import { useQuery, gql} from '@apollo/client';

const OBTENER_CLIENTES = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
    }
  }
`;

export default function Index() {
  const { data, loading, error } = useQuery(OBTENER_CLIENTES);

  if (loading) {
    return (
      <div className='flex justify-center w-full'>
        <div className="loader">Loading...</div>
      </div>
    )
  }

  console.log('data', data)
 
  return (
    <div>
      <Layaut>
        <h1 className='text-lg text-gray-800 font-light'>Clientes</h1>

        <table className='table-auto shadow-md mt-10 w-full w-lg'>
          <thead className='bg-gray-800'>
            <tr className='text-white'>
              <th className='w-1/5 py-2'>Nombre</th>
              <th className='w-1/5 py-2'>Empresa</th>
              <th className='w-1/5 py-2'>E-mail</th>
            </tr>
          </thead>

          <tbody className='bg-white'>
            {data && data.obtenerClientesVendedor.map(cliente => (
              <tr key={cliente.id}>
                <td className='border px-4 py-2'>{cliente.nombre} {cliente.apellido}</td>
                <td className='border px-4 py-2'>{cliente.empresa}</td>
                <td className='border px-4 py-2'>{cliente.email}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </Layaut>
    </div>
  )
}
