import React, { useEffect } from "react";
import { isEmpty } from "../../../utils/helpers";
import { Col, Row, Form, Input } from "antd";

const StudentInfo = (props) => {
  const studentDetail = props.item;
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isEmpty(studentDetail)) {
      form.setFieldsValue({
        ...studentDetail
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentDetail]);

  return (
    <div className="student-info">
      <Form form={form} colon={false} layout="vertical">
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24} lg={8}>
            <Form.Item name="fullName" label="Tên học viên">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} lg={8}>
            <Form.Item name="phone" label="Số điện thoại">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} lg={8}>
            <Form.Item name="email" label="Email">
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row>
        {/* <Row gutter={[16, 0]}>
          <Col xs={24} sm={24} lg={8}>
            <Form.Item name="startDate" label="Ngày bắt đầu">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} lg={8}>
            <Form.Item name="endDate" label="Ngày kết thúc">
              <Input.TextArea readOnly autoSize />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} lg={8}>
            <Form.Item name="status" label="Trạng thái">
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row> */}
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24} lg={24}>
            <Form.Item name="address" label="Địa chỉ">
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default StudentInfo;
