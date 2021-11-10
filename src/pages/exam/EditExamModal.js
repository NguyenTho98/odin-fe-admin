import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Spin, message, Select } from "antd";
import { actionEditExam } from "./ExamAction";
import { getCourseList } from "../course/CourseAction";
import { ITEM_STATUS, EXAM_TYPE } from "../../utils/constants/config";

let timeoutSearchCourse;

export default function EditExamModal(props) {
  const { visible = true, onCancel, item = {} } = props;
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [courseData, setCourseData] = useState([]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearchCourse);
    };
  }, []);

  useEffect(() => {
    if (item?.courseId) {
      handleFetchCourseData("id", item?.courseId);
    } else {
      handleFetchCourseData();
    }
  }, [item]);

  const handleFetchCourseData = async (field, value) => {
    try {
      let rqParams = { page: 0, size: 50, query: "" };
      if (field && value) {
        rqParams.query = isNaN(value)
          ? `${field}=="*${value}*"`
          : `${field}==${value}`;
      }

      const { data } = await getCourseList(rqParams);
      setCourseData(data?.data || []);
    } catch (error) {}
  };

  const handleSearchCourse = (value) => {
    clearTimeout(timeoutSearchCourse);
    timeoutSearchCourse = setTimeout(() => {
      handleFetchCourseData("courseName", value);
    }, 300);
  };

  const handleOk = () => {
    if (processing) return;
    form
      .validateFields()
      .then(async (values) => {
        try {
          setProcessing(true);

          await actionEditExam(values, item?.id);
          message.success("Sửa bài thi thành công!");

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
      title="Chỉnh sửa bài thi"
      okText="Lưu"
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="600px"
      className="common-form-modal edit-exam-modal"
      centered
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      <Spin spinning={processing}>
        <div className="edit-exam-content">
          <Form
            form={form}
            layout="vertical"
            name="formEditExam"
            initialValues={{ status: ITEM_STATUS.DRAFF, ...item }}
            hideRequiredMark
            size="large"
          >
            <Form.Item
              name="examName"
              label="Tên bài thi"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập tên bài thi!",
                },
              ]}
            >
              <Input placeholder="Nhập tên bài thi" />
            </Form.Item>

            <Form.Item
              name="courseId"
              label="Khóa học"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn khóa học!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Chọn khóa học"
                filterOption={false}
                defaultActiveFirstOption={true}
                onSearch={handleSearchCourse}
              >
                {courseData.map((it) => (
                  <Select.Option key={it.id} value={it.id}>
                    {it?.courseName || ""}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="examType"
              label="Thể loại"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn thể loại!",
                },
              ]}
            >
              <Select>
                <Select.Option value={EXAM_TYPE.INPUT}>Đầu vào</Select.Option>
                <Select.Option value={EXAM_TYPE.MID_TERM}>
                  Giữa kỳ
                </Select.Option>
                <Select.Option value={EXAM_TYPE.OUTPUT}>Đầu ra</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
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
                <Select.Option value={ITEM_STATUS.DRAFF}>
                  Bản nháp
                </Select.Option>
                <Select.Option value={ITEM_STATUS.ACTIVE}>
                  Hoạt động
                </Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </Modal>
  );
}
