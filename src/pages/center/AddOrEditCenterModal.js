import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Spin,
  message,
} from "antd";
import { isEmpty } from "../../utils/helpers";
import {
  actionAddCenter,
  actionEditCenter,
} from "./CenterAction";
// import { CENTER_STATUS } from "../../utils/constants/config";
let timeoutSearchUser;

export default function AddOrEditCenterModal(props) {
  const { visible = true, onCancel, item = {} } = props;
  const isAddNew = isEmpty(item);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearchUser);
    };
  }, []);

  const handleOk = () => {
    if (processing) return;
    form
      .validateFields()
      .then(async (values) => {
        try {
          setProcessing(true);
          if (isAddNew) {
            await actionAddCenter(values);
            message.success("Thêm trung tâm thành công!");
          } else {
            await actionEditCenter(values, item?.id);
            message.success("Sửa trung tâm thành công!");
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
      title={isAddNew ? "Thêm trung tâm" : "Chỉnh sửa trung tâm"}
      okText={isAddNew ? "Thêm" : "Lưu"}
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="600px"
      className="common-form-modal add-edit-center-modal"
      centered
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      <Spin spinning={processing}>
        <div className="add-edit-center-content">
          <Form
            form={form}
            layout="vertical"
            name="formCenter"
            initialValues={{ ...item }}
            hideRequiredMark
            size="large"
          >
              <Form.Item name="name" label="Tên trung tâm">
              <Input />
            </Form.Item>
            
            <Form.Item name="address" label="Địa chỉ">
              <Input.TextArea />
            </Form.Item>
            
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
                <Select.Option value={CENTER_STATUS.DRAFF}>
                  Bản nháp
                </Select.Option>
                <Select.Option value={CENTER_STATUS.ACTIVE}>
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
