import { request } from "../request";

// 获取全部MV列表
export function getAllMv(area, type, offset, limit) {
    return request({
        url: "/mv/all",
        params: {
            area,
            type,
            offset,
            limit
        }
    });
}
// 获取MV详情数据
export function getMvDetail(mvid) {
    return request({
        url: "/mv/detail",
        params: {
            mvid
        }
    });
}

// 获取mv评论
export function getMvComment(id, offset, timestamp) {
    return request({
        url: "/comment/mv",
        params: {
            id,
            offset,
            timestamp
        }
    });
}
// 获取相似mv
export function getSimiMv(mvid) {
    return request({
        url: "/simi/mv",
        params: {
            mvid,

        }
    });
}
// 获取mv播放地址
export function getMvUrl(id) {
    return request({
        url: "/mv/url",
        params: {
            id,
        }
    });
}
// 收藏/取消收藏 MV
export function subMv(t, mvid) {
    return request({
        url: "/mv/sub",
        params: {
            t,
            mvid,
        }
    });
}

// 获取全部视频标签
export function getAllVideoTags() {
    return request({
        url: "/video/group/list"
    });
}
//获取热门视频标签 
export function getHotVideoTags() {
    return request({
        url: "/video/category/list"
    });
}

// 获取分类视频列表
export function getGroupVideoList(id, offset) {
    return request({
        url: "/video/group",
        params: {
            id,
            offset
        }
    });
}
// 获取视频详情
export function getVideoDetail(id) {
    return request({
        url: "/video/detail",
        params: {
            id
        }
    });
}
// 获取视频评论
export function getVideoComment(id, offset, timestamp) {
    return request({
        url: "/comment/video",
        params: {
            id,
            offset,
            timestamp
        }
    });
}
// 获取相关视频
export function getSimiVideo(id) {
    return request({
        url: "/related/allvideo",
        params: {
            id,
        }
    });
}
// 获取视频播放地址
export function getVideoUrl(id) {
    return request({
        url: "/video/url",
        params: {
            id,
        }
    });
}
// 获取用户点赞的视频
export function getLikeVideo(timestamp) {
    return request({
        url: "/playlist/mylike",
        params: {
            timestamp,
            limit: 1000

        }
    });
}
// 收藏/取消收藏 MV
export function subVideo(t, id) {
    return request({
        url: "/video/sub",
        params: {
            t,
            id,
        }
    });
}
// 点赞视频 MV
export function likeVideo(t, type, id) {
    return request({
        url: "/resource/like",
        params: {
            t,
            type,
            id
        }
    });
}