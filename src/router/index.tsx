import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '@/layout'
import LazyImportComponent from '@/components/lazyImportComponent'
import ErrorBoundary from '@/components/errorBoundary'

const Recommend = lazy(async () => await import('@/views/discovery/recommend'))
const Playlist = lazy(async () => await import('@/views/discovery/play-list'))
const Toplist = lazy(async () => await import('@/views/discovery/top-list'))
const Artist = lazy(async () => await import('@/views/discovery/art-ist'))
const Album = lazy(async () => await import('@/views/discovery/album'))
const MusicDetail = lazy(async () => await import('@/views/musicDetail/kinds/musicDetail'))

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <Layout />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="discovery" replace={true} />
      },
      {
        path: 'discovery',
        children: [
          {
            // 首页推荐
            index: true,
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
        path: 'musicDetail',
        children: [
          {
            path: ':id',
            element: <LazyImportComponent lazyChildren={MusicDetail} />
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
