import { useEffect, useImperativeHandle, useState } from "react";
import { IAction, IModalProp } from "@/types/modal";
import { Modal, Form, TreeSelect, Input, Select } from "antd";
import { Dept, User } from "@/types/api";
import { useForm } from "antd/es/form/Form";
import api from "@/api";
import { message } from "@/utils/AntdComp";

export default function CreateDept(props: IModalProp<Dept.EditParams>) {
  const [form] = useForm();
  const [action, setAction] = useState<IAction>("create");
  const [visible, setVisible] = useState(false);
  const [deptList, setDeptList] = useState<Dept.DeptItem[]>([]);
  const [userList, setUserList] = useState<User.UserItem[]>([]);

  useEffect(() => {
    getAllUserList();
  }, []);

  const getDeptList = async () => {
    const data = await api.getDeptList();
    setDeptList(data);
  };

  const getAllUserList = async () => {
    const data = await api.getAllUserList();
    setUserList(data);
  };

  // expose open method
  useImperativeHandle(props.mRef, () => ({ open }));

  // open pop-up
  const open = (
    type: IAction,
    data?: Dept.EditParams | { parentId: string }
  ) => {
    setAction(type);
    setVisible(true);
    getDeptList();
    if (data) {
      form.setFieldsValue(data);
    }
  };

  // submit
  const handleSubmit = async () => {
    const valid = await form.validateFields();
    if (valid) {
      if (action === "create") {
        await api.createDept(form.getFieldsValue());
      } else {
        await api.eidtDept(form.getFieldsValue());
      }
      message.success("Operate success");
      handleCancel();
      props.update();
    }
  };

  // close and reset pop-up
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };
  return (
    <Modal
      title={action === "create" ? "Create Department" : "Edit Department"}
      width={800}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form form={form} labelAlign="right" labelCol={{ span: 6 }}>
        <Form.Item hidden name="_id">
          <Input />
        </Form.Item>
        <Form.Item label="Parent Department" name="parentId">
          <TreeSelect
            placeholder="Please select parent department"
            allowClear
            treeDefaultExpandAll
            fieldNames={{ label: "deptName", value: "_id" }}
            treeData={deptList}
          />
        </Form.Item>
        <Form.Item
          label="Department Name"
          name="deptName"
          rules={[{ required: true, message: "Please input department name" }]}
        >
          <Input placeholder="Please input department name" />
        </Form.Item>
        <Form.Item
          label="Leader"
          name="userName"
          rules={[{ required: true, message: "Please select leader" }]}
        >
          <Select>
            {userList.map((item) => {
              return (
                <Select.Option value={item.userName} key={item._id}>
                  {item.userName}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
