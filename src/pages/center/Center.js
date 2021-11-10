import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import { actionDeleteCenter, actionGetCenters } from "./CenterAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddOrEditCenterModal from "./AddOrEditCenterModal";
import "./Center.scss";
import { permission } from "../../utils/constants/permission";
import PreviewImage from "../../components/previewImage";
let params = {
  page: 1,
  size: 20,
  query: "",
};

const Center = (props) => {
  const { profile = {}, actionGetCenters, centers = {}, isFetching } = props;
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
      handleFetchCenter(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchCenter = (params = {}) => {
    actionGetCenters({ ...params, page: params.page - 1 });
  };

  const handleDeleteCenter = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteCenter(id);
      handleFetchCenter(params);
      message.success("Xóa trung tâm thành công!");
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
      title: "Tên trung tâm",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      sorter: true,
    },
    {
      title: "Thời gian khởi tạo",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
    },
    {
      title: "Thời gian cập nhật",
      dataIndex: "updated_at",
      key: "updated_at",
      sorter: true,
    },

    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   align: "center",
    //   width: "150px",
    //   sorter: true,
    //   filterMultiple: false,
    //   filteredValue: filteredStatus,
    //   filters: [
    //     {
    //       text: "Active",
    //       value: CENTER_STATUS.ACTIVE,
    //     },
    //     {
    //       text: "Draff",
    //       value: CENTER_STATUS.DRAFF,
    //     },
    //   ],
    //   render: (status) => (
    //     <Tag
    //       color={status === CENTER_STATUS.ACTIVE ? "success" : "warning"}
    //       className="cell-status"
    //     >
    //       {status || ""}
    //     </Tag>
    //   ),
    // },
  ];

  if (
    !hasPermission(profile, [permission.center_update]) ||
    !hasPermission(profile, [permission.center_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={!hasPermission(profile, [
            permission.center_update,
          ])}
          isHasPermissonDelete={!hasPermission(profile, [
            permission.center_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteCenter(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa trung tâm này?"
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

      handleFetchCenter(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const handleAddNew = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const searchFields = useMemo(() => {
    return [
      { label: "Tên trung tâm ", value: "name " },
      { label: "Địa chỉ", value: "address" },
    ];
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
    handleFetchCenter(params);
  };

  return (
    <div className="center-page common-page">
      <div className="center-content">
        <PageHeader pageTitle="Trung tâm" />
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
          onAction={handleAddNew}
          isHasPermissonAdd={!hasPermission(profile, [permission.center_add])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={centers?.results || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {centers?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={centers?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchCenter(params);
            }}
          />
        )}
      </div>
      {visibleModal && (
        <AddOrEditCenterModal
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchCenter(params);
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
    centers: state.center?.centers,
    isFetching: state.center?.isFetching,
  }),
  { actionGetCenters }
)(withRouter(Center));
