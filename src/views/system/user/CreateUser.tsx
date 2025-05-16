import storage from "@/utils/storage";
import { Modal, Form, Input, Select, Upload } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import type { UploadChangeParam } from "antd/es/upload";
import { message } from "@/utils/AntdComp";
import { useImperativeHandle, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { IAction, IModalProp } from "@/types/modal";
import api from "@/api";
import { User } from "@/types/api";

const CreateUser = (props: IModalProp<User.UserItem>) => {
  const [imgUrl, setImgUrl] = useState("/imgs/headimg.svg");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [visiable, setVisiable] = useState(false);
  const [action, setAction] = useState<IAction>("create");

  // Expose the open method of the child component
  useImperativeHandle(props.mRef, () => ({ open }));

  // Call the pop-up method of display
  const open = (type: IAction, data?: User.UserItem) => {
    setAction(type);
    setVisiable(true);
    if (data && type === "edit") {
      form.setFieldsValue(data);
      setImgUrl(data.userImg);
    }
  };

  const handleOnOK = async () => {
    const valid = await form.validateFields();
    if (valid) {
      const params = {
        ...form.getFieldsValue(),
        userImg: imgUrl,
      };

      if (action === "create") {
        await api.createUser(params);
        message.success("Create user success");
      } else {
        await api.editUser(params);
        message.success("Edit user success");
      }
      props.update();
      handleOnCancel();
    }
  };

  const handleOnCancel = () => {
    setVisiable(false);
    form.resetFields();
  };

  const handleBeforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }

    return isJpgOrPng && isLt2M;
  };

  const handleOnChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status === "done") {
      const { code, data, msg } = info.file.response;
      if (code === 0) {
        setImgUrl(data.file);
      } else {
        message.error(msg);
      }
    } else if (info.file.status === "error") {
      message.error("upload failed, please try again later");
    }
    setLoading(false);
  };

  return (
    <Modal
      open={visiable}
      title={action === "create" ? "Create User" : "Edit User"}
      onOk={handleOnOK}
      onCancel={handleOnCancel}
    >
      <Form form={form} labelCol={{ span: 6 }} labelAlign="right">
        <Form.Item name="userId" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="userName"
          label="User Name"
          rules={[
            { required: true, message: "Please input username" },
            { min: 6, max: 16, message: "Username must be 6-16 characters" },
          ]}
        >
          <Input placeholder="Please input username" />
        </Form.Item>
        <Form.Item
          name="userEmail"
          label="User Email"
          rules={[
            { required: true, message: "Please input email" },
            { type: "email", message: "Please input valid email" },
          ]}
        >
          <Input
            placeholder="Please input email"
            disabled={action === "edit"}
          />
        </Form.Item>
        <Form.Item
          name="mobile"
          label="Mobile"
          rules={[
            {
              pattern: /1[3-9]\d{9}/,
              message: "Mobile must be an 11-digit number strarting with 1",
            },
          ]}
        >
          <Input type="number" placeholder="Please input mobile number" />
        </Form.Item>
        <Form.Item
          name="deptId"
          label="Department"
          rules={[{ required: true, message: "Please select department" }]}
        >
          <Input placeholder="Please input department" />
        </Form.Item>
        <Form.Item name="job" label="Job">
          <Input placeholder="Please input job" />
        </Form.Item>
        <Form.Item name="state" label="State">
          <Select style={{ width: 120 }}>
            <Select.Option value={1}>Employed</Select.Option>
            <Select.Option value={2}>Trial Period</Select.Option>
            <Select.Option value={3}>Resign</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="role" label="Role">
          <Input placeholder="Please input role" />
        </Form.Item>
        <Form.Item label="Avatar">
          <Upload
            listType="picture-circle"
            showUploadList={false}
            headers={{
              Authorization: `Bearer ${storage.get("token")}`,
              icode: "A7EEA094EAA44AF4",
            }}
            action="/api/users/upload"
            beforeUpload={handleBeforeUpload}
            onChange={handleOnChange}
          >
            {imgUrl ? (
              <img src={imgUrl} style={{ width: "100%" }} />
            ) : (
              <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUser;
