import { useImperativeHandle, useState } from "react";
import { IAction, IModalProp } from "@/types/modal";
import { Modal, Form, TreeSelect, Input, InputNumber, Radio } from "antd";
import { Menu } from "@/types/api";
import { useForm } from "antd/es/form/Form";
import api from "@/api";
import { message } from "@/utils/AntdComp";
import { InfoCircleOutlined } from "@ant-design/icons";

export default function CreateMenu(props: IModalProp<Menu.EditParams>) {
  const [form] = useForm();
  const [action, setAction] = useState<IAction>("create");
  const [visible, setVisible] = useState(false);
  const [menuList, setMenuList] = useState<Menu.MenuItem[]>([]);

  const getMenuList = async () => {
    const data = await api.getMenuList();
    setMenuList(data);
  };

  useImperativeHandle(props.mRef, () => ({
    open,
  }));

  // open pop-up
  const open = (
    type: IAction,
    data?: Menu.EditParams | { parentId: string }
  ) => {
    setAction(type);
    setVisible(true);
    getMenuList();
    if (data) {
      form.setFieldsValue(data);
    }
  };

  const handleSubmit = async () => {
    const valid = await form.validateFields();
    if (valid) {
      if (action === "create") {
        await api.createMenu(form.getFieldsValue());
      } else {
        await api.editMenu(form.getFieldsValue());
      }
      message.success("Operate success");
      handleCancel();
      props.update();
    }
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };
  return (
    <Modal
      title={action === "create" ? "Create Menu" : "Edit Menu"}
      width={800}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        labelAlign="right"
        labelCol={{ span: 4 }}
        initialValues={{ menuType: 1, menuState: 1 }}
      >
        <Form.Item hidden name="_id">
          <Input />
        </Form.Item>
        <Form.Item label="Parent Menu" name="parentId">
          <TreeSelect
            placeholder="Please select parent menu"
            allowClear
            treeDefaultExpandAll
            fieldNames={{ label: "menuName", value: "_id" }}
            treeData={menuList}
          />
        </Form.Item>
        <Form.Item label="Menu Type" name="menuType">
          <Radio.Group>
            <Radio value={1}>Menu</Radio>
            <Radio value={2}>Button</Radio>
            <Radio value={3}>Page</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Menu Name"
          name="menuName"
          rules={[{ required: true, message: "Please input menu name" }]}
        >
          <Input placeholder="Please input menu name" />
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {() => {
            return form.getFieldValue("menuType") === 2 ? (
              <Form.Item label="Authority" name="menuCode">
                <Input placeholder="Please input authority code" />
              </Form.Item>
            ) : (
              <>
                <Form.Item label="Menu Icon" name="icon">
                  <Input placeholder="Please input menu icon" />
                </Form.Item>
                <Form.Item label="Route Path" name="path">
                  <Input placeholder="Please input route path" />
                </Form.Item>
              </>
            );
          }}
        </Form.Item>
        <Form.Item label="Component" name="component">
          <Input placeholder="Please input component path" />
        </Form.Item>
        <Form.Item
          label="Order By"
          name="orderBy"
          tooltip={{
            title: "The higher the number, the lower the order",
            icon: <InfoCircleOutlined rev={undefined} />,
          }}
        >
          <InputNumber placeholder="Please input order by" />
        </Form.Item>
        <Form.Item label="Menu State" name="menuState">
          <Radio.Group>
            <Radio value={1}>Enable</Radio>
            <Radio value={2}>Disable</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
