import React from 'react';
import Layaut from '../components/Layaut';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const NuevaCuenta = () => {
  // Validación del formulario
  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('Nombre requerido'),
      apellido: Yup.string().required('Apellido requerido'),
      email: Yup.string().email('Email invalido').required('Email requerido'),
      password: Yup.string().required('Password requerido').min(6, 'Al menos 6 caracteres')
    }),
    onSubmit: valores => {
      console.log('enviando', valores);
      formik.handleReset();
    }
  });

  return (
    <>
      <Layaut>
        <h1 className='text-center font-white text-white text-2xl'>Crear Cuenta Nueva</h1>
        <div className='flex justify-center mt-5'>
          <div className='w-full max-w-sm'>
            <form
              className='bg-gray-300 rounded shadow-md px-8 pt-6 pb-8 mb-4'
              onSubmit={formik.handleSubmit}
            >
              <div>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>
                  Nombre
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='nombre'
                  type='text'
                  placeholder='Nombre Usuario'
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.nombre && formik.errors.nombre && (
                  <div className='flex my-2 py-1 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                    <p className='font-bold'>Error:&nbsp;</p>
                    <p>{formik.errors.nombre}</p>
                  </div>
                )}
              </div>

              <div className='mt-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='apellido'>
                  Apellido
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='apellido'
                  type='text'
                  placeholder='Apellido Usuario'
                  value={formik.values.apellido}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.apellido && formik.errors.apellido && (
                  <div className='flex my-2 py-1 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                    <p className='font-bold'>Error:&nbsp;</p>
                    <p>{formik.errors.apellido}</p>
                  </div>
                )}
              </div>

              <div className='mt-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                  Email
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='email'
                  type='email'
                  placeholder='Email Usuario'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                value='Crear Cuenta'
              />
            </form>
          </div>
        </div>
      </Layaut>
    </>
  );
}

export default NuevaCuenta;
