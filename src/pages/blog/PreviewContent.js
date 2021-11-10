import React, { useEffect, useState } from "react";
import { Modal, Spin, message, Button, Input, Form } from "antd";
import { connect } from "react-redux";
import { hasRole, isEmpty } from "../../utils/helpers";
import { actionApproveItem } from "./BlogAction";
import TinyEditor from "../../components/tinyEditor";
import { ITEM_STATUS, ROLES } from "../../utils/constants/config";

const PreviewContent = (props) => {
  const { visible = true, onCancel, item = {}, profile } = props;
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!isEmpty(item)) {
      setContent(item.content || "");
    }
  }, [item]);

  const handleOk = (isRejected) => {
    if (processing || !item?.id) return;
    form
      .validateFields()
      .then(async (values) => {
        try {
          setProcessing(true);
          await actionApproveItem({
            blogIds: [item.id],
            status: isRejected ? "REJECTED" : "ACTIVE",
            adComment: `${values.adComment || ""}`.trim(),
          });
          message.success(isRejected ? "Đã từ chối!" : "Đã phê duyệt!");
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

  const disableApproveBtn = () => {
    return (
      item?.status !== ITEM_STATUS.DRAFF ||
      !hasRole(profile, [ROLES.CONTENT_ADMIN, ROLES.SUPER_ADMIN])
    );
  };

  return (
    <Modal
      visible={visible}
      title={"Nội dung"}
      onCancel={() => onCancel()}
      maskClosable={false}
      width="100%"
      className="common-form-modal preview-content-modal"
      footer={[
        <Button
          className="btn-ok"
          key="submit"
          type="primary"
          onClick={handleOk}
          size="large"
          disabled={disableApproveBtn()}
        >
          Phê duyệt
        </Button>,
        <Button
          className="btn-ok"
          key="link"
          type="primary"
          danger
          size="large"
          disabled={disableApproveBtn()}
          onClick={() => handleOk(true)}
        >
          Từ chối
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
          initialValues={{ adComment: item?.adComment || "" }}
        >
          <Form.Item label="Nội dung">
            <TinyEditor
              value={content}
              isDisabled={true}
              hideMenubar={true}
              hideToolbar={true}
            />
          </Form.Item>
          <Form.Item name="adComment" label="Lý do">
            <Input.TextArea readOnly={disableApproveBtn()} />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default connect(
  (state) => ({
    profile: state.system.profile,
  }),
  {}
)(PreviewContent);
