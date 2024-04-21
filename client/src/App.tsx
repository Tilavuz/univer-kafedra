import { lazy, Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { useCookies } from 'react-cookie';
import { jwtDecode } from "jwt-decode";


import RootLayout from "./layouts/root-layout"
import TeachLayout from "./layouts/teach-layout"



const Home = lazy(() => import('./pages/home'))
const File = lazy(() => import('./pages/file'))
const Teachers = lazy(() => import('./pages/teachers'))
const Login = lazy(() => import('./pages/login'))
const Settings = lazy(() => import('./pages/settings'))
const ErrorPage = lazy(() => import('./pages/404'))
const Teach = lazy(() => import('./pages/teach'))
const TeachSettings = lazy(() => import('./pages/teach-settings'))



type Admin = {
  name: string;
  departmentName: string;
  loginId: number;
  role: string;
};

type Teacher = {
  _id: string;
  name: string;
  adminId: number;
  loginId: number;
  role: string;
};

type MyRoute = {
  path: string;
  element: JSX.Element;
  errorElement: JSX.Element;
  children?: Array<{
    index: boolean;
    element: JSX.Element;
  } | {
    path: string;
    element: JSX.Element;
  }>;
};


export default function App() {

  const [cookies] = useCookies(['accessToken']);
  const accessToken: string = cookies.accessToken;


  let routerMenu: MyRoute[] = [
    {
      path: '/',
      element: (
        <Suspense fallback={<p>Loading...</p>}>
          <Login />
        </Suspense>
      ),
      errorElement: <ErrorPage />
    }
  ]

  if(accessToken) {
    const data: Admin | Teacher = jwtDecode(accessToken)
    
    if(data?.role === 'admin') {
      routerMenu = [
        {
          path: '/',
          element: <RootLayout />,
          errorElement: <ErrorPage />,
          children: [
            {
              index: true,
              element: (
                <Suspense fallback={<p>Loading...</p>}>
                  <Home />
                </Suspense>
              ),
            },
            {
              path: 'file/:file',
              element: (
                <Suspense fallback={<p>Loading...</p>}>
                  <File />
                </Suspense>
              ),
            },
            {
              path: 'teachers',
              element: (
                <Suspense fallback={<p>Loading...</p>}>
                  <Teachers />
                </Suspense>
              ),
            },
            {
              path: 'settings',
              element: (
                <Suspense fallback={<p>Loading...</p>}>
                  <Settings />
                </Suspense>
              )
            }
          ] 
        }
      ]
    }else if(data?.role === 'user') {
      routerMenu = [
        {
          path: '/',
          element: <TeachLayout />,
          errorElement: <ErrorPage />,
          children: [
            {
              index: true,
              element: (
                <Suspense fallback={<p>Loading...</p>}>
                  <Teach />
                </Suspense>
              )
            },
            {
              path: 'settings',
              element: (
                <Suspense fallback={<p>Loading...</p>}>
                  <TeachSettings />
                </Suspense>
              )
            }
          ]
        }
      ]
    }
  }


  const router = createBrowserRouter(routerMenu)

  return <RouterProvider router={router}/>
}
