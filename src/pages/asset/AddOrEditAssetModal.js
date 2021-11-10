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
  InputNumber,
} from "antd";
import { isEmpty } from "../../utils/helpers";
import {
  actionAddAsset,
  actionEditAsset,
  actionUploadAssetLink,
} from "./AssetAction";
import {
  ASSET_STATUS,
} from "../../utils/constants/config";
import { UploadOutlined } from "@ant-design/icons";
import { getUserList } from "../user/UserAction";

let timeoutSearchUser;

export default function AddOrEditAssetModal(props) {
  const { visible = true, onCancel, item = {} } = props;
  const isAddNew = isEmpty(item);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [lessonData, setUserData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearchUser);
    };
  }, []);

  useEffect(() => {
    if (item?.userIdLastUpdated) {
      handleFetchUserData("id", item?.userIdLastUpdated);
    } else {
      handleFetchUserData();
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
      const { data } = await actionUploadAssetLink(formData);
      console.log(data);
      form.setFieldsValue({ assetImg: data.data[0] || "" });
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  const handleFetchUserData = async (field, value) => {
    try {
      let rqParams = { page: 0, size: 50, query: "" };
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
      handleFetchUserData("userName", value);
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
            await actionAddAsset(values);
            message.success("Thêm quản lý tài sản thành công!");
          } else {
            await actionEditAsset(values, item?.id);
            message.success("Sửa quản lý tài sản thành công!");
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
      title={isAddNew ? "Thêm quản lý tài sản" : "Chỉnh sửa quản lý tài sản"}
      okText={isAddNew ? "Thêm" : "Lưu"}
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="600px"
      className="common-form-modal add-edit-asset-modal"
      centered
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      <Spin spinning={processing || uploading}>
        <div className="add-edit-asset-content">
          <Form
            form={form}
            layout="vertical"
            name="formAsset"
            initialValues={{ status: ASSET_STATUS.DRAFF, ...item }}
            hideRequiredMark
            size="large"
          >
            <Form.Item
              name="assetName"
              label="Tên quản lý tài sản"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập tên quản lý tài sản!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="assetImg"
              label="Hình ảnh"
              className="upload-asset-item"
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
              name="assetDescription"
              label="Mô tả"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="assetQuantity"
              label="Số lượng"
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="assetUnit"
              label="Đơn vị"
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="assetLocation"
              label="Vị trí"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="userIdLastUpdated"
              label="Người cập nhật cuối"
            >
              <Select
                showSearch
                placeholder="Tìm kiếm"
                filterOption={false}
                defaultActiveFirstOption={true}
                onSearch={handleSearchUser}
              >
                {lessonData.map((it) => (
                  <Select.Option key={it.id} value={it.id}>
                    {it?.userName || ""}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="assetType"
              label="Loại"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="accountant"
              label="Kế toán viên"
            >
              <Input />
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
                <Select.Option value={ASSET_STATUS.DRAFF}>
                  Bản nháp
                </Select.Option>
                <Select.Option value={ASSET_STATUS.ACTIVE}>
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
