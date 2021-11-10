import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Spin, message, Select, DatePicker } from "antd";
import moment from "moment";
import { isEmpty } from "../../utils/helpers";
import { actionAddRoom, actionEditRoom } from "./RoomAction";
import { getCourseList } from "../course/CourseAction";
import { ROOM_STATUS } from "../../utils/constants/config";

let timeoutSearchCourse;

export default function AddOrEditRoomModal(props) {
  const { visible = true, onCancel, item = {} } = props;
  const isAddNew = isEmpty(item);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [courseData, setCourseData] = useState([]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearchCourse);
    };
  }, []);

  useEffect(() => {
    if (item?.courseId) {
      handleFetchCourseData("id", item?.courseId);
    } else {
      handleFetchCourseData();
    }
  }, [item]);

  const handleFetchCourseData = async (field, value) => {
    try {
      let rqParams = { page: 0, size: 50, query: "" };
      if (field && value) {
        rqParams.query = isNaN(value)
          ? `${field}=="*${value}*"`
          : `${field}==${value}`;
      }

      const { data } = await getCourseList(rqParams);
      setCourseData(data?.data || []);
    } catch (error) {}
  };

  const handleSearchCourse = (value) => {
    clearTimeout(timeoutSearchCourse);
    timeoutSearchCourse = setTimeout(() => {
      handleFetchCourseData("courseName", value);
    }, 300);
  };

  const handleOk = () => {
    if (processing) return;
    form
      .validateFields()
      .then(async (values) => {
        try {
          const postData = {
            ...values,
            startDate: moment(values?.rangeDate[0])
              .startOf("day")
              .format("YYYY-MM-DDTHH:mm:ssZ"),
            endDate: moment(values?.rangeDate[1])
              .endOf("day")
              .format("YYYY-MM-DDTHH:mm:ssZ"),
          };
          delete postData.rangeDate;
          setProcessing(true);
          if (isAddNew) {
            await actionAddRoom(postData);
            message.success("Thêm phòng học thành công!");
          } else {
            await actionEditRoom(postData, item?.id);
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
      className="common-form-modal add-edit-room-modal"
      centered
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      <Spin spinning={processing}>
        <div className="add-edit-room-content">
          <Form
            form={form}
            layout="vertical"
            name="formRoom"
            initialValues={{
              status: ROOM_STATUS.DRAFF,
              ...item,
              rangeDate: [
                moment(item?.startDate || new Date()),
                moment(item?.endDate || new Date()),
              ],
            }}
            hideRequiredMark
            size="large"
          >
            <Form.Item
              name="courseId"
              label="Khóa học"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn khóa học!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Tìm kiếm khóa học"
                filterOption={false}
                defaultActiveFirstOption={true}
                onSearch={handleSearchCourse}
              >
                {courseData.map((it) => (
                  <Select.Option key={it.id} value={it.id}>
                    {it?.courseName || ""}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="roomName"
              label="Tên phòng học"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập tên phòng học!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="roomDescription"
              label="Mô tả"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập mô phòng học!",
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="rangeDate"
              label="Thời gian"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn khoảng thời gian lớp học!",
                },
              ]}
            >
              <DatePicker.RangePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                ranges={{
                  "Hôm nay": [moment(), moment()],
                  "Tuần này": [
                    moment().startOf("weeks"),
                    moment().endOf("weeks"),
                  ],
                  "Tháng này": [
                    moment().startOf("month"),
                    moment().endOf("month"),
                  ],
                  "Quý này": [
                    moment().startOf("quarters"),
                    moment().endOf("quarters"),
                  ],
                  "Năm nay": [
                    moment().startOf("years"),
                    moment().endOf("years"),
                  ],
                }}
              />
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
                <Select.Option value={ROOM_STATUS.DRAFF}>
                  Bản nháp
                </Select.Option>
                <Select.Option value={ROOM_STATUS.ACTIVE}>
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
