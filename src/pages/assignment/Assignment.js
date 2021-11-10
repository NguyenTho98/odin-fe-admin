import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import {
  actionDeleteAssignment,
  actionGetAssignments,
} from "./AssignmentAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddOrEditAssignmentModal from "./AddOrEditAssignmentModal";
import "./Assignment.scss";
import { ASSIGNMENT_STATUS } from "../../utils/constants/config";
import { permission } from "../../utils/constants/permission";
let params = {
  page: 1,
  size: 20,
  query: "",
};

const Assignment = (props) => {
  const {
    profile = {},
    actionGetAssignments,
    assignments = {},
    isFetching,
  } = props;
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
      handleFetchAssignment(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchAssignment = (params = {}) => {
    actionGetAssignments({ ...params, page: params.page - 1 });
  };

  const handleDeleteAssignment = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteAssignment(id);
      handleFetchAssignment(params);
      message.success("Xóa bài tập thành công!");
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
      title: "Tên bài tập",
      dataIndex: "assignmentTitle",
      key: "assignmentTitle",
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "assignmentType",
      key: "assignmentType",
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
          value: ASSIGNMENT_STATUS.ACTIVE,
        },
        {
          text: "Draff",
          value: ASSIGNMENT_STATUS.DRAFF,
        },
      ],
      render: (status) => (
        <Tag
          color={status === ASSIGNMENT_STATUS.ACTIVE ? "success" : "warning"}
          className="cell-status"
        >
          {status || ""}
        </Tag>
      ),
    },
  ];

  if (
    hasPermission(profile, [permission.assignment_update]) ||
    hasPermission(profile, [permission.assignment_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [
            permission.assignment_update,
          ])}
          isHasPermissonDelete={hasPermission(profile, [
            permission.assignment_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteAssignment(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa bài tập này?"
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
        let a = `${type}=="${value}"`;
        console.log(a);
        params = {
          ...params,
          page: 1,
          query: `${type}=="${value}"`.trim() + (status ? `;${status}` : ""),
        };
      }

      handleFetchAssignment(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const handleAddNew = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const searchFields = useMemo(() => {
    return [{ label: "Tên bài tập", value: "assignmentTitle" }];
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
    handleFetchAssignment(params);
  };

  return (
    <div className="assignment-page common-page">
      <div className="assignment-content">
        <PageHeader pageTitle="Bài tập" />
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
          onAction={handleAddNew}
          isHasPermissonAdd={hasPermission(profile, [
            permission.assignment_add,
          ])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={assignments?.data || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {assignments?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={assignments?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchAssignment(params);
            }}
          />
        )}
      </div>
      {visibleModal && (
        <AddOrEditAssignmentModal
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchAssignment(params);
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
    assignments: state.assignment?.assignments,
    isFetching: state.assignment?.isFetching,
  }),
  { actionGetAssignments }
)(withRouter(Assignment));
