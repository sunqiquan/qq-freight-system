/* eslint-disable react-hooks/exhaustive-deps */
import { PageParams, User } from "@/types/api";
import { formatDateTime } from "@/utils";
import { Button, Form, Input, Modal, Select, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState, useEffect, useRef } from "react";
import api from "@/api";
import CreateUser from "./CreateUser";
import { IAction } from "@/types/modal";
import { message } from "@/utils/AntdComp";
import SearchForm from "@/components/SearchForm";

const UserListFC = () => {
  const userRef = useRef<{
    open: (type: IAction, data?: User.UserItem) => void;
  }>(null);

  const [form] = Form.useForm();
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [userIds, setUserIds] = useState<number[]>([]);
  const [dataSource, setDataSource] = useState<User.UserItem[]>([]);

  const getUserList = async (pageParams?: PageParams) => {
    const searchValues = form.getFieldsValue();
    if (!pageParams) {
      pageParams = {
        current: 1,
        pageSize: pagination.pageSize,
      };
    }
    const data = await api.getUserList({
      ...searchValues,
      ...pageParams,
    });
    setDataSource(data.list);
    setTotal(data.page.total);
    setUserIds([]);
  };

  useEffect(() => {
    getUserList(pagination);
  }, [pagination.current, pagination.pageSize]);

  const handleSearch = () => {
    getUserList();
  };

  const handleAddUser = () => {
    userRef.current?.open("create");
  };

  const handleEditUser = (record: User.UserItem) => {
    userRef.current?.open("edit", record);
  };

  const handleDelUser = async (userId: number) => {
    Modal.confirm({
      title: "Delete User",
      content: "Are you sure you want to delete this user?",
      onOk: async () => {
        await api.delUser([userId]);
        message.success("Delete user success");
        getUserList();
      },
    });
  };

  const handleBatchDelUser = () => {
    Modal.confirm({
      title: "Delete Users",
      content: "Are you sure you want to delete these users?",
      onOk: async () => {
        await api.delUser(userIds);
        message.success("Delete users success");
        getUserList();
      },
    });
  };

  const columns: ColumnsType<User.UserItem> = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "userEmail",
      key: "userEmail",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render(role: number) {
        return {
          0: "Super Admin",
          1: "Admin",
          2: "User",
        }[role];
      },
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      render(state: number) {
        return {
          1: "Employed",
          2: "Trial Period",
          3: "Resign",
        }[state];
      },
    },
    {
      title: "Create Time",
      dataIndex: "createTime",
      key: "createTime",
      render(createTime: string) {
        return formatDateTime(new Date(createTime));
      },
    },
    {
      title: "Operate",
      key: "operate",
      render(record: User.UserItem) {
        return (
          <Space>
            <Button type="text" onClick={() => handleEditUser(record)}>
              Edit
            </Button>
            <Button
              type="text"
              danger
              onClick={() => handleDelUser(record.userId)}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      <SearchForm
        form={form}
        submit={handleSearch}
        initialValues={{ state: 0 }}
      >
        <Form.Item name="userId" label="User ID">
          <Input placeholder="Please input user ID" />
        </Form.Item>
        <Form.Item name="userName" label="User Name">
          <Input placeholder="Please input user name" />
        </Form.Item>
        <Form.Item name="state" label="State">
          <Select style={{ width: 120 }}>
            <Select.Option value={0}>All</Select.Option>
            <Select.Option value={1}>Employed</Select.Option>
            <Select.Option value={2}>Trial Period</Select.Option>
            <Select.Option value={3}>Resign</Select.Option>
          </Select>
        </Form.Item>
      </SearchForm>

      <div className="table-container">
        <div className="table-header">
          <div className="title">User List</div>
          <div className="action">
            <Button type="primary" onClick={handleAddUser}>
              Add
            </Button>
            <Button
              type="primary"
              danger
              onClick={handleBatchDelUser}
              disabled={!userIds.length}
            >
              Delete
            </Button>
          </div>
        </div>
        <Table
          bordered
          rowKey="userId"
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: userIds,
            onChange: (selectedRowKeys: React.Key[]) => {
              setUserIds(selectedRowKeys as number[]);
            },
          }}
          columns={columns}
          dataSource={dataSource}
          pagination={{
            ...pagination,
            showQuickJumper: true,
            showSizeChanger: true,
            total,
            showTotal: (total) => `Total ${total} items`,
            onChange: (current, pageSize) => {
              setPagination({
                current,
                pageSize,
              });
            },
          }}
        />
        <CreateUser mRef={userRef} update={() => getUserList()} />
      </div>
    </div>
  );
};

export default UserListFC;
