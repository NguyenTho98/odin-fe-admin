import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import { actionDeleteUser, actionGetUsers } from "./UserAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddOrEditUserModal from "./AddOrEditUserModal";
import "./User.scss";
import { COURSE_STATUS } from "../../utils/constants/config";
import { permission } from "../../utils/constants/permission";

let params = {
  page: 1,
  size: 20,
  query: "",
};

const User = (props) => {
  const { profile = {}, actionGetUsers, users = {}, isFetching } = props;

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
      handleFetchUser(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchUser = (params = {}) => {
    actionGetUsers({ ...params, page: params.page - 1 });
  };

  const handleDeleteUser = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteUser(id);
      handleFetchUser(params);
      message.success("Xóa tài khoản thành công!");
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
      title: "Tên tài khoản",
      dataIndex: "userName",
      key: "userName",
      sorter: true,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: true,
    },
    {
      title: "Tên quyền",
      dataIndex: "roles",
      key: "roles",
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      sorter: true,
    },
    // {
    //   title: "Thành tựu",
    //   dataIndex: "achievement",
    //   key: "achievement",
    //   sorter: true,
    // },
    // {
    //   title: "Huy hiệu",
    //   dataIndex: "star",
    //   key: "star",
    //   sorter: true,
    // },
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
  ];

  if (
    hasPermission(profile, [permission.user_update]) ||
    hasPermission(profile, [permission.user_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [
            permission.user_update,
          ])}
          isHasPermissonDelete={hasPermission(profile, [
            permission.user_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteUser(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa tài khoản này?"
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
    handleFetchUser(params);
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

      handleFetchUser(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const handleAddNew = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const searchFields = useMemo(() => {
    return [
      { label: "Tên tài khoản", value: "userName" },
      { label: "Email", value: "email" },
      { label: "Số điện thoại", value: "phone" },
    ];
  }, []);

  return (
    <div className="user-page common-page">
      <div className="user-content">
        <PageHeader pageTitle="Tài khoản" />
        <HeaderAction
          onSearch={handleSearch}
          onAction={handleAddNew}
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          isHasPermissonAdd={hasPermission(profile, [permission.user_add])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={users?.data || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {users?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={users?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchUser(params);
            }}
          />
        )}
      </div>
      {visibleModal && (
        <AddOrEditUserModal
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchUser(params);
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
    users: state.user?.users,
    isFetching: state.user?.isFetching,
  }),
  { actionGetUsers }
)(withRouter(User));
