import React, { useState } from 'react';
import Layaut from '../components/Layaut';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

const Login = () => {
  const router = useRouter();
  const [mensaje, setMensaje] = useState('');
  // Mutacion login
  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('El email no es valido')
        .required('Campo requerido'),
      password: Yup.string()
        .required('Campo requerido')
    }),
    onSubmit: async valores => {
      try {
        const { data } = await autenticarUsuario({
          variables: {
            input: valores
          }
        });
        console.log(data)
        setMensaje(`Bienvenido.`);
        const { token } = data.autenticarUsuario;
        localStorage.setItem('token', token);

        setTimeout(() => {
          formik.handleReset();
          router.push('/');
        }, 2000);
      } catch (error) {
        console.error('Error en login', error);
        setMensaje(error.message);
        setTimeout(() => {
          setMensaje('');
        }, 2000);
      }
    }
  })

  return (
    <Layaut>
      {mensaje && (
        <div className='bg-orange-200 rounded py-2 px-3 w-full my-3 text-center max-w-sm mx-auto'>
          <p>{mensaje}</p>
        </div>
      )}
      <h1 className='text-center font-white text-white text-2xl'>Login</h1>
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-sm'>
          <form className='bg-gray-300 rounded shadow-md px-8 pt-6 pb-8 mb-4' onSubmit={formik.handleSubmit}>
            <div>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>
                Email
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='email'
                type='email'
                placeholder='Email Usuario'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <div className='flex my-2 py-1 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error:&nbsp;</p>
                  <p>{formik.errors.email}</p>
                </div>
              )}
            </div>

            <div className='mt-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                Password
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='password'
                type='password'
                placeholder='Password Usuario'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <div className='flex my-2 py-1 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error:&nbsp;</p>
                  <p>{formik.errors.password}</p>
                </div>
              )}
            </div>

            <input
              type='submit'
              className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 cursor-pointer'
              value='Iniciar Sesión'
            />
          </form>
        </div>
      </div>
    </Layaut>
  );
}

export default Login;
