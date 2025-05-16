/* eslint-disable react-hooks/exhaustive-deps */
import api from "@/api";
import { Dept } from "@/types/api";
import { formatDateTime } from "@/utils";
import { useSafeState } from "ahooks";
import { Button, Form, Input, Modal, Space, Table } from "antd";
import { useForm } from "antd/es/form/Form";
import { ColumnsType } from "antd/es/table";
import { useEffect, useRef } from "react";
import CreateDept from "./CreateDept";
import { IAction } from "@/types/modal";
import { message } from "@/utils/AntdComp";
import SearchForm from "@/components/SearchForm";

const Department = () => {
  const [form] = useForm();
  const [dataSource, setDataSource] = useSafeState<Dept.DeptItem[]>([]);

  const deptRef = useRef<{
    open: (
      type: IAction,
      data?: Dept.EditParams | { parentId: string }
    ) => void;
  }>(null);

  useEffect(() => {
    getDeptList();
  }, []);

  const getDeptList = async () => {
    const data = await api.getDeptList(form.getFieldsValue());
    setDataSource(data);
  };

  const handleSearch = () => {
    if (!form.getFieldValue("deptName")) return;
    getDeptList();
  };

  const handleCreate = () => {
    deptRef.current?.open("create");
  };

  const handleSubCreate = (deptId: string) => {
    deptRef.current?.open("create", { parentId: deptId });
  };

  const handleEdit = (dept: Dept.DeptItem) => {
    deptRef.current?.open("edit", dept);
  };

  const handleDelete = (deptId: string) => {
    Modal.confirm({
      title: "Delete Department",
      content: "Are you sure you want to delete this department?",
      onOk: async () => {
        await api.deleteDept({
          _id: deptId,
        });
        message.success("Delete success");
        getDeptList();
      },
    });
  };

  const columns: ColumnsType<Dept.DeptItem> = [
    {
      title: "Department Name",
      dataIndex: "deptName",
      key: "deptName",
      width: 200,
    },
    {
      title: "Leader",
      dataIndex: "userName",
      key: "userName",
      width: 150,
    },
    {
      title: "Update Time",
      dataIndex: "updateTime",
      key: "updateTime",
      render(updateTime) {
        return formatDateTime(new Date(updateTime));
      },
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
      width: 200,
      render(record) {
        return (
          <Space>
            <Button type="text" onClick={() => handleSubCreate(record._id)}>
              Add
            </Button>
            <Button type="text" onClick={() => handleEdit(record)}>
              Edit
            </Button>
            <Button type="text" danger onClick={() => handleDelete(record._id)}>
              delete
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <SearchForm form={form} submit={handleSearch}>
        <Form.Item name="deptName" label="Department">
          <Input placeholder="Please input department" />
        </Form.Item>
      </SearchForm>

      <div className="table-container">
        <div className="table-header">
          <div className="title">Department List</div>
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
      <CreateDept mRef={deptRef} update={getDeptList} />
    </div>
  );
};

export default Department;
