import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Spin,
  message,
  Select,
  Button,
  Upload,
  Rate,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { actionUpdateMentor, actionGetMentorDetail } from "./MentorAction";
import { ITEM_STATUS, routes } from "../../utils/constants/config";
import { actionUploadFile } from "../system/systemAction";
import TinyEditor from "../../components/tinyEditor";
import { PageHeader } from "../../components";
import { getUserList } from "../user/UserAction";
import "./Mentor.scss";

let timeoutSearchUser;

const EditMentor = (props) => {
  const { match, history } = props;
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [introduction, setIntroduction] = useState("");
  const [isDisableSave, setDisableSave] = useState(true);
  const [mentorDetail, setMentorDetail] = useState({});

  useEffect(() => {
    if ((fileList || []).length > 0) {
      handleUploadFile(fileList[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileList]);

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearchUser);
    };
  }, []);

  useEffect(() => {
    if (mentorDetail?.userId) {
      handleFetchUserData("id", mentorDetail?.userId);
    }
  }, [mentorDetail]);

  useEffect(() => {
    if (match?.params?.mentorId) {
      handleFetchDetail(match?.params?.mentorId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match]);

  const handleFetchDetail = async (id) => {
    try {
      const { data } = await actionGetMentorDetail(id);
      const mentorData = data?.data[0] || {};
      setMentorDetail(mentorData);
      setDisableSave(false);
      setIntroduction(mentorData.introduction || "");
      form.setFieldsValue(mentorData);
    } catch (error) {}
  };

  const handleFetchUserData = async (field, value) => {
    try {
      let rqParams = { page: 0, size: 1, query: "" };
      if (field && value) {
        rqParams.query = isNaN(value)
          ? `${field}=="*${value}*"`
          : `${field}==${value}`;
      }

      const { data } = await getUserList(rqParams);
      setUserData(data?.data || []);
    } catch (error) {}
  };

  const handleSearchUser = (value) => {
    clearTimeout(timeoutSearchUser);
    timeoutSearchUser = setTimeout(() => {
      handleFetchUserData("fullName", value);
    }, 300);
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
    if (processing || uploading) return;
    try {
      setProcessing(true);
      await actionUpdateMentor(
        { ...values, introduction },
        match?.params?.mentorId
      );
      message.success("Sửa giảng viên thành công!");
      setProcessing(false);
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

  return (
    <div className="add-edit-mentor-page common-page">
      <Spin spinning={processing || uploading}>
        <PageHeader
          pageTitle={
            <div>
              <span
                className="back-to-page"
                onClick={() => {
                  history?.push(routes.MENTOR);
                }}
              >{`Giảng viên / `}</span>
              <span>Sửa giảng viên</span>
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
            initialValues={{ status: ITEM_STATUS.DRAFF }}
          >
            <Form.Item
              name="userId"
              label="Tài khoản"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn tài khoản!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Tìm kiếm tài khoản"
                filterOption={false}
                defaultActiveFirstOption={true}
                onSearch={handleSearchUser}
                disabled
              >
                {userData.map((it) => (
                  <Select.Option key={it.id} value={it.id}>
                    {it?.fullName || ""}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="avt_img"
              label="Ảnh giảng viên"
              className="upload-mentor-item"
              rules={[
                {
                  type: "url",
                  message: "Không đúng định dạng!",
                },
              ]}
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
              name="video_url"
              label="Video giới thiệu"
              rules={[
                {
                  type: "url",
                  message: "Không đúng định dạng!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="fullName"
              label="Tên giảng viên"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập tên giảng viên!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  type: "email",
                  message: "Vui lòng nhập đúng định dạng E-mail!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                {
                  pattern: new RegExp(
                    /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
                  ),
                  message: "Vui lòng nhập đúng định dạng!",
                },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="job" label="Nghề nghiệp">
              <Input />
            </Form.Item>
            <Form.Item name="language" label="Ngôn ngữ">
              <Input />
            </Form.Item>

            <Form.Item name="stars" label="Đánh giá">
              <Rate />
            </Form.Item>
            <Form.Item label="Giá tiền" style={{ marginBottom: 0 }}>
              <Form.Item
                name="min"
                style={{ display: "inline-block", width: "calc(50% - 8px)" }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá tiền thấp nhất!",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Giá thấp nhất"
                />
              </Form.Item>
              <Form.Item
                name="max"
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                  margin: "0 8px",
                }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá tiền cao nhất!",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Giá cao nhất"
                />
              </Form.Item>
            </Form.Item>

            <Form.Item name="totalBookings" label="Số lượt đặt trước">
              <InputNumber min={0} max={5} style={{ width: "100%" }} />
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
            <Form.Item label="Giới thiệu">
              <TinyEditor
                value={introduction}
                onChangeValue={(value) => setIntroduction(value)}
                height={250}
              />
            </Form.Item>
            <Form.Item {...tailFormItemLayout} className="action-group-btn">
              <Button
                type="primary"
                htmlType="submit"
                className="action-btn"
                disabled={isDisableSave}
              >
                Sửa
              </Button>
              <Button
                type="primary"
                ghost
                htmlType="button"
                className="action-btn"
                onClick={() => {
                  history?.push(routes.MENTOR);
                }}
              >
                Quay lại
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </div>
  );
};

export default withRouter(EditMentor);
