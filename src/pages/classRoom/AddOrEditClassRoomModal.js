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
import { getClassesList } from "../classes/ClassesAction";
// import { CLASSROOM_STATUS } from "../../utils/constants/config";
let timeoutSearchUser;

export default function AddOrEditClassRoomModal(props) {
  const { visible = true, onCancel, item = {} } = props;
  const isAddNew = isEmpty(item);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [classesData, setClassesData] = useState([]);
  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearchUser);
    };
  }, []);
  const handleFetchClassesData = async (field, value) => {
    try {
      let rqParams = { page: 0, size: 50, query: "" };
      if (field && value) {
        rqParams.query = isNaN(value)
          ? `${field}=="*${value}*"`
          : `${field}==${value}`;
      }

      const { data } = await getClassesList(rqParams);
      setClassesData(data?.results || []);
    } catch (error) {}
  };
  useEffect(() => {
    if (item?.classes) {
        handleFetchClassesData("id", item?.classes);
    } else {
        handleFetchClassesData();
    }
  }, [item]);
  const onChangeClasses = (value) => {
    const userTmp = classesData.find((item) => item.id === value);
    form.setFieldsValue({ classes: userTmp?.id || "" });
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
              label="Lớp học"
            //   rules={[
            //     {
            //       required: true,
            //       message: "Vui lòng chọn nhân viên sales!",
            //     },
            //   ]}
            >
              <Select
                showSearch
                placeholder="Tìm kiếm lớp học"
                filterOption={false}
                defaultActiveFirstOption={true}
                onChange={onChangeClasses}
              >
                {classesData.map((it) => (
                  <Select.Option key={it.id} value={it.id}>
                    {it?.id || ""}
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
