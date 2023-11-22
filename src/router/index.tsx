import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '@/layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="discovery" replace={true} />
      },
      {
        path: 'discovery',
        children: [
          {
            index: true,
            // 首页推荐
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
        path: 'detail/:id',
        lazy: async () => await import('@/views/detail')
      },
      {
        path: 'mine',
        children: [
          {
            index: true,
            lazy: async () => await import('@/views/mine')
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    lazy: async () => await import('@/views/login')
  }
])

export default router
