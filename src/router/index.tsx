import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '@/layout'
import LazyImportComponent from '@/components/lazyImportComponent'

const Recommend = lazy(async () => await import('@/views/discovery/recommend'))
const Playlist = lazy(async () => await import('@/views/discovery/play-list'))
const Toplist = lazy(async () => await import('@/views/discovery/top-list'))
const Artist = lazy(async () => await import('@/views/discovery/art-ist'))
const Album = lazy(async () => await import('@/views/discovery/album'))
const Detail = lazy(async () => await import('@/views/detail'))
const Mine = lazy(async () => await import('@/views/mine'))

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
            element: <LazyImportComponent lazyChildren={Recommend} />
          },
          {
            path: 'playlist',
            element: <LazyImportComponent lazyChildren={Playlist} />
          },
          {
            path: 'toplist',
            element: <LazyImportComponent lazyChildren={Toplist} />
          },
          {
            path: 'artist',
            element: <LazyImportComponent lazyChildren={Artist} />
          },
          {
            path: 'album',
            element: <LazyImportComponent lazyChildren={Album} />
          }
        ]
      },
      {
        path: 'detail/:id',
        element: <LazyImportComponent lazyChildren={Detail} />
      },
      {
        path: 'mine',
        children: [
          {
            index: true,
            element: <LazyImportComponent lazyChildren={Mine} />
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
