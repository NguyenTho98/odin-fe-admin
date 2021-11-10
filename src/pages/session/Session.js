import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import { actionDeleteSession, actionGetSessions } from "./SessionAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddOrEditSessionModal from "./AddOrEditSessionModal";
import "./Session.scss";
import { COURSE_STATUS } from "../../utils/constants/config";
import { permission } from "../../utils/constants/permission";

let params = {
  page: 1,
  size: 20,
  query: "",
};

const Session = (props) => {
  const { profile = {}, actionGetSessions, sessions = {}, isFetching } = props;

  const [processing, setProcessing] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
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
      handleFetchSession(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchSession = (params = {}) => {
    actionGetSessions({ ...params, page: params.page - 1 });
  };

  const handleDeleteSession = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteSession(id);
      handleFetchSession(params);
      message.success("Xóa học phần thành công!");
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
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: true,
    },
    {
      title: "Tên học phần",
      dataIndex: "sessionName",
      key: "sessionName",
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "sessionType",
      key: "sessionType",
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
          value: COURSE_STATUS.ACTIVE,
        },
        {
          text: "Draff",
          value: COURSE_STATUS.DRAFF,
        },
      ],
      render: (status) => (
        <Tag
          color={status === COURSE_STATUS.ACTIVE ? "success" : "warning"}
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
          onDelete={() => handleDeleteSession(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa học phần này?"
        />
      ),
    },
  ];

  if (
    hasPermission(profile, [permission.session_update]) ||
    hasPermission(profile, [permission.session_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [
            permission.session_update,
          ])}
          isHasPermissonDelete={hasPermission(profile, [
            permission.session_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteSession(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa học phần này?"
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
    handleFetchSession(params);
  };

  const handleSearch = useCallback(
    (type, value) => {
      const status =
        filteredStatus.length > 0 ? `status=="${filteredStatus[0]}"` : "";
      if (!value) {
        params = { ...params, page: 1, query: status };
        setSearchData({});
      } else {
        setSearchData({ type, value });
        let a = `${type}=="${value}"`;
        console.log(a);
        params = {
          ...params,
          page: 1,
          query: `${type}=="${value}"`.trim() + (status ? `;${status}` : ""),
        };
      }

      handleFetchSession(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const handleAddNew = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const searchFields = useMemo(() => {
    return [{ label: "Tên học phần", value: "sessionName" }];
  }, []);

  return (
    <div className="session-page common-page">
      <div className="session-content">
        <PageHeader pageTitle="Học phần" />
        <HeaderAction
          onSearch={handleSearch}
          onAction={handleAddNew}
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          isHasPermissonAdd={hasPermission(profile, [permission.session_add])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={sessions?.data || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {sessions?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={sessions?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchSession(params);
            }}
          />
        )}
      </div>
      {visibleModal && (
        <AddOrEditSessionModal
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchSession(params);
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
    sessions: state.session?.sessions,
    isFetching: state.session?.isFetching,
  }),
  { actionGetSessions }
)(withRouter(Session));
