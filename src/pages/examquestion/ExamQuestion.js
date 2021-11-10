import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Tag, Button, Pagination } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { TableCellActions } from "../../components";
import { hasPermission, isEmpty } from "../../utils/helpers";
import {
  actionDeleteExamQuestion,
  actionGetExamQuestions,
} from "./ExamQuestionAction";
import AddOrEditExamQuestionModal from "./AddOrEditExamQuestionModal";
import "./ExamQuestion.scss";
import { EXAM_QUESTION_STATUS } from "../../utils/constants/config";
import { permission } from "../../utils/constants/permission";

let params = {
  page: 1,
  size: 10,
  query: "",
};

const ExamQuestion = (props) => {
  const { profile = {}, idExam = "" } = props;
  const [processing, setProcessing] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [examQuestions, setExamQuestions] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [filteredStatus, setFilteredStatus] = useState([]);
  const [searchData] = useState({});

  useEffect(() => {
    return () => {
      params = {
        page: 1,
        size: 10,
        query: "",
      };
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(profile)) {
      params.query = `examId==${idExam}`;
      handleFetchExamQuestion(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchExamQuestion = async (params = {}) => {
    try {
      setIsFetching(true);
      const { data } = await actionGetExamQuestions({
        ...params,
        page: params.page - 1,
      });
      setIsFetching(false);
      setExamQuestions(data);
    } catch (error) {
      setIsFetching(true);
    }
  };

  const handleDeleteExamQuestion = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteExamQuestion(id);
      handleFetchExamQuestion(params);
      message.success("Xóa câu hỏi thành công!");
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
    }
  };

  const handleEditItem = (items = {}) => {
    setSelectedItem(items);
    setVisibleModal(true);
  };

  const columns = [
    {
      title: "Câu hỏi",
      dataIndex: "question",
      key: "question",
    },
    {
      title: "Câu trả lời",
      dataIndex: "options",
      key: "options",
      render: (_, record) => (
        <div>
          {record?.optionA && <div>{`A. ${record?.optionA}`}</div>}
          {record?.optionB && <div>{`B. ${record?.optionB}`}</div>}
          {record?.optionC && <div>{`C. ${record?.optionC}`}</div>}
          {record?.optionD && <div>{`D. ${record?.optionD}`}</div>}
        </div>
      ),
    },
    {
      title: "Đáp án đúng",
      dataIndex: "answer",
      key: "answer",
    },
    {
      title: "Loại câu hỏi",
      dataIndex: "type",
      key: "type",
      sorter: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "150px",
      sorter: true,
      filterMultiple: false,
      filteredValue: filteredStatus,
      filters: [
        {
          text: "Active",
          value: EXAM_QUESTION_STATUS.ACTIVE,
        },
        {
          text: "Draff",
          value: EXAM_QUESTION_STATUS.DRAFF,
        },
      ],
      render: (status) => (
        <Tag
          color={status === EXAM_QUESTION_STATUS.ACTIVE ? "success" : "warning"}
          className="cell-status"
        >
          {status || ""}
        </Tag>
      ),
    },
  ];

  if (
    hasPermission(profile, [permission.examQuestion_update]) ||
    hasPermission(profile, [permission.examQuestion_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [
            permission.examQuestion_update,
          ])}
          isHasPermissonDelete={hasPermission(profile, [
            permission.examQuestion_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteExamQuestion(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa câu hỏi này?"
        />
      ),
    });
  }

  const handleOnChangeTable = (_, filters, sorter) => {
    setFilteredStatus([...(filters?.status || [])]);
    const searchContent = isEmpty(searchData)
      ? ""
      : `${searchData.type}=="${searchData.value}"`;

    if (!(filters?.status || []).length) {
      params = { ...params, page: 1, query: searchContent };
    } else if ((filters?.status || []).length > 0) {
      params = {
        ...params,
        page: 1,
        query:
          `status=="${filters?.status[0]}"` +
          (searchContent ? `;${searchContent}` : ""),
      };
    }
    //change sorter
    if (sorter?.order) {
      if (sorter.order === "ascend") {
        params.sort = sorter.field;
        params.direction = "ASC";
      } else {
        params.sort = sorter.field;
        params.direction = "DESC";
      }
    } else {
      delete params.sort;
      delete params.direction;
    }
    handleFetchExamQuestion(params);
  };

  return (
    <div className="examQuestion-page">
      <Table
        className="table-content"
        columns={columns}
        dataSource={examQuestions?.data || []}
        loading={isFetching || processing}
        pagination={false}
        title={() => (
          <div className="table-header">
            <div className="table-title">Danh sách câu hỏi</div>
            {hasPermission(profile, [permission.examQuestion_add]) && (
              <Button
                className="btn-add-question"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setVisibleModal(true)}
              >
                Thêm
              </Button>
            )}
          </div>
        )}
        rowKey={(record) => record?.id}
        onChange={handleOnChangeTable}
        size="small"
      />
      {examQuestions?.page?.total_elements > 0 && (
        <Pagination
          size="small"
          className="pagination-table"
          defaultCurrent={params.page}
          defaultPageSize={params.size}
          total={examQuestions?.page?.total_elements || 0}
          showSizeChanger
          showQuickJumper
          showLessItems
          showTotal={(total) => `Tổng số ${total} phần tử`}
          onChange={(page, size) => {
            params = { ...params, page: page, size: size };
            handleFetchExamQuestion(params);
          }}
        />
      )}
      {visibleModal && (
        <AddOrEditExamQuestionModal
          visible={visibleModal}
          idExam={idExam}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchExamQuestion(params);
            }
            setSelectedItem({});
            setVisibleModal(false);
          }}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default connect(
  (state) => ({
    profile: state.system?.profile,
    examQuestions: state.examQuestion?.examQuestions,
    isFetching: state.examQuestion?.isFetching,
  }),
  { actionGetExamQuestions }
)(withRouter(ExamQuestion));
