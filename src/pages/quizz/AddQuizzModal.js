import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Spin,
  message,
  Select,
  Row,
  Col,
  Divider,
  Button,
  Tooltip,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { actionAddQuizz } from "./QuizzAction";
import { actionAddQuizzQuestion } from "../quizzquestion/QuizzQuestionAction";
import { getSessionList } from "../session/SessionAction";
import {
  ITEM_STATUS,
  QUIZZ_TYPE,
  QUESTION_TYPE,
} from "../../utils/constants/config";
import { groupQuestions } from "../../utils/helpers";

let timeoutSearchSession;

export default function AddExamModal(props) {
  const { visible = true, onCancel } = props;
  const [form] = Form.useForm();
  const [formQuestion] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [sessionData, setSessionData] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutSearchSession);
    };
  }, []);

  useEffect(() => {
    handleFetchSessionData();
  }, []);

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

  const addQuizzSuccess = () => {
    message.success("Thêm quizz thành công!");
    setProcessing(false);
    onCancel(true);
  };

  const handleAddQuestions = (quizzId, qsValues) => {
    const questions = groupQuestions(qsValues);
    const promises = [];
    Object.keys(questions).forEach((key, idx) => {
      promises.push(
        actionAddQuizzQuestion({
          ...questions[key],
          orderInQuizz: idx || 0,
          quizzId,
        })
      );
    });
    Promise.allSettled(promises)
      .then((result) => {
        console.log(result);
        addQuizzSuccess();
      })
      .catch((error) => {
        console.log(error);
        addQuizzSuccess();
      });
  };

  const handleOk = () => {
    if (processing) return;
    form
      .validateFields()
      .then(async (values) => {
        if (questionList.filter((it) => it !== -1).length > 0) {
          formQuestion
            .validateFields()
            .then(async (qsValues) => {
              try {
                setProcessing(true);
                const { data = {} } = await actionAddQuizz(values);
                const quizzId = data?.data?.id;
                if (quizzId) {
                  handleAddQuestions(quizzId, qsValues);
                } else {
                  addQuizzSuccess();
                }
              } catch (error) {
                setProcessing(false);
              }
            })
            .catch((error) => {
              console.log("Validate Question Failed:", error);
            });
        } else {
          try {
            setProcessing(true);
            await actionAddQuizz(values);
            message.success("Thêm quizz thành công!");

            setProcessing(false);
            onCancel(true);
          } catch (error) {
            setProcessing(false);
          }
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const onAddQuestion = () => {
    const tempQuestions = [...questionList];
    tempQuestions.push(questionList.length);
    setQuestionList(tempQuestions);
  };

  useEffect(() => {
    if (questionList.length > 0) {
      setForceUpdate(1 - forceUpdate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionList?.length]);

  const onDeleteQuestion = (qsIdx) => {
    const tempQuestions = [...questionList];
    tempQuestions[qsIdx] = -1;
    setQuestionList(tempQuestions);
  };

  const getQuestionType = (idx) => {
    return formQuestion.getFieldValue(`${idx}_type`);
  };

  return (
    <Modal
      visible={visible}
      title="Thêm Quizz"
      okText="Thêm"
      cancelText="Hủy bỏ"
      onCancel={() => onCancel()}
      onOk={handleOk}
      maskClosable={false}
      width="100%"
      style={{ maxWidth: "998px" }}
      className="common-form-modal add-quizz-modal"
      centered
      okButtonProps={{ className: "btn-ok", size: "large" }}
      cancelButtonProps={{ className: "btn-cancel", size: "large" }}
    >
      <Spin spinning={processing}>
        <div className="add-quizz-content">
          <Form
            form={form}
            layout="vertical"
            name="formAddQuizz"
            initialValues={{ status: ITEM_STATUS.DRAFF }}
            hideRequiredMark
            size="large"
          >
            <Row gutter={8}>
              <Col xs={24} sm={12} lg={6}>
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
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
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
              </Col>
              <Col xs={24} sm={12} lg={6}>
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
                    <Select.Option value={QUIZZ_TYPE.FIRST}>
                      Đầu bài
                    </Select.Option>
                    <Select.Option value={QUIZZ_TYPE.MID}>
                      Giữa bài
                    </Select.Option>
                    <Select.Option value={QUIZZ_TYPE.END}>
                      Cuối bài
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
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
              </Col>
            </Row>
            <Row>Danh sách câu hỏi:</Row>
          </Form>
          <Divider />
          <div className="question-content">
            <div className="qs-title">Danh sách câu hỏi:</div>
            <Form
              form={formQuestion}
              layout="vertical"
              name="formQuestion"
              hideRequiredMark
              size="large"
              preserve={false}
            >
              <Row gutter={48} className="question-list">
                {questionList
                  .filter((it) => it !== -1)
                  .map((qs, idx) => (
                    <Col key={qs} xs={24} sm={24} className="question-item">
                      <div className="qs-number">
                        <span>{`Câu số ${idx + 1}:`}</span>
                        <Tooltip title="Xóa">
                          <DeleteOutlined
                            className="delete-qs-icon"
                            onClick={() => onDeleteQuestion(qs)}
                          />
                        </Tooltip>
                      </div>
                      <Row gutter={16}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name={`${qs}_type`}
                            label="Loại câu hỏi"
                            initialValue={QUESTION_TYPE[0]}
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: "Vui lòng chọn loại câu hỏi!",
                              },
                            ]}
                          >
                            <Select
                              onChange={() => {
                                setForceUpdate(1 - forceUpdate);
                              }}
                            >
                              {QUESTION_TYPE.map((qsType, idx) => (
                                <Select.Option key={idx} value={qsType}>
                                  {qsType}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name={`${qs}_status`}
                            label="Trạng thái"
                            initialValue={ITEM_STATUS.DRAFF}
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
                        </Col>
                      </Row>
                      <Form.Item
                        name={`${qs}_question`}
                        label="Câu hỏi"
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Vui lòng chọn nhập câu hỏi!",
                          },
                        ]}
                      >
                        <Input.TextArea autoSize />
                      </Form.Item>
                      {getQuestionType(qs) !== "TEXT" && (
                        <Row gutter={16}>
                          <Col xs={24} sm={12}>
                            <Form.Item
                              name={`${qs}_optionA`}
                              label="Đáp án A"
                              rules={[
                                {
                                  required: true,
                                  whitespace: true,
                                  message: "Vui lòng chọn nhập đáp án!",
                                },
                              ]}
                            >
                              <Input.TextArea autoSize />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12}>
                            <Form.Item
                              name={`${qs}_optionB`}
                              label="Đáp án B"
                              rules={[
                                {
                                  required: true,
                                  whitespace: true,
                                  message: "Vui lòng chọn nhập đáp án!",
                                },
                              ]}
                            >
                              <Input.TextArea autoSize />
                            </Form.Item>
                          </Col>
                          {(getQuestionType(qs) === "MULTI_CHOICE_3" ||
                            getQuestionType(qs) === "MULTI_CHOICE_4" ||
                            getQuestionType(qs) === "RADIO") && (
                            <Col xs={24} sm={12}>
                              <Form.Item
                                name={`${qs}_optionC`}
                                label="Đáp án C"
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message: "Vui lòng chọn nhập đáp án!",
                                  },
                                ]}
                              >
                                <Input.TextArea autoSize />
                              </Form.Item>
                            </Col>
                          )}
                          {(getQuestionType(qs) === "MULTI_CHOICE_4" ||
                            getQuestionType(qs) === "RADIO") && (
                            <Col xs={24} sm={12}>
                              <Form.Item
                                name={`${qs}_optionD`}
                                label="Đáp án D"
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message: "Vui lòng chọn nhập đáp án!",
                                  },
                                ]}
                              >
                                <Input.TextArea autoSize />
                              </Form.Item>
                            </Col>
                          )}
                        </Row>
                      )}
                      <Form.Item
                        name={`${qs}_answer`}
                        label="Đáp án đúng"
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Vui lòng chọn nhập đáp án đúng!",
                          },
                        ]}
                      >
                        <Input.TextArea autoSize />
                      </Form.Item>
                    </Col>
                  ))}
              </Row>
            </Form>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddQuestion}
            >
              Thêm câu hỏi
            </Button>
          </div>
        </div>
      </Spin>
    </Modal>
  );
}
