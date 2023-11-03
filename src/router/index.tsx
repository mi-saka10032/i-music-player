import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '@/layout'

const router = createBrowserRouter([
  {
    path: '',
    element: <Navigate to="/discovery" replace={true} />
  },
  {
    path: '/discovery',
    element: <Layout />,
    children: [
      {
        index: true,
        lazy: async () => await import('@/views/discovery/recommend')
      },
      {
        path: 'playlist',
        lazy: async () => await import('@/views/discovery/play-list')
      },
      {
        path: 'toplist',
        lazy: async () => await import('@/views/discovery/top-list')
      },
      {
        path: 'artist',
        lazy: async () => await import('@/views/discovery/art-ist')
      },
      {
        path: 'album',
        lazy: async () => await import('@/views/discovery/album')
      }
    ]
  },
  {
    path: '/my',
    element: <Layout />,
    children: [
      {
        index: true,
        lazy: async () => await import('@/views/my')
      }
    ]
  },
  {
    path: '/login',
    lazy: async () => await import('@/views/login')
  }
])

export default router
