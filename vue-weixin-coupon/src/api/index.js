import request from '@/utils/request'

export function getJsInitConfig(data) {
  return request({
    url: '/member-mall/pay/getJsInitConfig',
    method: 'post',
    data
  })
}

export function queryFreCardList(data) {
  return request({
    url: '/member-mall/mp/frequency/queryFreCardList',
    method: 'post',
    data
  })
}

export function queryCouponList(data) {
  return request({
    url: '/member-mall/mp/frequency/queryCouponList',
    method: 'post',
    data
  })
}

export function queryFrequencyDetail(data) {
  return request({
    url: '/member-mall/mp/frequency/queryFrequencyDetail',
    method: 'post',
    data
  })
}

export function queryFreTransList(data) {
  return request({
    url: '/member-mall/mp/frequency/queryFreTransList',
    method: 'post',
    data
  })
}

export function generateQRCode(data) {
  return request({
    url: '/member-mall/mp/frequency/generateQRCode',
    method: 'post',
    data
  })
}