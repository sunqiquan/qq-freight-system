/* eslint-disable react-hooks/exhaustive-deps */
import api from "@/api";
import { Menu } from "@/types/api";
import { Form, Input, Button, Table, Space, Modal, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useRef, useState } from "react";
import { IAction } from "@/types/modal";
import { ColumnsType } from "antd/es/table";
import { message } from "@/utils/AntdComp";
import { formatDateTime } from "@/utils";
import CreateMenu from "./CreateMenu";
import SearchForm from "@/components/SearchForm";

export default function MenuList() {
  const [form] = useForm();
  const [dataSource, setDataSource] = useState<Menu.MenuItem[]>([]);

  const menuRef = useRef<{
    open: (
      type: IAction,
      data?: Menu.EditParams | { parentId?: string; orderBy?: number }
    ) => void;
  }>(null);

  useEffect(() => {
    getMenuList();
  }, []);

  const getMenuList = async () => {
    const data = await api.getMenuList(form.getFieldsValue());
    setDataSource(data);
  };

  const handleCreate = () => {
    menuRef.current?.open("create", {
      orderBy: dataSource.length,
    });
  };

  const handleSubCreate = (record: Menu.MenuItem) => {
    menuRef.current?.open("create", {
      parentId: record._id,
      orderBy: record.children?.length,
    });
  };

  const handleEdit = (record: Menu.MenuItem) => {
    menuRef.current?.open("edit", record);
  };

  const handleDelete = (record: Menu.MenuItem) => {
    let text = "";
    if (record.menuType == 1) text = "Menu";
    if (record.menuType == 2) text = "Button";
    if (record.menuType == 3) text = "Pgge";
    Modal.confirm({
      title: "Delete Menu",
      content: `Are you sure you want to delete ${text}？`,
      onOk() {
        handleDelSubmit(record._id);
      },
    });
  };

  const handleDelSubmit = async (_id: string) => {
    await api.deleteMenu({
      _id,
    });
    message.success("Delete success");
    getMenuList();
  };

  const columns: ColumnsType<Menu.MenuItem> = [
    {
      title: "Menu Name",
      dataIndex: "menuName",
      key: "menuName",
    },
    {
      title: "Menu Icon",
      dataIndex: "icon",
      key: "icon",
    },
    {
      title: "Menu Icon",
      dataIndex: "menuType",
      key: "menuType",
      render(menuType: number) {
        return {
          1: "Menu",
          2: "Button",
          3: "Page",
        }[menuType];
      },
    },
    {
      title: "Authority",
      dataIndex: "menuCode",
      key: "menuCode",
    },
    {
      title: "Route Path",
      dataIndex: "path",
      key: "path",
    },
    {
      title: "Component",
      dataIndex: "component",
      key: "component",
    },
    {
      title: "Create Time",
      dataIndex: "createTime",
      key: "createTime",
      render(createTime) {
        return formatDateTime(new Date(createTime));
      },
    },
    {
      title: "Operate",
      key: "action",
      width: 200,
      render(_, record) {
        return (
          <Space>
            <Button type="text" onClick={() => handleSubCreate(record)}>
              Add
            </Button>
            <Button type="text" onClick={() => handleEdit(record)}>
              Edit
            </Button>
            <Button type="text" danger onClick={() => handleDelete(record)}>
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
        submit={getMenuList}
        initialValues={{ menuState: 1 }}
      >
        <Form.Item label="Menu Name" name="menuName">
          <Input placeholder="Menu Name" />
        </Form.Item>
        <Form.Item label="Menu State" name="menuState">
          <Select style={{ width: 100 }}>
            <Select.Option value={1}>Eanble</Select.Option>
            <Select.Option value={2}>Disable</Select.Option>
          </Select>
        </Form.Item>
      </SearchForm>

      <div className="table-container">
        <div className="table-header">
          <div className="title">Menu List</div>
          <div className="action">
            <Button type="primary" onClick={handleCreate}>
              Add
            </Button>
          </div>
        </div>
        <Table
          bordered
          rowKey="_id"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </div>
      <CreateMenu mRef={menuRef} update={getMenuList} />
    </div>
  );
}
