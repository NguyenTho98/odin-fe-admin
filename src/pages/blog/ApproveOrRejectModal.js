import React, { useState } from "react";
import { Modal, Spin, message, Button, Input, Form } from "antd";
import { actionApproveItem } from "./BlogAction";
import { ITEM_STATUS } from "../../utils/constants/config";

const TYPE = {
  APPROVE: "APPROVE",
  REJECT: "REJECT",
};
const ApproveOrRejectModal = (props) => {
  const {
    visible = true,
    onCancel,
    selectedRows = [],
    type = TYPE.APPROVE,
  } = props;
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);

  const handleOk = () => {
    if (processing) return;
    form
      .validateFields()
      .then(async (values) => {
        try {
          setProcessing(true);
          const ids = selectedRows
            .filter((it) => it.status === ITEM_STATUS.DRAFF)
            .map((it) => it.id);
          await actionApproveItem({
            blogIds: ids,
            status: type === TYPE.REJECT ? "REJECTED" : "ACTIVE",
            adComment: `${values.adComment || ""}`.trim(),
          });
          message.success(
            type === TYPE.REJECT ? "Đã từ chối!" : "Đã phê duyệt!"
          );
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
      title={type === TYPE.APPROVE ? "Phê duyệt" : "Từ chối"}
      onCancel={() => onCancel()}
      maskClosable={false}
      width="500px"
      className="common-form-modal"
      footer={[
        <Button
          className="btn-cancel"
          key="back"
          onClick={() => onCancel()}
          size="large"
        >
          Hủy bỏ
        </Button>,
        <Button
          className="btn-ok"
          key="ok"
          type="primary"
          danger={type === TYPE.REJECT}
          size="large"
          onClick={() => handleOk()}
        >
          {type === TYPE.APPROVE ? "Phê duyệt" : "Từ chối"}
        </Button>,
      ]}
    >
      <Spin spinning={processing}>
        <Form
          form={form}
          layout="vertical"
          name="formCourse"
          hideRequiredMark
          size="large"
        >
          <Form.Item name="adComment" label="Lý do">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ApproveOrRejectModal;
