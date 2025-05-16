/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Space, Button } from "antd";
/**
 * Search for form container component encapsulation
 * @param props
 * @returns
 */
export default function SearchForm(props: any) {
  return (
    <Form
      className="search-form"
      form={props.form}
      layout="inline"
      initialValues={props.initialValues}
    >
      {props.children}
      <Form.Item>
        <Space>
          <Button type="primary" onClick={props.submit}>
            Search
          </Button>
          <Button
            type="default"
            onClick={() => {
              props.form.resetFields();
            }}
          >
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
