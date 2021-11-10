import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import { actionDeleteExam, actionGetExams } from "./ExamAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddExamModal from "./AddExamModal";
import EditExamModal from "./EditExamModal";
import "./Exam.scss";
import { ITEM_STATUS } from "../../utils/constants/config";
import ExamQuestion from "../examquestion/ExamQuestion";
import { permission } from "../../utils/constants/permission";

let params = {
  page: 1,
  size: 20,
  query: "",
};

const Exam = (props) => {
  const { profile = {}, actionGetExams, exams = {}, isFetching } = props;
  const [processing, setProcessing] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [filteredStatus, setFilteredStatus] = useState([]);
  const [searchData, setSearchData] = useState({});

  useEffect(() => {
    return () => {
      params = {
        page: 1,
        size: 20,
        query: "",
      };
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(profile)) {
      handleFetchData(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchData = (params = {}) => {
    actionGetExams({ ...params, page: params.page - 1 });
  };

  const handleDeleteLesson = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteExam(id);
      handleFetchData(params);
      message.success("Xóa bài thi thành công!");
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
    }
  };

  const handleEditItem = (items = {}) => {
    setSelectedItem(items);
    setVisibleEditModal(true);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "80px",
      sorter: true,
    },
    {
      title: "Tên bài thi",
      dataIndex: "examName",
      key: "examName",
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "examType",
      key: "examType",
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
          value: ITEM_STATUS.ACTIVE,
        },
        {
          text: "Draff",
          value: ITEM_STATUS.DRAFF,
        },
      ],
      render: (status) => (
        <Tag
          color={status === ITEM_STATUS.ACTIVE ? "success" : "warning"}
          className="cell-status"
        >
          {status || ""}
        </Tag>
      ),
    },
  ];

  if (
    hasPermission(profile, [permission.exam_update]) ||
    hasPermission(profile, [permission.exam_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [
            permission.exam_update,
          ])}
          isHasPermissonDelete={hasPermission(profile, [
            permission.exam_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteLesson(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa bài thi này?"
        />
      ),
    });
  }

  const handleSearch = useCallback(
    (type, value) => {
      const status =
        filteredStatus.length > 0 ? `status=="${filteredStatus[0]}"` : "";
      if (!value) {
        params = { ...params, page: 1, query: status };
        setSearchData({});
      } else {
        setSearchData({ type, value });
        params = {
          ...params,
          page: 1,
          query: `${type}=="${value}"`.trim() + (status ? `;${status}` : ""),
        };
      }

      handleFetchData(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const handleAddNew = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const searchFields = useMemo(() => {
    return [{ label: "Tên bài thi", value: "examName" }];
  }, []);

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
    handleFetchData(params);
  };

  const expandedRowRender = (props) => {
    return <ExamQuestion idExam={props.id} />;
  };

  return (
    <div className="exam-page common-page">
      <div className="exam-content">
        <PageHeader pageTitle="Bài thi" />
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
          onAction={handleAddNew}
          isHasPermissonAdd={hasPermission(profile, [permission.exam_add])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={exams?.data || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
          expandable={{
            expandedRowRender,
          }}
        />
        {exams?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={exams?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchData(params);
            }}
          />
        )}
      </div>
      {visibleModal && (
        <AddExamModal
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchData(params);
            }
            setSelectedItem({});
            setVisibleModal(false);
          }}
        />
      )}
      {visibleEditModal && (
        <EditExamModal
          visible={visibleEditModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchData(params);
            }
            setSelectedItem({});
            setVisibleEditModal(false);
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
    exams: state.exam?.exams,
    isFetching: state.exam?.isFetching,
  }),
  { actionGetExams }
)(withRouter(Exam));
