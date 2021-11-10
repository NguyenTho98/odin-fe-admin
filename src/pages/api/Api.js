import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import { actionDeleteApi, actionGetApis } from "./ApiAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddOrEditApiModal from "./AddOrEditApiModal";
import "./Api.scss";
import { permission } from "../../utils/constants/permission";

let params = {
  page: 1,
  size: 20,
  query: "",
};

const Api = (props) => {
  const { profile = {}, actionGetApis, apis = {}, isFetching } = props;

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
      handleFetchApi(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchApi = (params = {}) => {
    actionGetApis({ ...params, page: params.page - 1 });
  };

  const handleDeleteApi = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteApi(id);
      handleFetchApi(params);
      message.success("Xóa quyền thành công!");
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
      title: "Tên quyền",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Phương thức",
      dataIndex: "httpMethod",
      key: "httpMethod",
    },
    {
      title: "Đường dẫn",
      dataIndex: "pattern",
      key: "pattern",
      width: "150px",
      sorter: true,
    },
    {
      title: "Check Quyền",
      dataIndex: "shouldCheckPermission",
      key: "shouldCheckPermission",
      align: "center",
      sorter: true,
      width: "180px",
      render: (_, record) => (
        <div>{record.shouldCheckPermission ? "Có" : "Không"}</div>
      ),
    },
    {
      title: "Check Token",
      dataIndex: "isRequiredAccessToken",
      key: "isRequiredAccessToken",
      align: "center",
      sorter: true,
      width: "180px",
      render: (_, record) => (
        <div>{record.isRequiredAccessToken ? "Có" : "Không"}</div>
      ),
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   align: "center",
    //   width: "180px",
    //   sorter: true,
    //   filterMultiple: false,
    //   filteredValue: filteredStatus,
    //   filters: [
    //     {
    //       text: "Active",
    //       value: API_STATUS.ACTIVE,
    //     },
    //     {
    //       text: "Draff",
    //       value: API_STATUS.DRAFF,
    //     },
    //   ],
    //   render: (status) => (
    //     <Tag
    //       color={status === API_STATUS.ACTIVE ? "success" : "warning"}
    //       className="cell-status"
    //     >
    //       {status || ""}
    //     </Tag>
    //   ),
    // },
  ];

  if (
    hasPermission(profile, [permission.api_update]) ||
    hasPermission(profile, [permission.api_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [permission.api_update])}
          isHasPermissonDelete={hasPermission(profile, [permission.api_delete])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteApi(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa quyền này?"
        />
      ),
    });
  }

  const handleOnChangeTable = (_, filters, sorter) => {
    // change filter
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

    handleFetchApi(params);
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

      handleFetchApi(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const handleAddNew = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const searchFields = useMemo(() => {
    return [
      { label: "Tên quyền", value: "name" },
      { label: "Check quyền", value: "shouldCheckPermission" },
      { label: "Check token", value: "isRequiredAccessToken" },
    ];
  }, []);

  return (
    <div className="api-page common-page">
      <div className="api-content">
        <PageHeader pageTitle="Quyền" />
        <HeaderAction
          onSearch={handleSearch}
          onAction={handleAddNew}
          isHasPermissonAdd={hasPermission(profile, [permission.api_add])}
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={apis?.data || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {apis?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={apis?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchApi(params);
            }}
          />
        )}
      </div>
      {visibleModal && (
        <AddOrEditApiModal
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchApi(params);
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
    apis: state.api?.apis,
    isFetching: state.api?.isFetching,
  }),
  { actionGetApis }
)(withRouter(Api));
