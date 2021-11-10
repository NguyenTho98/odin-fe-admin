import React, { useState, useEffect } from "react";
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
import { isEmpty } from "../../utils/helpers";
import {
  actionAddAssignment,
  actionEditAssignment,
  actionUploadAssignmentLink,
} from "./AssignmentAction";
import {
  ASSIGNMENT_STATUS,
  ASSIGNMENT_TYPE,
} from "../../utils/constants/config";
import { getLessonList } from "../lesson/LessonAction";
import { UploadOutlined } from "@ant-design/icons";

let timeoutSearchLesson;

export default function AddOrEditAssignmentModal(props) {
  const { visible = true, onCancel, item = {} } = props;
  const isAddNew = isEmpty(item);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [lessonData, setLessonData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);

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

  useEffect(() => {
    if ((fileList || []).length > 0) {
      handleUploadFile(fileList[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileList]);

  const handleUploadFile = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("files", file);
      const { data } = await actionUploadAssignmentLink(formData);
      console.log(data);
      form.setFieldsValue({ assignmentLink: data.data[0] || "" });
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

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

  const handleSearchAssignment = (value) => {
    clearTimeout(timeoutSearchLesson);
    timeoutSearchLesson = setTimeout(() => {
      handleFetchLessonData("lessonName", value);
    }, 300);
  };
  const handleOk = () => {
    if (processing || uploading) return;
    form
      .validateFields()
      .then(async (values) => {
        try {
          setProcessing(true);
          if (isAddNew) {
            await actionAddAssignment(values);
            message.success("Thêm bài tập thành công!");
          } else {
            await actionEditAssignment(values, item?.id);
            message.success("Sửa bài tập thành công!");
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
    accept: "application/pdf",
    beforeUpload(file) {
      const fileType = file.type;
      const isJpgOrPng = fileType === "application/pdf";
      if (!isJpgOrPng) {
        message.error("Bạn chỉ có thể tải lên file có định dạng PDF!");
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
      title={isAddNew ? "Thêm bài tập" : "Chỉnh sửa bài tập"}
      okText={isAddNew ? "Thêm" : "Lưu"}
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="600px"
      className="common-form-modal add-edit-assignment-modal"
      centered
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      <Spin spinning={processing || uploading}>
        <div className="add-edit-assignment-content">
          <Form
            form={form}
            layout="vertical"
            name="formAssignment"
            initialValues={{ status: ASSIGNMENT_STATUS.DRAFF, ...item }}
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
                onSearch={handleSearchAssignment}
              >
                {lessonData.map((it) => (
                  <Select.Option key={it.id} value={it.id}>
                    {it?.lessonName || ""}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="assignmentTitle"
              label="Tên bài tập"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập tên bài tập!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="assignmentLink"
              label="File PDF bài tập"
              className="upload-assignment-item"
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
              name="assignmentType"
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
                <Select.Option value={ASSIGNMENT_TYPE.NORMAL}>
                  NORMAL
                </Select.Option>
                <Select.Option value={ASSIGNMENT_TYPE.ADVANCE}>
                  ADVANCE
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
                <Select.Option value={ASSIGNMENT_STATUS.DRAFF}>
                  Bản nháp
                </Select.Option>
                <Select.Option value={ASSIGNMENT_STATUS.ACTIVE}>
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
