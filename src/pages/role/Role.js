import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import { actionDeleteRole, actionGetRoles } from "./RoleAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddOrEditRoleModal from "./AddOrEditRoleModal";
import "./Role.scss";
import { permission } from "../../utils/constants/permission";
import { ROLE_STATUS } from "../../utils/constants/config";
let params = {
  page: 1,
  size: 20,
  query: "",
};

const Role = (props) => {
  const { profile = {}, actionGetRoles, roles = {}, isFetching } = props;

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
      handleFetchRole(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchRole = (params = {}) => {
    actionGetRoles({ ...params, page: params.page - 1 });
  };

  const handleDeleteRole = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteRole(id);
      handleFetchRole(params);
      message.success("Xóa nhóm quyền thành công!");
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
      title: "Tên nhóm quyền",
      dataIndex: "roleName",
      key: "roleName",
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
          value: ROLE_STATUS.ACTIVE,
        },
        {
          text: "Draff",
          value: ROLE_STATUS.DRAFF,
        },
      ],
      render: (status) => (
        <Tag
          color={status === ROLE_STATUS.ACTIVE ? "success" : "warning"}
          className="cell-status"
        >
          {status || ""}
        </Tag>
      ),
    },
  ];

  if (
    hasPermission(profile, [permission.role_update]) ||
    hasPermission(profile, [permission.role_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [
            permission.role_update,
          ])}
          isHasPermissonDelete={hasPermission(profile, [
            permission.role_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteRole(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa nhóm quyền này?"
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
    handleFetchRole(params);
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

      handleFetchRole(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const handleAddNew = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const searchFields = useMemo(() => {
    return [{ label: "Tên nhóm quyền", value: "roleName" }];
  }, []);

  return (
    <div className="role-page common-page">
      <div className="role-content">
        <PageHeader pageTitle="Nhóm quyền" />
        <HeaderAction
          onSearch={handleSearch}
          onAction={handleAddNew}
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          isHasPermissonAdd={hasPermission(profile, [permission.role_add])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={roles?.data || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {roles?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={roles?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchRole(params);
            }}
          />
        )}
      </div>
      {visibleModal && (
        <AddOrEditRoleModal
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchRole(params);
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
    roles: state.role?.roles,
    isFetching: state.role?.isFetching,
  }),
  { actionGetRoles }
)(withRouter(Role));
