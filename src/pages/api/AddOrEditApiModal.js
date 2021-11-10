import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Spin,
  message,
  Select,
  Row,
  Col,
  Checkbox,
} from "antd";
import { isEmpty } from "../../utils/helpers";
import { actionAddApi, actionEditApi } from "./ApiAction";
import { API_TYPE } from "../../utils/constants/config";

export default function AddEditApiModal(props) {
  const { visible = true, onCancel, item = {} } = props;
  const isAddNew = isEmpty(item);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);

  const handleOk = () => {
    if (processing) return;
    form
      .validateFields()
      .then(async (values) => {
        try {
          setProcessing(true);
          if (isAddNew) {
            await actionAddApi(values);
            message.success("Thêm quyền thành công!");
          } else {
            await actionEditApi(values, item?.id);
            message.success("Sửa quyền thành công!");
          }
          setProcessing(false);
          onCancel(true);
        } catch (error) {
          setProcessing(false);
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      visible={visible}
      title={isAddNew ? "Thêm quyền" : "Chỉnh sửa quyền"}
      okText={isAddNew ? "Thêm" : "Lưu"}
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="600px"
      className="common-form-modal add-edit-api-modal"
      centered
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      {/* isRequiredAccessToken: true

pattern: "/user/logout"
shouldCheckPermission: true */}

      <Spin spinning={processing}>
        <div className="add-edit-api-content">
          <Form
            form={form}
            layout="vertical"
            name="formApi"
            initialValues={{ ...item }}
            hideRequiredMark
            size="large"
          >
            <Form.Item
              name="name"
              label="Tên quyền"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập tên quyền!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="httpMethod"
              label="Phương thức"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập phương thức!",
                },
              ]}
            >
              <Select>
                <Select.Option value={API_TYPE.GET}>GET</Select.Option>
                <Select.Option value={API_TYPE.POST}>POST</Select.Option>
                <Select.Option value={API_TYPE.PUT}>PUT</Select.Option>
                <Select.Option value={API_TYPE.DELETE}>DELETE</Select.Option>
                <Select.Option value={API_TYPE.OPTIONS}>OPTIONS</Select.Option>
                <Select.Option value={API_TYPE.PATCH}>PATCH</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="pattern"
              label="Đường dẫn"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập tên quyền!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Row gutter={8}>
              <Col xs={24} sm={12} lg={12}>
                <Form.Item name="shouldCheckPermission" valuePropName="checked">
                  <Checkbox>Check quyền</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={12}>
                <Form.Item name="isRequiredAccessToken" valuePropName="checked">
                  <Checkbox>Check token</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            {/* <Form.Item
              name="status"
              label="Trạng thái"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn trạng thái!",
                },
              ]}
            >
              <Select>
                <Select.Option value={API_STATUS.DRAFF}>
                  Bản nháp
                </Select.Option>
                <Select.Option value={API_STATUS.ACTIVE}>
                  Hoạt động
                </Select.Option>
              </Select>
            </Form.Item> */}
          </Form>
        </div>
      </Spin>
    </Modal>
  );
}
