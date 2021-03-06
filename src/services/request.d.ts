declare namespace request {
  export type LoginParamsType = {
    username: string;
    password: string;
    mobile: string;
    captcha: string;
    type: string;
  };

  export type TableListItem = {
    key: number;
    disabled?: boolean;
    href: string;
    avatar: string;
    name: string;
    owner: string;
    desc: string;
    callNo: number;
    status: number;
    updatedAt: Date;
    createdAt: Date;
    progress: number;
  };

  export type TableListParams = {
    status?: string;
    name?: string;
    desc?: string;
    key?: number;
    pageSize?: number;
    currentPage?: number;
    filter?: Record<string, any[]>;
    sorter?: Record<string, any>;
  };
}
