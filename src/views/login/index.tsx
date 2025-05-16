import type { FormProps } from "antd";
import { Form, Input, Button } from "antd";
import styles from "@/views/login/login.module.less";
import api from "@/api";
import { LoginType } from "@/types/api";
import storage from "@/utils/storage";
import { message } from "@/utils/AntdComp";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store";

const Login = () => {
  const updateToken = useStore(useShallow((state) => state.updateToken));

  const onFinish: FormProps<LoginType.params>["onFinish"] = async (values) => {
    const data = await api.login(values);
    storage.set("token", data);
    updateToken(data);
    message.success("Login success");
    setTimeout(() => {
      const params = new URLSearchParams(location.search);
      location.href = params.get("callback") || "/";
    }, 1000);
  };

  const onFinishFailed: FormProps<LoginType.params>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <p className={styles.loginTitle}>系统登录</p>
        <Form
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<LoginType.params>
            name="userName"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<LoginType.params>
            name="userPwd"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" block htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
