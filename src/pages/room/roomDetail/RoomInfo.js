import React, { useEffect } from "react";
import { isEmpty } from "../../../utils/helpers";
import { Col, Row, Form, Input, Button, Tooltip } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import moment from "moment";
import { routes } from "../../../utils/constants/config";

const RoomInfo = (props) => {
  const roomDetail = props.item;
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isEmpty(roomDetail)) {
      form.setFieldsValue({
        ...roomDetail,
        startDate: roomDetail.startDate
          ? moment(roomDetail.startDate).format("DD/MM/YYYY")
          : "",
        endDate: roomDetail.endDate
          ? moment(roomDetail.endDate).format("DD/MM/YYYY")
          : "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomDetail]);

  return (
    <div className="room-info">
      <Form form={form} colon={false} layout="vertical">
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24} lg={8}>
            <Form.Item name="roomName" label="Phòng học">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} lg={8}>
            <Form.Item name="courseName" label="Khóa học">
              <Input
                readOnly
                className="input-link"
                addonAfter={
                  <Tooltip title="Xem chi tiết khóa học">
                    <Button
                      className="btn-view-detail"
                      type="link"
                      onClick={() =>
                        props.history?.push(
                          `${routes.COURSES}/${roomDetail?.courseId}`
                        )
                      }
                      icon={<LinkOutlined />}
                    ></Button>
                  </Tooltip>
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} lg={8}>
            <Form.Item name="totalUser" label="Số lượng học viên">
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24} lg={8}>
            <Form.Item name="startDate" label="Ngày bắt đầu">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} lg={8}>
            <Form.Item name="endDate" label="Ngày kết thúc">
              <Input.TextArea readOnly autoSize />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} lg={8}>
            <Form.Item name="status" label="Trạng thái">
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24} lg={24}>
            <Form.Item name="roomDescription" label="Mô tả">
              <Input.TextArea readOnly autoSize />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default RoomInfo;
