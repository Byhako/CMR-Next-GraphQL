import React from 'react';
import Head from 'next/head';
import Sidebar from './Sidebar';
import Header from './Header';
import { useRouter } from 'next/router';

const Layaut = ({children}) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>CMR - Administración</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha256-l85OmPOjvil/SOvVt3HnSSjzF1TUMyT9eV0c2BzEGzU=" crossorigin="anonymous" />
        <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
      </Head>
      {router.pathname === '/login' || router.pathname === '/nuevaCuenta' ? (
        <div className='bg-gray-800 min-h-screen flex flex-col justify-center'>
          <div>{children}</div>
        </div>
      ) : (
        <div className='bg-gray-200 min-h-screen'>
          <div className='flex min-h-screen'>
            <Sidebar />
            <main className='p-2 w-full sm:p-5'>
              <Header />
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
}

export default Layaut;
