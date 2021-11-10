import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Button, Input, message, Spin, Upload, Select, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { PageHeader } from "../../components";
import { routes } from "../../utils/constants/config";
import { actionUploadFile } from "../system/systemAction";
import { actionAddBlog, actionGetCategories } from "./BlogAction";
import TinyEditor from "../../components/tinyEditor";
import "./Blog.scss";

const AddBlog = (props) => {
  const { history } = props;
  const [isProcessing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if ((fileList || []).length > 0) {
      handleUploadFile(fileList[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileList]);

  useEffect(() => {
    handleGetCategories();
  }, []);

  const handleGetCategories = async () => {
    try {
      const { data } = await actionGetCategories();
      setCategories(data?.data || []);
    } catch (error) {}
  };

  const handleUploadFile = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("files", file);
      const { data } = await actionUploadFile(formData);
      form.setFieldsValue({ avatar: data.data[0] || "" });
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  const handleSubmit = async (values) => {
    if (isProcessing || uploading) return;

    try {
      setProcessing(true);
      await actionAddBlog({ ...values, content });
      message.success("Thêm bài viết thành công!");
      setProcessing(false);
      resetFieldData();
    } catch (error) {
      setProcessing(false);
    }
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

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 24 },
      lg: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 24 },
      lg: { span: 16 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 24,
        offset: 0,
      },
      md: {
        span: 24,
        offset: 0,
      },
      lg: { offset: 4, span: 16 },
    },
  };

  const resetFieldData = () => {
    setContent("");
    form.resetFields();
  };

  return (
    <div className="add-edit-blog-page common-page">
      <Spin spinning={isProcessing || uploading}>
        <PageHeader
          pageTitle={
            <div>
              <span
                className="back-to-page"
                onClick={() => {
                  history?.push(routes.BLOG);
                }}
              >{`Bài viết / `}</span>
              <span>Thêm bài viết</span>
            </div>
          }
        />

        <div className="add-edit-content">
          <Form
            {...formItemLayout}
            form={form}
            name="form"
            onFinish={handleSubmit}
            scrollToFirstError
            hideRequiredMark
            size="middle"
          >
            <Form.Item
              name="categoryId"
              label="Thể loại"
              // rules={[
              //   {
              //     required: true,
              //     message: "Vui lòng chọn thể loại!",
              //   },
              // ]}
            >
              <Select
                placeholder="Chọn thể loại"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {categories.map((it) => (
                  <Select.Option key={it.id} value={it.id}>
                    {it?.categoryName || ""}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="title"
              label="Tiêu đề"
              // rules={[
              //   {
              //     required: true,
              //     whitespace: true,
              //     message: "Vui lòng nhập tiêu đề!",
              //   },
              // ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea autoSize />
            </Form.Item>
            <Form.Item name="avatar" label="Hình ảnh">
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
            <Form.Item label="Nội dung">
              <TinyEditor
                height={200}
                value={content}
                onChangeValue={(value) => setContent(value)}
              />
            </Form.Item>
            <Form.Item {...tailFormItemLayout} className="action-group-btn">
              <Button type="primary" htmlType="submit" className="action-btn">
                Thêm
              </Button>
              <Button
                type="primary"
                ghost
                htmlType="button"
                className="action-btn"
                onClick={() => {
                  history?.push(routes.BLOG);
                }}
              >
                Hủy bỏ
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </div>
  );
};

export default withRouter(AddBlog);
