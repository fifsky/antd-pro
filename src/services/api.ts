import {request} from 'umi';
import {TableListItem, TableListParams} from "@/services/data";

const createApi = async (path: string, data: any = {}, method: string = 'POST') => {
  const ret = await request(path, {
    method,
    data,
  });
  if (ret.code !== 200) {
    throw ret
  }
  return ret.data
}

export const accountLoginApi = (params: request.LoginParamsType) => createApi('/api/login', params)
export const getCaptchaApi = (mobile: string) => createApi(`/api/captcha?mobile=${mobile}`, {}, "GET")
export const outLoginApi = () => createApi('/api/logout')
export const queryUserApi = () => createApi('/api/users')
export const currentUserApi = () => createApi('/api/user/current')
export const queryNoticesApi = () => createApi('/api/notices')
export const queryRuleApi = (params?: TableListParams) => createApi('/api/rule',params)
export const removeRuleApi = (params: { key: number[] }) => createApi('/api/rule',params)
export const addRuleApi = (params: TableListItem) => createApi('/api/rule',params)
export const updateRuleApi = (params: TableListParams) => createApi('/api/rule',params)
