import type { ResponseError } from 'umi-request';

export const errors = (e: ResponseError): response.Error => {
    return {
      code: e.data?.code ? e.data?.code : 500,
      message: e.data?.message ? e.data?.message : e.message
    }
}
