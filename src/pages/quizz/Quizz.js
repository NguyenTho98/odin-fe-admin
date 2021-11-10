import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import { actionDeleteQuizz, actionGetQuizzes } from "./QuizzAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddQuizzModal from "./AddQuizzModal";
import EditQuizzModal from "./EditQuizzModal";
import "./Quizz.scss";
import { ITEM_STATUS } from "../../utils/constants/config";
import QuizzQuestion from "../quizzquestion/QuizzQuestion";
import { permission } from "../../utils/constants/permission";

let params = {
  page: 1,
  size: 20,
  query: "",
};

const Quizz = (props) => {
  const { profile = {}, actionGetQuizzes, quizzes = {}, isFetching } = props;
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
    actionGetQuizzes({ ...params, page: params.page - 1 });
  };

  const handleDeleteLesson = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteQuizz(id);
      handleFetchData(params);
      message.success("Xóa quizz thành công!");
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
      title: "Tên câu hỏi",
      dataIndex: "quizzName",
      key: "quizzName",
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "quizzType",
      key: "quizzType",
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
    {
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteLesson(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa quizz này?"
        />
      ),
    },
  ];

  if (
    hasPermission(profile, [permission.quizz_update]) ||
    hasPermission(profile, [permission.quizz_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [
            permission.quizz_update,
          ])}
          isHasPermissonDelete={hasPermission(profile, [
            permission.quizz_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteLesson(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa quizz này?"
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
    return [{ label: "Tên câu hỏi", value: "quizzName" }];
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
    return <QuizzQuestion idQuizz={props.id} />;
  };

  return (
    <div className="quizz-page common-page">
      <div className="quizz-content">
        <PageHeader pageTitle="Quizz" />
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
          onAction={handleAddNew}
          isHasPermissonAdd={hasPermission(profile, [permission.quizz_add])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={quizzes?.data || []}
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
        {quizzes?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={quizzes?.page?.total_elements || 0}
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
        <AddQuizzModal
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
        <EditQuizzModal
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
    quizzes: state.quizz?.quizzes,
    isFetching: state.quizz?.isFetching,
  }),
  { actionGetQuizzes }
)(withRouter(Quizz));
