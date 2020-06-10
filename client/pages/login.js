import React from 'react';
import Layaut from '../components/Layaut';

const Login = () => {
  return (
    <>
      <Layaut>
        <h1 className='text-center font-white text-white text-2xl'>Login</h1>
        <div className='flex justify-center mt-5'>
          <div className='w-full max-w-sm'>
            <form className='bg-gray-300 rounded shadow-md px-8 pt-6 pb-8 mb-4'>
              <div>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>
                  Email
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='nombre'
                  type='email'
                  placeholder='Email Usuario'
                />
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
                />
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
    </>
  );
}

export default Login;
