import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Spin, message, Select } from "antd";
import { isEmpty } from "../../utils/helpers";
import { actionAddSession, actionEditSession } from "./SessionAction";
import { SESSION_STATUS, SESSION_TYPE } from "../../utils/constants/config";
import { getLessonList } from "../lesson/LessonAction";

let timeoutSearchLesson;

export default function AddOrEditSessionModal(props) {
  const { visible = true, onCancel, item = {} } = props;
  const isAddNew = isEmpty(item);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [lessonData, setLessonData] = useState([]);
  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearchLesson);
    };
  }, []);

  useEffect(() => {
    if (item?.lessonId) {
      handleFetchLessonData("id", item?.lessonId);
    } else {
      handleFetchLessonData();
    }
  }, [item]);

  const handleFetchLessonData = async (field, value) => {
    try {
      let rqParams = { page: 0, size: 50, query: "" };
      if (field && value) {
        rqParams.query = isNaN(value)
          ? `${field}=="*${value}*"`
          : `${field}==${value}`;
      }

      const { data } = await getLessonList(rqParams);
      setLessonData(data?.data || []);
    } catch (error) {}
  };

  const handleSearchSession = (value) => {
    clearTimeout(timeoutSearchLesson);
    timeoutSearchLesson = setTimeout(() => {
      handleFetchLessonData("lessonName", value);
    }, 300);
  };
  const handleOk = () => {
    if (processing) return;
    form
      .validateFields()
      .then(async (values) => {
        try {
          setProcessing(true);
          if (isAddNew) {
            await actionAddSession(values);
            message.success("Thêm học phần thành công!");
          } else {
            await actionEditSession(values, item?.id);
            message.success("Sửa học phần thành công!");
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
      title={isAddNew ? "Thêm học phần" : "Chỉnh sửa học phần"}
      okText={isAddNew ? "Thêm" : "Lưu"}
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="600px"
      className="common-form-modal add-edit-session-modal"
      centered
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      <Spin spinning={processing}>
        <div className="add-edit-session-content">
          <Form
            form={form}
            layout="vertical"
            name="formSession"
            initialValues={{ status: SESSION_STATUS.DRAFF, ...item }}
            hideRequiredMark
            size="large"
          >
            <Form.Item
              name="lessonId"
              label="Bài học"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn bài học!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Tìm kiếm bài học"
                filterOption={false}
                defaultActiveFirstOption={true}
                onSearch={handleSearchSession}
              >
                {lessonData.map((it) => (
                  <Select.Option key={it.id} value={it.id}>
                    {it?.lessonName || ""}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="sessionName"
              label="Tên học phần"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập tên học phần!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="sessionType"
              label="Thể loại"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng chọn thể loại!",
                },
              ]}
            >
              <Select>
                <Select.Option value={SESSION_TYPE.SELFSTUDY}>
                  SELF STUDY
                </Select.Option>
                <Select.Option value={SESSION_TYPE.INSTRUCTOR}>
                  INSTRUCTOR
                </Select.Option>
                <Select.Option value={SESSION_TYPE.DISCUSSION}>
                  DISCUSSION
                </Select.Option>
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
                <Select.Option value={SESSION_STATUS.DRAFF}>
                  Bản nháp
                </Select.Option>
                <Select.Option value={SESSION_STATUS.ACTIVE}>
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
