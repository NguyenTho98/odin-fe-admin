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
  InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { isEmpty } from "../../utils/helpers";
import {
  actionAddSlide,
  actionEditSlide,
  actionUploadSlideAvatar,
} from "./SlideAction";
import { SLIDE_STATUS } from "../../utils/constants/config";

let timeoutSearchMaterial;

export default function AddOrEditSlideModal(props) {
  const { visible = true, onCancel, item = {}, idMaterial } = props;
  const isAddNew = isEmpty(item);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearchMaterial);
    };
  }, []);

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
      const { data } = await actionUploadSlideAvatar(formData);
      console.log(data.data);
      form.setFieldsValue({ slideAvatar: data.data[0] || "" });
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
            values.materialId = idMaterial;
            await actionAddSlide(values);
            message.success("Thêm slide thành công!");
          } else {
            await actionEditSlide(values, item?.id);
            message.success("Sửa slide thành công!");
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
      title={isAddNew ? "Thêm slide" : "Chỉnh sửa slide"}
      okText={isAddNew ? "Thêm" : "Lưu"}
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="600px"
      className="common-form-modal add-edit-slide-modal"
      centered
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      <Spin spinning={processing || uploading}>
        <div className="add-edit-slide-content">
          <Form
            form={form}
            layout="vertical"
            name="formSlide"
            initialValues={{ status: SLIDE_STATUS.DRAFF, ...item }}
            hideRequiredMark
            size="large"
          >
            <Form.Item
              name="slideAvatar"
              label="Ảnh"
              className="upload-slide-item"
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
            <Form.Item name="slideDetail" label="Mô tả">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="orderInMaterial" label="Thứ tự slide">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="slideNote" label="Ghi chú">
              <Input.TextArea />
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
                <Select.Option value={SLIDE_STATUS.DRAFF}>
                  Bản nháp
                </Select.Option>
                <Select.Option value={SLIDE_STATUS.ACTIVE}>
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
