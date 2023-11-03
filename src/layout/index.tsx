import { memo, useEffect } from 'react'
import { fetchRecommendData } from '@/store/cache'
import { useAppDispatch } from '@/hooks'

import Content from './content'
import Footer from './footer'
import Header from './header'
import Sider from './sider'

const Layout = memo(() => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    void dispatch(fetchRecommendData())
  }, [])
  return (
    <div className='relative grid grid-cols-[200px_1fr] grid-rows-[1fr_60px] w-full h-full m-0 p-0 overflow-hidden'>
      <Header />
      <Sider />
      <Content />
      <Footer />
    </div>
  )
})

Layout.displayName = 'Layout'
export default Layout
