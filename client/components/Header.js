import React from 'react';
import { useQuery, gql} from '@apollo/client';
import { useRouter } from 'next/router';

const OBTENER_USUARIO = gql`
  query obtenerUsuario {
    obtenerUsuario {
      id
      nombre
      apellido
    }
  }
`;

const Header = () => {
  const router = useRouter();
  const { data } = useQuery(OBTENER_USUARIO);
  let nombre = '';
  let apellido = '';

  if (!data) {
    router.push('/login');
  } else {
    nombre = data.obtenerUsuario ? data.obtenerUsuario.nombre : '';
    apellido = data.obtenerUsuario ? data.obtenerUsuario.apellido : '';
  }

  const cerrarSecion = () => {
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (
    <div className='flex justify-center items-center flex-col sm:flex-row sm:justify-between border-b-2 border-gray-600 bg-gray-400 p-2 mb-5'>
      <p className='text-xl'>{`${nombre} ${apellido}`}</p>
      <button
        className='bg-blue-800 border-gray-900 border-b-2 justify-center border-r-2 w-full sm:w-auto font-bold rounded py-1 px-2 text-white flex items-center'
        onClick={cerrarSecion}
        type='button'
      >
        Cerrar Sesión
      </button>
    </div>
  )
}

export default Header;
