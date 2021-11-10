import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Spin, message, Select } from "antd";
import { actionEditQuizz } from "./QuizzAction";
import { getSessionList } from "../session/SessionAction";
import { ITEM_STATUS, QUIZZ_TYPE } from "../../utils/constants/config";

let timeoutSearchSession;

export default function EditQuizzModal(props) {
  const { visible = true, onCancel, item = {} } = props;
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [sessionData, setSessionData] = useState([]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearchSession);
    };
  }, []);

  useEffect(() => {
    if (item?.sessionId) {
      handleFetchSessionData("id", item?.sessionId);
    } else {
      handleFetchSessionData();
    }
  }, [item]);

  const handleFetchSessionData = async (field, value) => {
    try {
      let rqParams = { page: 0, size: 50, query: "" };
      if (field && value) {
        rqParams.query = isNaN(value)
          ? `${field}=="*${value}*"`
          : `${field}==${value}`;
      }

      const { data } = await getSessionList(rqParams);
      setSessionData(data?.data || []);
    } catch (error) {}
  };

  const handleSearchSession = (value) => {
    clearTimeout(timeoutSearchSession);
    timeoutSearchSession = setTimeout(() => {
      handleFetchSessionData("sessionName", value);
    }, 300);
  };

  const handleOk = () => {
    if (processing) return;
    form
      .validateFields()
      .then(async (values) => {
        try {
          setProcessing(true);

          await actionEditQuizz(values, item?.id);
          message.success("Sửa quizz thành công!");

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
      title="Chỉnh sửa câu hỏi"
      okText="Lưu"
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="600px"
      className="common-form-modal edit-quizz-modal"
      centered
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      <Spin spinning={processing}>
        <div className="edit-quizz-content">
          <Form
            form={form}
            layout="vertical"
            name="formEditQuizz"
            initialValues={{ status: ITEM_STATUS.DRAFF, ...item }}
            hideRequiredMark
            size="large"
          >
            <Form.Item
              name="quizzName"
              label="Tên câu hỏi"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập tên câu hỏi!",
                },
              ]}
            >
              <Input placeholder="Nhập tên câu hỏi" />
            </Form.Item>

            <Form.Item
              name="sessionId"
              label="Học phần"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn học phần!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Chọn học phần"
                filterOption={false}
                defaultActiveFirstOption={true}
                onSearch={handleSearchSession}
              >
                {sessionData.map((it) => (
                  <Select.Option key={it.id} value={it.id}>
                    {it?.sessionName || ""}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="quizzType"
              label="Thể loại"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn thể loại!",
                },
              ]}
            >
              <Select>
                <Select.Option value={QUIZZ_TYPE.FIRST}>Đầu bài</Select.Option>
                <Select.Option value={QUIZZ_TYPE.MID}>Giữa bài</Select.Option>
                <Select.Option value={QUIZZ_TYPE.END}>Cuối bài</Select.Option>
              </Select>
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
                <Select.Option value={ITEM_STATUS.DRAFF}>
                  Bản nháp
                </Select.Option>
                <Select.Option value={ITEM_STATUS.ACTIVE}>
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
