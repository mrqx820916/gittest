import { defineStore } from 'pinia'
import { getCouponList, receiveCoupon, getMyCoupons } from '@/api/coupon'

export const useCouponStore = defineStore('coupon', {
  state: () => ({
    coupons: [],
    myCoupons: {
      available: [],
      used: [],
      expired: []
    }
  }),
  
  actions: {
    async getCouponList(params) {
      const res = await getCouponList(params)
      this.coupons = res
      return res
    },
    
    async receiveCoupon(id) {
      await receiveCoupon(id)
      await this.getMyCoupons()
    },
    
    async getMyCoupons() {
      const res = await getMyCoupons()
      this.myCoupons = res
      return res
    }
  }
}) 