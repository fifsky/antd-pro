import {useState} from "react";

export type AsyncValueType = (...args: any) => Promise<void|any>

export default function useAsync(req: AsyncValueType): [AsyncValueType, boolean] {
  const [loading, setLoading] = useState(false);
  const wrapReq = async (...args: any) => {
    setLoading(true);
    return await req(...args).finally(() => setLoading(false))
  }

  return [wrapReq, loading];
}
