import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Spin, message, Select, InputNumber } from "antd";
import { isEmpty } from "../../utils/helpers";
import { actionAddOrder, actionEditOrder } from "./OrderAction";
import { getUserList } from "../user/UserAction";
import { ORDERS_STATUS } from "../../utils/constants/config";
let timeoutSearchUser;

export default function AddOrEditOrderModal(props) {
  const { visible = true, onCancel, item = {} } = props;
  const isAddNew = isEmpty(item);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearchUser);
    };
  }, []);

  useEffect(() => {
    if (item?.userId) {
      handleFetchUserData("id", item?.userId);
    } else {
      handleFetchUserData();
    }
  }, [item]);

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
      handleFetchUserData("fullName", value);
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
            await actionAddOrder(values);
            message.success("Thêm đơn hàng thành công!");
          } else {
            await actionEditOrder(values, item?.id);
            message.success("Sửa đơn hàng thành công!");
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
  const onChangeUser = (value) => {
    const userTmp = userData.find((item) => item.id === value);
    form.setFieldsValue({ fullName: userTmp?.fullName || "" });
  };

  return (
    <Modal
      visible={visible}
      title={isAddNew ? "Thêm đơn hàng" : "Chỉnh sửa đơn hàng"}
      okText={isAddNew ? "Thêm" : "Lưu"}
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="600px"
      className="common-form-modal"
      centered
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      <Spin spinning={processing}>
        <div className="add-edit-order-content">
          <Form
            form={form}
            layout="vertical"
            name="formOrder"
            initialValues={{ status: ORDERS_STATUS.PENDING, ...item }}
            hideRequiredMark
            size="middle"
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
                onChange={onChangeUser}
              >
                {userData.map((it) => (
                  <Select.Option key={it.id} value={it.id}>
                    {it?.fullName || ""}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="totalPrice"
              label="Đơn giá"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số tiền!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item
              name="promotionPrice"
              label="Thanh toán"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số tiền!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item name="payments" label="Hình thức thanh toán">
              <Input />
            </Form.Item>
            <Form.Item name="note" label="Ghi chú">
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
                <Select.Option value={ORDERS_STATUS.PENDING}>
                  Chờ phê duyệt
                </Select.Option>
                <Select.Option value={ORDERS_STATUS.DONE}>
                  Xác nhận đơn hàng
                </Select.Option>
                <Select.Option value={ORDERS_STATUS.REJECTED}>
                  Hủy đơn hàng
                </Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </Modal>
  );
}
