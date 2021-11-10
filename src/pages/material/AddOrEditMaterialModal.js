import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Spin,
  message,
  Select,
  Upload,
  Button,
} from "antd";
import { isEmpty } from "../../utils/helpers";
import {
  actionAddMaterial,
  actionEditMaterial,
  actionUploadMaterialUrl,
} from "./MaterialAction";
import { MATERIAL_STATUS, MATERIAL_TYPE } from "../../utils/constants/config";
import { getSessionList } from "../session/SessionAction";
import { UploadOutlined } from "@ant-design/icons";

let timeoutSearchSession;

export default function AddOrEditMaterialModal(props) {
  const { visible = true, onCancel, item = {} } = props;
  const isAddNew = isEmpty(item);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [sessionData, setSessionData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [type, setType] = useState(0);
  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearchSession);
    };
  }, []);

  useEffect(() => {
    if (item?.sessionId) {
      handleFetchSessionData("id", item?.sessionId);
    } else {
      handleFetchSessionData();
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
      const { data } = await actionUploadMaterialUrl(formData);
      console.log(data);
      form.setFieldsValue({ materialUrl: data.data[0] || "" });
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };
  const propsUpload = {
    name: "files",
    showUploadList: false,
    fileList: fileList,
    accept: `${type === 1 ? "application/pdf" : "video/mp4"}`,
    beforeUpload(file) {
      const fileType = file.type;
      let isJpgOrPng;
      if (type === 1) {
        isJpgOrPng = fileType === "application/pdf";
      } else {
        isJpgOrPng = fileType === "video/mp4";
      }
      if (!isJpgOrPng) {
        message.error(
          `Bạn chỉ có thể tải lên file có định dạng ${
            type === 1 ? "PDF" : "VIDEO"
          }!`
        );
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

  const handleFetchSessionData = async (field, value) => {
    try {
      let rqParams = { page: 0, size: 50, query: "" };
      if (field && value) {
        rqParams.query = isNaN(value)
          ? `${field}=="*${value}*"`
          : `${field}==${value}`;
      }

      const { data } = await getSessionList(rqParams);
      setSessionData(data?.data || []);
    } catch (error) {}
  };

  const handleSearchSession = (value) => {
    clearTimeout(timeoutSearchSession);
    timeoutSearchSession = setTimeout(() => {
      handleFetchSessionData("sessionName", value);
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
            await actionAddMaterial(values);
            message.success("Thêm học liệu thành công!");
          } else {
            await actionEditMaterial(values, item?.id);
            message.success("Sửa học liệu thành công!");
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
      title={isAddNew ? "Thêm học liệu" : "Chỉnh sửa học liệu"}
      okText={isAddNew ? "Thêm" : "Lưu"}
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="600px"
      className="common-form-modal add-edit-material-modal"
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
      centered
    >
      <Spin spinning={processing || uploading}>
        <div className="add-edit-material-content">
          <Form
            form={form}
            layout="vertical"
            name="formMaterial"
            initialValues={{
              status: MATERIAL_STATUS.DRAFF,
              materialType: MATERIAL_TYPE.VIDEO,
              ...item,
            }}
            hideRequiredMark
            size="large"
          >
            <Form.Item
              name="sessionId"
              label="Học phần"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn học phần!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Tìm kiếm học phần"
                filterOption={false}
                defaultActiveFirstOption={true}
                onSearch={handleSearchSession}
              >
                {sessionData.map((it) => (
                  <Select.Option key={it.id} value={it.id}>
                    {it?.sessionName || ""}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="materialName"
              label="Tên học liệu"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập tên học liệu!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="materialType"
              label="Thể loại"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng chọn thể loại!",
                },
              ]}
            >
              <Select
                onChange={(value) =>
                  setType(
                    value === MATERIAL_TYPE.VIDEO
                      ? 0
                      : value === MATERIAL_TYPE.PDF
                      ? 1
                      : 2
                  )
                }
              >
                <Select.Option value={MATERIAL_TYPE.VIDEO}>VIDEO</Select.Option>
                <Select.Option value={MATERIAL_TYPE.PDF}>PDF</Select.Option>
                <Select.Option value={MATERIAL_TYPE.SLIDE}>SLIDE</Select.Option>
              </Select>
            </Form.Item>
            {type !== 2 ? (
              <Form.Item
                name="materialUrl"
                label="Upload học liệu"
                className="upload-material-item"
              >
                <Input
                  addonAfter={
                    <Upload {...propsUpload} showUploadList={false}>
                      <Button
                        icon={<UploadOutlined />}
                        type="link"
                        size="small"
                      >
                        Tải lên
                      </Button>
                    </Upload>
                  }
                />
              </Form.Item>
            ) : (
              ""
            )}
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
                <Select.Option value={MATERIAL_STATUS.DRAFF}>
                  Bản nháp
                </Select.Option>
                <Select.Option value={MATERIAL_STATUS.ACTIVE}>
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
