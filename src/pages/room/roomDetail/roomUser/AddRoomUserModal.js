import React, { useEffect, useState } from "react";
import { Modal, Form, Spin, message, Select } from "antd";
import { actionAddRoomUsers, getRoomUsers } from "./RoomUserAction";

export default function AddRoomUserModal(props) {
  const { visible = true, onCancel, roomId } = props;
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    if (roomId) {
      handleGetUsersData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const handleGetUsersData = async () => {
    try {
      const { data } = await getRoomUsers({ roomId });
      setUserData(data?.data || []);
    } catch (error) {}
  };

  const handleOk = () => {
    if (processing) return;
    form
      .validateFields()
      .then(async (values) => {
        try {
          await actionAddRoomUsers({ ...values, roomId: roomId });
          message.success("Thêm học viên thành công!");
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
      title="Thêm học viên"
      okText="Thêm"
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="600px"
      className="common-form-modal add-room-user"
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      <Spin spinning={processing}>
        <div className="add-room-user-content">
          <Form
            form={form}
            layout="vertical"
            name="formRoomUser"
            hideRequiredMark
            size="large"
          >
            <Form.Item
              name="userIds"
              label="Học viên"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn học viên!",
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn học viên"
                filterOption={(input, option) => {
                  return (
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
              >
                {userData.map((it) => (
                  <Select.Option key={it.id} value={it.id}>
                    {it?.fullName || ""}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </Modal>
  );
}
