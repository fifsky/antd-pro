import {request as umiRequest} from 'umi';

async function createApi<T>(path: string, data: any = {}, method: string = 'POST'): Promise<T> {
  const ret = await umiRequest(path, {
    method,
    data,
  });
  if (ret.code !== 200) {
    throw ret
  }
  return ret.data
}

export const accountLoginApi = (params: request.LoginParamsType) => createApi<response.LoginStateType>('/api/login', params)
export const getCaptchaApi = (mobile: string) => createApi(`/api/captcha?mobile=${mobile}`, {}, "GET")
export const outLoginApi = () => createApi('/api/logout')
export const currentUserApi = () => createApi<response.CurrentUser>('/api/user/current')
export const queryNoticesApi = () => createApi<response.NoticeIconData>('/api/notices')
export const queryRuleApi = (params?: request.TableListParams) => createApi<response.TableListData>('/api/rule',params)
export const removeRuleApi = (params: { key: number[] }) => createApi('/api/rule',params)
export const addRuleApi = (params: request.TableListItem) => createApi('/api/rule',params)
export const updateRuleApi = (params: request.TableListParams) => createApi('/api/rule',params)
