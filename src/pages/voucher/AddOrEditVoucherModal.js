import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Spin,
  message,
  Select,
  InputNumber,
  DatePicker,
} from "antd";
import { isEmpty } from "../../utils/helpers";
import { actionAddVoucher, actionEditVoucher } from "./VoucherAction";
import { getCourseList } from "../course/CourseAction";
import { VOUCHER_STATUS } from "../../utils/constants/config";
import moment from "moment";

let timeoutSearchCourse;

export default function AddOrEditVoucherModal(props) {
  const { visible = true, onCancel, item = {}, profile } = props;
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
    if (item?.courseIdApply) {
      handleFetchCourseData("id", item?.courseIdApply);
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
    form.setFieldsValue({ userIdApply: profile?.id });
    form
      .validateFields()
      .then(async (values) => {
        try {
          setProcessing(true);
          if (isAddNew) {
            await actionAddVoucher(values);
            message.success("Thêm khuyến mãi thành công!");
          } else {
            await actionEditVoucher(values, item?.id);
            message.success("Sửa khuyến mãi thành công!");
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
  const onChangeTime = (value) => {
    form.setFieldsValue({ expiredTime: value });
  };

  return (
    <Modal
      visible={visible}
      title={isAddNew ? "Thêm khuyến mãi" : "Chỉnh sửa khuyến mãi"}
      okText={isAddNew ? "Thêm" : "Lưu"}
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="600px"
      className="common-form-modal add-edit-voucher-modal"
      centered
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      <Spin spinning={processing}>
        <div className="add-edit-voucher-content">
          <Form
            form={form}
            layout="vertical"
            name="formVoucher"
            initialValues={{
              status: VOUCHER_STATUS.DRAFF,
              ...item,
              expiredTime: moment(item?.expiredTime || new Date()),
            }}
            hideRequiredMark
            size="large"
          >
            <Form.Item name="courseIdApply" label="Khóa học áp dụng">
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
              name="voucherCode"
              label="Code khuyến mãi"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập code khuyến mãi!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="discount"
              label="Khuyến mãi(%)"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập khuyến mãi!",
                },
              ]}
            >
              <InputNumber min={0} max={100} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="expiredTime"
              label="Thời gian khuyến mãi"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập thời gian khuyến mãi!",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                onChange={onChangeTime}
                onOk={onChangeTime}
                allowClear={false}
              />
            </Form.Item>
            <Form.Item
              name="total"
              label="Số lượng khuyến mãi"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số lượng khuyến mãi!",
                },
              ]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            {/* <Form.Item name="remain" label="Số lượng còn lại">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item> */}
            <Form.Item name="noted" label="Ghi chú">
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="userIdApply"
              style={{ display: "none" }}
            ></Form.Item>
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
                <Select.Option value={VOUCHER_STATUS.DRAFF}>
                  Bản nháp
                </Select.Option>
                <Select.Option value={VOUCHER_STATUS.ACTIVE}>
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
