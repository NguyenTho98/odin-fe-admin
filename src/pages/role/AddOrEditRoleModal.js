import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Spin, Select, message } from "antd";
import { isEmpty } from "../../utils/helpers";
import {
  actionAddRole,
  actionEditRole,
  actionGetDetailRole,
} from "./RoleAction";
import { getApiList } from "../api/ApiAction";
import { ROLE_STATUS } from "../../utils/constants/config";

let timeoutSearchApi;
export default function AddEditRoleModal(props) {
  const { visible = true, onCancel, item = {} } = props;
  const isAddNew = isEmpty(item);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    handleFetchApiData();
  }, []);

  useEffect(() => {
    if (item?.id) {
      getRoleDetail(item?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const getRoleDetail = async (roleId) => {
    try {
      const { data } = await actionGetDetailRole(roleId);
      const dataRole = data?.data?.listApi || [];
      const permissionIds = dataRole.map((item) => item.id);
      form.setFieldsValue({ listApiIds: permissionIds || [] });
    } catch (error) {}
  };

  const handleFetchApiData = async (field, value) => {
    try {
      let rqParams = { page: 0, size: 999, query: "" };
      if (field && value) {
        rqParams.query = isNaN(value)
          ? `${field}=="*${value}*"`
          : `${field}==${value}`;
      }

      const { data } = await getApiList(rqParams);
      setApiData(data?.data || []);
    } catch (error) {}
  };

  const handleSearchApi = (value) => {
    clearTimeout(timeoutSearchApi);
    timeoutSearchApi = setTimeout(() => {
      handleFetchApiData("name", value);
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
            await actionAddRole(values);
            message.success("Thêm vai trò thành công!");
          } else {
            await actionEditRole(values, item?.id);
            message.success("Sửa vai trò thành công!");
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
      title={isAddNew ? "Thêm vai trò" : "Chỉnh sửa vai trò"}
      okText={isAddNew ? "Thêm" : "Lưu"}
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="600px"
      className="common-form-modal add-edit-role-modal"
      centered
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      <Spin spinning={processing}>
        <div className="add-edit-role-content">
          <Form
            form={form}
            layout="vertical"
            name="formRole"
            initialValues={{ status: ROLE_STATUS.DRAFF, ...item }}
            hideRequiredMark
            size="large"
          >
            <Form.Item
              name="roleName"
              label="Tên vai trò"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập tên vai trò!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="listApiIds"
              label="Định danh"
              className="permission-item"
              rules={[
                {
                  required: true,
                  message: "Vui lòng định danh!",
                },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                placeholder="Tìm định danh"
                filterOption={false}
                defaultActiveFirstOption={true}
                onSearch={handleSearchApi}
              >
                {apiData.map((it) => (
                  <Select.Option key={it.id} value={it.id}>
                    {it?.name || ""}
                  </Select.Option>
                ))}
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
                <Select.Option value={ROLE_STATUS.DRAFF}>
                  Bản nháp
                </Select.Option>
                <Select.Option value={ROLE_STATUS.ACTIVE}>
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
