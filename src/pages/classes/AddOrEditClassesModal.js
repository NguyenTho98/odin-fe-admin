import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Spin,
  message,
  Select,
  DatePicker,
  Checkbox,
  InputNumber
} from "antd";
import moment from "moment";
import { isEmpty } from "../../utils/helpers";
import {
  actionAddClasses,
  actionEditClasses,
} from "./ClassesAction";
import { getCenterList } from "../center/CenterAction";
import { getCourseList } from "../course/CourseAction";
import { getClassRoomList } from "../classRoom/ClassRoomAction";
import { getUserList } from "../user/UserAction";
// import { CLASSES_STATUS } from "../../utils/constants/config";
let timeoutSearchUser;

export default function AddOrEditClassesModal(props) {
  const { visible = true, onCancel, item = {} } = props;
  const isAddNew = isEmpty(item);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [checkTimeStart, setCheckTimeStart] = useState(false);
  const [centerData, setCenterData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [classRoomData, setClassRoomData] = useState([]);
  const [teacherData, setTeacherData] = useState([]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearchUser);
    };
  }, []);
  const handleChangeItem = (e) => {
    console.log("eeeee", );
  }
  const handleOk = () => {
    if (processing) return;
    form
      .validateFields()
      .then(async (values) => {
        try {
          const postData = {
            ...values,
            teachers: JSON.stringify(values.teachers),
            start_date: moment(values?.rangeDate).format("YYYY-MM-DDTHH:mm:ssZ"),
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
    if (item?.course) {
        handleFetchCourseData("id", item?.course);
    } else {
        handleFetchCourseData();
    }
  }, [item]);

  const onChangeCourse = (value) => {
    const userTmp = courseData.find((item) => item.id === value);
    form.setFieldsValue({ course: userTmp?.id || "" });
  };
 

  const handleFetchClassRoomData = async (field, value) => {
    try {
      let rqParams = { page: 0, size: 50, query: "" };
      if (field && value) {
        rqParams.query = isNaN(value)
          ? `${field}=="*${value}*"`
          : `${field}==${value}`;
      }

      const { data } = await getClassRoomList(rqParams);
      setClassRoomData(data?.results || []);
    } catch (error) {}
  };

  useEffect(() => {
    if (item?.classRoom) {
      handleFetchClassRoomData("id", item?.classRoom);
    } else {
      handleFetchClassRoomData();
    }
  }, [item]);
  
  const onChangeClassRoom = (value) => {
    const userTmp = classRoomData.find((item) => item.id === value);
    form.setFieldsValue({ classes: userTmp?.id || "" });
  };

  const handleFetchTeacherData = async (field, value) => {
    try {
      let rqParams = { page: 0, size: 50, query: "" };
      if (field && value) {
        rqParams.query = isNaN(value)
          ? `${field}=="*${value}*"`
          : `${field}==${value}`;
      }

      const { data } = await getUserList(rqParams);
      setTeacherData(data?.results || []);
    } catch (error) {}
  };

  useEffect(() => {
    if (item?.teachers) {
      handleFetchTeacherData("id", item?.teachers);
    } else {
      handleFetchTeacherData();
    }
  }, [item]);
  
  const onChangeTeacherRoom = (value) => {
    const userTmp = teacherData.find((item) => item.id === value);
    form.setFieldsValue({ teachers: userTmp?.id || "" });
  };
  // const handleSearchRole = (value) => {
  //   clearTimeout(timeoutSearchRole);
  //   timeoutSearchRole = setTimeout(() => {
  //     handleFetchRoleData("roleName", value);
  //   }, 300);
  // };
  // useEffect(async () => {
  //   if (item?.id) {
  //     const { data } = await actionGetDetailUser("id", item?.id);
  //     const dataRole = data?.data?.roles || [];
  //     const tmp = [];
  //     if (dataRole.length > 0) {
  //       dataRole.forEach((item) => {
  //         tmp.push(item.id);
  //       });
  //     }
  //     form.setFieldsValue({ roleIds: tmp });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [item]);

  return (
    <Modal
      visible={true}
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
            <Form.Item name="capacity" label="Số học viên">
              <InputNumber  style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="available" label="Số buổi học">
              <InputNumber  style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="schedule"
              label="Lịch học"
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
              name="Trạng thái lớp học"
              label="Ca học"
            >
              <Select>
                <Select.Option value="1">
                 Ca1
                </Select.Option>
                <Select.Option value="2">
                Ca2
                </Select.Option>
                <Select.Option value="3">
                Ca3
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="time"
              label="Ca học"
            >
              <Select>
                <Select.Option value="1">
                 Ca1
                </Select.Option>
                <Select.Option value="2">
                Ca2
                </Select.Option>
                <Select.Option value="3">
                Ca3
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="start_date" label="Ngày bắt đầu">
              <DatePicker disabledDate={d => d.isBefore(moment().day(-1), 'YYYY-MM-DD') }  style={{ width: "100%" }} format="DD/MM/YYYY"/>
            </Form.Item>
            <Form.Item name="end_date" label="Ngày kết thúc">
              <DatePicker disabled style={{ width: "100%" }} format="DD/MM/YYYY"/>
            </Form.Item>
             <Form.Item
              name="teachers"
              label="Giáo viên"
              // rules={[
              //   {
              //     required: true,
              //     message: "Vui lòng chọn quyền!",
              //   },
              // ]}
            >
              <Select
                mode="multiple"
                allowClear
                placeholder="Tìm kiếm giáo viên"
                filterOption={false}
                defaultActiveFirstOption={true}
                onSearch={handleFetchTeacherData}
              >
                {teacherData.map((it) => (
                  <Select.Option key={it.phone} value={it.phone}>
                    {it?.full_name || ""}
                  </Select.Option>
                ))}
              </Select>
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
            <Form.Item
              name="classroom"
              label="Phòng học"
            >
              <Select
                showSearch
                placeholder="Tìm kiếm phòng học"
                filterOption={false}
                defaultActiveFirstOption={true}
                onChange={onChangeClassRoom}
              >
                {classRoomData.map((it) => (
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
