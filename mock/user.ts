import {Request, Response} from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

async function getFakeCaptcha(req: Request, res: Response) {
  await waitTime(2000);
  return res.json('captcha-xxx');
}

/**
 * 当前用户的权限，如果为空代表没登录
 * current user access， if is '', user need login
 * 如果是 pro 的预览，默认是有权限的
 */
let access = '';

const getAccess = () => {
  return access;
};

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'POST /api/user/current': (req: Request, res: Response) => {
    if (!getAccess()) {
      res.status(401).send({
        code:401,
        message: '请先登录！',
      });
      return;
    }
    res.send({
      code: 200,
      data: {
        name: 'Serati Ma',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        userid: '00000001',
        email: 'antdesign@alipay.com',
        signature: '海纳百川，有容乃大',
        title: '交互专家',
        group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
        tags: [
          {
            key: '0',
            label: '很有想法的',
          },
          {
            key: '1',
            label: '专注设计',
          },
          {
            key: '2',
            label: '辣~',
          },
          {
            key: '3',
            label: '大长腿',
          },
          {
            key: '4',
            label: '川妹子',
          },
          {
            key: '5',
            label: '海纳百川',
          },
        ],
        notifyCount: 12,
        unreadCount: 11,
        country: 'China',
        access: getAccess(),
        geographic: {
          province: {
            label: '浙江省',
            key: '330000',
          },
          city: {
            label: '杭州市',
            key: '330100',
          },
        },
        address: '西湖区工专路 77 号',
        phone: '0752-268888888',
      }
    });
  },
  // 登录
  'POST /api/login': async (req: Request, res: Response) => {
    const {username} = req.body;
    await waitTime(1000);
    if (username === 'admin') {
      res.send({
        code: 200,
        data: {
          currentAuthority: 'admin',
        }
      });
      access = 'admin';
      return;
    }

    res.send({
      code: 201,
      message: '用户名密码错误',
    });
    access = 'guest';
  },
  // 登出
  'GET /api/logout': (req: Request, res: Response) => {
    access = '';
    res.send({data: {}, success: true});
  },
  // 注册
  'POST /api/register': (req: Request, res: Response) => {
    res.send({status: 'ok', currentAuthority: 'user', success: true});
  },
  // 验证码
  'GET  /api/captcha': getFakeCaptcha,
};
