import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Spin,
  Select,
  message,
  InputNumber,
} from "antd";
import { isEmpty } from "../../utils/helpers";
import {
  actionAddClassRoom,
  actionEditClassRoom,
} from "./ClassRoomAction";
import { getCenterList } from "../center/CenterAction";
// import { CLASSROOM_STATUS } from "../../utils/constants/config";
let timeoutSearchUser;

export default function AddOrEditClassRoomModal(props) {
  const { visible = true, onCancel, item = {} } = props;
  const isAddNew = isEmpty(item);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [centerData, setCenterData] = useState([]);
  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearchUser);
    };
  }, []);
  const handleFetchCenterData = async (field, value) => {
    try {
      let rqParams = { page: 0, size: 50, query: "" };
      if (field && value) {
        rqParams.query = isNaN(value)
          ? `${field}=="*${value}*"`
          : `${field}==${value}`;
      }

      const { data } = await getCenterList(rqParams);
      setCenterData(data?.results || []);
    } catch (error) {}
  };
  useEffect(() => {
    if (item?.center) {
        handleFetchCenterData("id", item?.center);
    } else {
        handleFetchCenterData();
    }
  }, [item]);
  const onChangeCenter = (value) => {
    const userTmp = centerData.find((item) => item.id === value);
    form.setFieldsValue({ center: userTmp?.id || "" });
  };

  const handleOk = () => {
    if (processing) return;
    form
      .validateFields()
      .then(async (values) => {
        try {
          setProcessing(true);
          if (isAddNew) {
            await actionAddClassRoom(values);
            message.success("Thêm phòng học thành công!");
          } else {
            await actionEditClassRoom(values, item?.id);
            message.success("Sửa phòng học thành công!");
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
      title={isAddNew ? "Thêm phòng học" : "Chỉnh sửa phòng học"}
      okText={isAddNew ? "Thêm" : "Lưu"}
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="600px"
      className="common-form-modal add-edit-classRoom-modal"
      classRoomed
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      <Spin spinning={processing}>
        <div className="add-edit-classRoom-content">
          <Form
            form={form}
            layout="vertical"
            name="formClassRoom"
            initialValues={{ ...item }}
            hideRequiredMark
            size="large"
          >
           
            <Form.Item name="name" label="Tên phòng học">
              <Input />
            </Form.Item>
            
            <Form.Item name="address" label="Địa chỉ" st>
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="size" label="Số ghế">
              <InputNumber style={{ width: "100%"}} />
            </Form.Item>
            
            <Form.Item
              name="classes"
              label="Trung tâm"
            //   rules={[
            //     {
            //       required: true,
            //       message: "Vui lòng chọn nhân viên sales!",
            //     },
            //   ]}
            >
              <Select
                showSearch
                placeholder="Tìm kiếm trung tâm"
                filterOption={false}
                defaultActiveFirstOption={true}
                onChange={onChangeCenter}
              >
                {centerData.map((it) => (
                  <Select.Option key={it.id} value={it.id}>
                    {it?.name || ""}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* <Form.Item
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
                <Select.Option value={CLASSROOM_STATUS.DRAFF}>
                  Bản nháp
                </Select.Option>
                <Select.Option value={CLASSROOM_STATUS.ACTIVE}>
                  Hoạt động
                </Select.Option>
              </Select>
            </Form.Item> */}
          </Form>
        </div>
      </Spin>
    </Modal>
  );
}
