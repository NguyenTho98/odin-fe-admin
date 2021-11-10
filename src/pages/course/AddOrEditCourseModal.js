import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Spin,
  message,
  InputNumber,
} from "antd";
import { isEmpty } from "../../utils/helpers";
import {
  actionAddCourse,
  actionEditCourse,
} from "./CourseAction";
// import { COURSE_STATUS } from "../../utils/constants/config";
let timeoutSearchUser;

export default function AddOrEditCourseModal(props) {
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
            await actionAddCourse(values);
            message.success("Thêm khóa học thành công!");
          } else {
            await actionEditCourse(values, item?.id);
            message.success("Sửa khóa học thành công!");
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
      title={isAddNew ? "Thêm khóa học" : "Chỉnh sửa khóa học"}
      okText={isAddNew ? "Thêm" : "Lưu"}
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="600px"
      className="common-form-modal add-edit-course-modal"
      courseed
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      <Spin spinning={processing}>
        <div className="add-edit-course-content">
          <Form
            form={form}
            layout="vertical"
            name="formCourse"
            initialValues={{ ...item }}
            hideRequiredMark
            size="large"
          >
            <Form.Item name="name" label="Tên khóa học">
              <Input />
            </Form.Item>
            <Form.Item name="cost" label="Giá gốc">
              <InputNumber style={{ width: "100%"}} />
            </Form.Item>
            <Form.Item name="night_cost" label="Giá ca ngày">
              <InputNumber style={{ width: "100%"}} />
            </Form.Item>
            <Form.Item name="daytime_cost" label="Giá ca tối">
              <InputNumber style={{ width: "100%"}} />
            </Form.Item>
            <Form.Item name="study_shift_count" label="Số buổi học">
              <InputNumber style={{ width: "100%"}} />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
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
                <Select.Option value={COURSE_STATUS.DRAFF}>
                  Bản nháp
                </Select.Option>
                <Select.Option value={COURSE_STATUS.ACTIVE}>
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
