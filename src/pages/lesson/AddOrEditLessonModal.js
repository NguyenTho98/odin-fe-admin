import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Spin,
  message,
  Select,
  Button,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { isEmpty } from "../../utils/helpers";
import {
  actionAddLesson,
  actionEditLesson,
  actionUploadLessonAvatar,
} from "./LessonAction";
import { getCourseList } from "../course/CourseAction";
import { LESSON_STATUS, LESSON_TYPE } from "../../utils/constants/config";

let timeoutSearchCourse;

export default function AddOrEditLessonModal(props) {
  const { visible = true, onCancel, item = {} } = props;
  const isAddNew = isEmpty(item);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [courseData, setCourseData] = useState([]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearchCourse);
    };
  }, []);

  useEffect(() => {
    if ((fileList || []).length > 0) {
      handleUploadFile(fileList[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileList]);

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

  const handleUploadFile = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("files", file);
      const { data } = await actionUploadLessonAvatar(formData);
      console.log(data);
      form.setFieldsValue({ lessonAvatar: data.data[0] || "" });
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  const handleOk = () => {
    if (processing || uploading) return;
    form
      .validateFields()
      .then(async (values) => {
        try {
          setProcessing(true);
          if (isAddNew) {
            await actionAddLesson(values);
            message.success("Thêm bài học thành công!");
          } else {
            await actionEditLesson(values, item?.id);
            message.success("Sửa bài học thành công!");
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

  const propsUpload = {
    name: "files",
    showUploadList: false,
    fileList: fileList,
    accept: "image/png, image/jpeg",
    beforeUpload(file) {
      const fileType = file.type;
      const isJpgOrPng =
        fileType === "image/jpeg" ||
        fileType === "image/jpg" ||
        fileType === "image/png";

      if (!isJpgOrPng) {
        message.error("Bạn chỉ có thể tải lên file có định dạng JPG/PNG!");
      }

      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        message.error("Phải phải nhỏ hơn 20MB!");
      }

      if (isJpgOrPng && isLt20M) {
        setFileList([file]);
      }

      return false;
    },
  };

  return (
    <Modal
      visible={visible}
      title={isAddNew ? "Thêm bài học" : "Chỉnh sửa bài học"}
      okText={isAddNew ? "Thêm" : "Lưu"}
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="600px"
      className="common-form-modal add-edit-lesson-modal"
      centered
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      <Spin spinning={processing || uploading}>
        <div className="add-edit-lesson-content">
          <Form
            form={form}
            layout="vertical"
            name="formLesson"
            initialValues={{ status: LESSON_STATUS.DRAFF, ...item }}
            hideRequiredMark
            size="large"
          >
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
                placeholder="Tìm kiếm khóa học"
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
              name="lessonName"
              label="Tên bài học"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập tên bài học!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lessonDescription"
              label="Mô tả"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập tên bài học!",
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="lessonType"
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
                <Select.Option value={LESSON_TYPE.KNOWLEDGE}>
                  Knowledge
                </Select.Option>
                <Select.Option value={LESSON_TYPE.PRACTICE}>
                  Practice
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="lessonAvatar"
              label="Ảnh bài học"
              className="upload-lesson-item"
            >
              <Input
                addonAfter={
                  <Upload {...propsUpload} showUploadList={false}>
                    <Button icon={<UploadOutlined />} type="link" size="small">
                      Tải lên
                    </Button>
                  </Upload>
                }
              />
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
                <Select.Option value={LESSON_STATUS.DRAFF}>
                  Bản nháp
                </Select.Option>
                <Select.Option value={LESSON_STATUS.ACTIVE}>
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
