import { request } from '../request'

// 发送评论
export function submitCommentBy(type, id, content) {
  return request({
    url: '/comment',
    params: {
      t: 1,
      type,
      id,
      content
    }
  })
}
