/** ---------- 轮播图 ---------- */
declare enum BannerType {
  pc = 0,
  android = 1,
  iphone = 2,
  ipad = 3,
}

type Banners = Array<{
  encodeId: string
  imageUrl: string
}>

// 轮播图Response
interface BannersRes extends CommonRes {
  banners: Banners
}
/** ---------- 轮播图 ---------- */
