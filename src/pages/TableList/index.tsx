import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { TableListItem } from '../../services/data';
import { queryRuleApi, updateRuleApi, addRuleApi, removeRuleApi } from '@/services/api';
import useAsync from "@/hooks/async";

const TableList: React.FC = () => {
  /**
   * 分布更新窗口的弹窗
   */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: "规则名称",
      dataIndex: 'name',
      tip: '规则名称是唯一的 key',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: "描述",
      dataIndex: 'desc',
      valueType: 'textarea',
    },
    {
      title: "服务调用次数",
      dataIndex: 'callNo',
      sorter: true,
      hideInForm: true,
      renderText: (val: string) =>
        `${val} 万 `,
    },
    {
      title: "状态",
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: (
            "关闭"
          ),
          status: 'Default',
        },
        1: {
          text: (
            "运行中"
          ),
          status: 'Processing',
        },
        2: {
          text: (
            "已上线"
          ),
          status: 'Success',
        },
        3: {
          text: (
            "异常"
          ),
          status: 'Error',
        },
      },
    },
    {
      title: "上次调度时间",
      sorter: true,
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return (
            <Input
              {...rest}
              placeholder={'请输入异常原因'}
            />
          );
        }
        return defaultRender(item);
      },
    },
    {
      title: "操作",
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          配置
        </a>,
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
          订阅警报
        </a>,
      ],
    },
  ];


  /**
   * 添加节点
   * @param fields
   */
  const [handleAdd] = useAsync(async (fields: TableListItem) => {
    try {
      await addRuleApi({ ...fields });
      if (actionRef.current) {
        actionRef.current.reload();
      }
      message.success('添加成功');
      return true
    } catch (error) {
      message.error('添加失败请重试！');
      return false
    }
  })


  /**
   * 更新节点
   * @param fields
   */
  const [handleUpdate] = useAsync(async (fields: FormValueType) => {
    try {
      await updateRuleApi({
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      });
      handleUpdateModalVisible(false);
      setCurrentRow(undefined);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      message.success('配置成功');
      return true;
    } catch (error) {
      message.error('配置失败请重试！');
      return false;
    }
  })

  /**
   *  删除节点
   * @param selectedRows
   */
  const [handleRemove] = useAsync(async (selectedRows: TableListItem[]) => {
    const ret: boolean = await (async ()=>{
      if (!selectedRows) return true;
      try {
        await removeRuleApi({
          key: selectedRows.map((row) => row.key),
        });
        message.success('删除成功，即将刷新');
        return true;
      } catch (error) {
        message.error('删除失败，请重试');
        return false;
      }
    })()

    setSelectedRows([]);
    actionRef.current?.reloadAndRest?.();
    return ret
  });


  return (
    <PageContainer>
      <ProTable
        headerTitle='查询表格'
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <ModalForm
            title='新建规则'
            trigger={
              <Button type="primary">
                <PlusOutlined />
                新建
              </Button>
            }
            width="400px"
            onFinish={handleAdd}
          >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: '规则名称为必填项',
                },
              ]}
              width="md"
              name="name"
            />
            <ProFormTextArea width="md" name="desc" />
          </ModalForm>,
        ]}
        request={async (params, sorter, filter) => {
          const ret = await queryRuleApi({...params, sorter, filter})
          return {
            data:ret.list,
            success:true,
            total:ret.pagination.total
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项
              &nbsp;&nbsp;
              <span>服务调用次数总计{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)}{' '}
                万
              </span>
            </div>
          }
        >
          <Button
            onClick={handleRemove}
          >
            批量删除
          </Button>
          <Button type="primary">
            批量审批
          </Button>
        </FooterToolbar>
      )}
      <UpdateForm
        onSubmit={handleUpdate}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
