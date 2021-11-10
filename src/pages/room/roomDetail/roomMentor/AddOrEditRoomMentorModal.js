import React, { useEffect, useState } from "react";
import { Modal, Form, Spin, message, Select } from "antd";
import {
  actionAddRoomMentors,
  getRoomMentors,
  actionUpdateRoomMentors,
} from "./RoomMentorAction";
import { isEmpty } from "../../../../utils/helpers";

const USER_POSITION = ["TEACHER", "SUPPORTER", "SALER"];

export default function AddOrEditRoomMentorModal(props) {
  const { visible = true, onCancel, roomId, item } = props;
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [userData, setUserData] = useState([]);
  const isAddNew = isEmpty(item);

  useEffect(() => {
    handleGetUsersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetUsersData = async () => {
    try {
      const { data } = await getRoomMentors();
      setUserData(data?.data || []);
    } catch (error) {}
  };

  const handleOk = () => {
    if (processing) return;
    form
      .validateFields()
      .then(async (values) => {
        try {
          if (isAddNew) {
            await actionAddRoomMentors({ ...values, roomId: roomId });
            message.success("Thêm giảng viên thành công!");
          } else {
            await actionUpdateRoomMentors(values, {
              userId: item?.id,
              roomId: roomId,
            });
            message.success("Sửa giảng viên thành công!");
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
      title={isAddNew ? "Thêm giảng viên" : "Sửa giảng viên"}
      okText={isAddNew ? "Thêm" : "Lưu"}
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
            initialValues={
              !isAddNew ? { userIds: [item?.id], position: item?.position } : {}
            }
          >
            <Form.Item
              name="userIds"
              label="Giảng viên"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn giảng viên!",
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn giảng viên"
                disabled={!isAddNew}
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
            <Form.Item
              name="position"
              label="Chức vụ"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn chức vụ!",
                },
              ]}
            >
              <Select placeholder="Chọn chức vụ">
                {USER_POSITION.map((pos) => (
                  <Select.Option key={pos} value={pos}>
                    {pos}
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
