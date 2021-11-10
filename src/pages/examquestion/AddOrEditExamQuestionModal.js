import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Spin, message, Select, Row, Col } from "antd";
import { isEmpty } from "../../utils/helpers";
import {
  actionAddExamQuestion,
  actionEditExamQuestion,
} from "./ExamQuestionAction";
import {
  EXAM_QUESTION_STATUS,
  EXAM_QUESTION_TYPE,
} from "../../utils/constants/config";

let timeoutSearchExam;

export default function AddOrEditExamQuestionModal(props) {
  const { visible = true, onCancel, item = {}, idExam } = props;
  const isAddNew = isEmpty(item);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [type, setType] = useState(EXAM_QUESTION_TYPE.MULTI_CHOICE_4);
  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearchExam);
    };
  }, []);

  const handleOk = () => {
    if (processing) return;
    form
      .validateFields()
      .then(async (values) => {
        try {
          setProcessing(true);
          if (isAddNew) {
            values.examId = idExam;
            await actionAddExamQuestion(values);
            message.success("Thêm bài tập thành công!");
          } else {
            await actionEditExamQuestion(values, item?.id);
            message.success("Sửa bài tập thành công!");
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

  const renderContent = () => {
    switch (type) {
      case EXAM_QUESTION_TYPE.MULTI_CHOICE_2:
        return (
          <React.Fragment>
            <Form.Item name="optionA" label="A">
              <Input.TextArea autoSize />
            </Form.Item>
            <Form.Item name="optionB" label="B">
              <Input.TextArea autoSize />
            </Form.Item>
          </React.Fragment>
        );
      case EXAM_QUESTION_TYPE.MULTI_CHOICE_3:
        return (
          <React.Fragment>
            <Row gutter={8}>
              <Col xs={24} sm={12} lg={12}>
                <Form.Item name="optionA" label="A">
                  <Input.TextArea autoSize />
                </Form.Item>
                <Form.Item name="optionB" label="B">
                  <Input.TextArea autoSize />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={12}>
                <Form.Item name="optionC" label="C">
                  <Input.TextArea autoSize />
                </Form.Item>
              </Col>
            </Row>
          </React.Fragment>
        );
      case EXAM_QUESTION_TYPE.MULTI_CHOICE_4 || EXAM_QUESTION_TYPE.RADIO:
        return (
          <React.Fragment>
            <Row gutter={8}>
              <Col xs={24} sm={12} lg={12}>
                <Form.Item name="optionA" label="A">
                  <Input.TextArea autoSize />
                </Form.Item>
                <Form.Item name="optionB" label="B">
                  <Input.TextArea autoSize />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={12}>
                <Form.Item name="optionC" label="C">
                  <Input.TextArea autoSize />
                </Form.Item>
                <Form.Item name="optionD" label="D">
                  <Input.TextArea autoSize />
                </Form.Item>
              </Col>
            </Row>
          </React.Fragment>
        );
      case EXAM_QUESTION_TYPE.TEXT:
        return;
      default:
        return (
          <React.Fragment>
            <Row gutter={8}>
              <Col xs={24} sm={12} lg={12}>
                <Form.Item name="optionA" label="A">
                  <Input.TextArea autoSize />
                </Form.Item>
                <Form.Item name="optionB" label="B">
                  <Input.TextArea autoSize />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={12}>
                <Form.Item name="optionC" label="C">
                  <Input.TextArea autoSize />
                </Form.Item>
                <Form.Item name="optionD" label="D">
                  <Input.TextArea autoSize />
                </Form.Item>
              </Col>
            </Row>
          </React.Fragment>
        );
    }
  };
  return (
    <Modal
      visible={visible}
      title={isAddNew ? "Thêm câu hỏi" : "Chỉnh sửa câu hỏi"}
      okText={isAddNew ? "Thêm" : "Lưu"}
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="100%"
      style={{ maxWidth: "998px" }}
      className="common-form-modal add-edit-examQuestion-modal"
      centered
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      <Spin spinning={processing}>
        <div className="add-edit-examQuestion-content">
          <Form
            form={form}
            layout="vertical"
            name="formExamQuestion"
            initialValues={{ status: EXAM_QUESTION_STATUS.DRAFF, ...item }}
            hideRequiredMark
            size="large"
          >
            <Form.Item
              name="type"
              label="Loại câu hỏi"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng chọn thể loại!",
                },
              ]}
            >
              <Select
                onChange={(value) => {
                  setType(value);
                }}
              >
                <Select.Option value={EXAM_QUESTION_TYPE.MULTI_CHOICE_2}>
                  MULTI_CHOICE_2
                </Select.Option>
                <Select.Option value={EXAM_QUESTION_TYPE.MULTI_CHOICE_3}>
                  MULTI_CHOICE_3
                </Select.Option>
                <Select.Option value={EXAM_QUESTION_TYPE.MULTI_CHOICE_4}>
                  MULTI_CHOICE_4
                </Select.Option>
                <Select.Option value={EXAM_QUESTION_TYPE.RADIO}>
                  RADIO
                </Select.Option>
                <Select.Option value={EXAM_QUESTION_TYPE.TEXT}>
                  TEXT
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="question" label="Câu hỏi">
              <Input.TextArea autoSize />
            </Form.Item>
            {renderContent()}
            <Form.Item name="answer" label="Đáp án đúng">
              <Input.TextArea autoSize />
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
                <Select.Option value={EXAM_QUESTION_STATUS.DRAFF}>
                  Bản nháp
                </Select.Option>
                <Select.Option value={EXAM_QUESTION_STATUS.ACTIVE}>
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
