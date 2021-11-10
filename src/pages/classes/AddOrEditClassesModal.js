import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Spin,
  message,
  Select,
  DatePicker,
  Checkbox
} from "antd";
import moment from "moment";
import { isEmpty } from "../../utils/helpers";
import {
  actionAddClasses,
  actionEditClasses,
} from "./ClassesAction";
import { getCenterList } from "../center/CenterAction";
import { getCourseList } from "../course/CourseAction";
// import { CLASSES_STATUS } from "../../utils/constants/config";
let timeoutSearchUser;

export default function AddOrEditClassesModal(props) {
  const { visible = true, onCancel, item = {} } = props;
  const isAddNew = isEmpty(item);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [centerData, setCenterData] = useState([]);
  const [courseData, setCourseData] = useState([]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearchUser);
    };
  }, []);

  const handleOk = () => {
    if (processing) return;
    form
      .validateFields()
      .then(async (values) => {
        try {
          const postData = {
            ...values,
            start_date: moment(values?.rangeDate[0])
              .startOf("day")
              .format("DD-MM-YYYY hh:mm:ss"),
            end_date: moment(values?.rangeDate[1])
              .endOf("day")
              .format("DD-MM-YYYY hh:mm:ss"),
          };
          setProcessing(true);
          if (isAddNew) {
            await actionAddClasses(postData);
            message.success("Thêm lớp học thành công!");
          } else {
            await actionEditClasses(postData, item?.id);
            message.success("Sửa lớp học thành công!");
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
    form.setFieldsValue({ classes: userTmp?.id || "" });
  };

  const handleFetchCourseData = async (field, value) => {
    try {
      let rqParams = { page: 0, size: 50, query: "" };
      if (field && value) {
        rqParams.query = isNaN(value)
          ? `${field}=="*${value}*"`
          : `${field}==${value}`;
      }

      const { data } = await getCourseList(rqParams);
      setCourseData(data?.results || []);
    } catch (error) {}
  };
  useEffect(() => {
    if (item?.classes) {
        handleFetchCourseData("id", item?.classes);
    } else {
        handleFetchCourseData();
    }
  }, [item]);
  const onChangeCourse = (value) => {
    const userTmp = courseData.find((item) => item.id === value);
    form.setFieldsValue({ classes: userTmp?.id || "" });
  };
 

  return (
    <Modal
      visible={visible}
      title={isAddNew ? "Thêm lớp học" : "Chỉnh sửa lớp học"}
      okText={isAddNew ? "Thêm" : "Lưu"}
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="600px"
      className="common-form-modal add-edit-classes-modal"
      classesed
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      <Spin spinning={processing}>
        <div className="add-edit-classes-content">
          <Form
            form={form}
            layout="vertical"
            name="formClasses"
            initialValues={{ ...item }}
            hideRequiredMark
            size="large"
          >
            <Form.Item name="name" label="Tên lớp học">
              <Input />
            </Form.Item>
            <Form.Item
              name="day_in_week"
              label="Lịch học"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng chọn lịch học!",
                },
              ]}
            >
              <Select>
                <Select.Option value="1">
                  Thứ 2-5
                </Select.Option>
                <Select.Option value="2">
                  Thứ 3-6
                </Select.Option>
                <Select.Option value="3">
                  Thứ 4-7
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="rangeDate"
              label="Thời gian học"
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
            <Form.Item name="classes_order_no" label="classes_order_no">
              <Input />
            </Form.Item>
            <Form.Item name="waiting_flag" valuePropName="checked">
              <Checkbox>Lớp chờ</Checkbox>
            </Form.Item>
            <Form.Item
              name="centre"
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

            <Form.Item
              name="course"
              label="Khóa học"
            //   rules={[
            //     {
            //       required: true,
            //       message: "Vui lòng chọn nhân viên sales!",
            //     },
            //   ]}
            >
              <Select
                showSearch
                placeholder="Tìm kiếm khóa học"
                filterOption={false}
                defaultActiveFirstOption={true}
                onChange={onChangeCourse}
              >
                {courseData.map((it) => (
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
                <Select.Option value={CLASSES_STATUS.DRAFF}>
                  Bản nháp
                </Select.Option>
                <Select.Option value={CLASSES_STATUS.ACTIVE}>
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
