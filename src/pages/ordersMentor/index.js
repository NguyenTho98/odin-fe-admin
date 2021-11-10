import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag } from "antd";
import moment from "moment";
import { isEmpty, formatCurrency, hasPermission } from "../../utils/helpers";
import {
  actionDeleteOrdersMentor,
  actionGetOrdersMentor,
} from "./OrdersMentorAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddOrEditOrdersMentor from "./AddOrEditOrdersMentor";
import "./OrdersMentor.scss";
import { ORDERS_STATUS } from "../../utils/constants/config";
import { permission } from "../../utils/constants/permission";
let params = {
  page: 1,
  size: 20,
  query: "",
};

const OrdersMentor = (props) => {
  const {
    profile = {},
    actionGetOrdersMentor,
    ordersMentor = {},
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
      handleFetchData(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchData = (params = {}) => {
    actionGetOrdersMentor({ ...params, page: params.page - 1 });
  };

  const handleDeleteItem = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteOrdersMentor(id);
      handleFetchData(params);
      message.success("Xóa đơn hàng thành công!");
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
      title: "Học viên",
      dataIndex: "userId",
      key: "userId",
      render: (_, record) => (
        <span>{record?.userName || record?.userId || ""}</span>
      ),
    },
    {
      title: "Giảng viên",
      dataIndex: "mentorId",
      key: "mentorId",
      render: (_, record) => (
        <span>{record?.mentorName || record?.mentorId || ""}</span>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdTime",
      key: "createdTime",
      sorter: true,
      render: (createdTime) => (
        <span>{createdTime ? moment(createdTime).format("L LTS") : ""}</span>
      ),
    },
    {
      title: "Lịch trình",
      dataIndex: "schedule",
      key: "schedule",
    },
    {
      title: "Số lượng học viên",
      dataIndex: "totalStudent",
      key: "totalStudent",
      sorter: true,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      sorter: true,
      align: "right",
      render: (price) => <div>{price ? formatCurrency(price) : 0}</div>,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
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
          text: "Chờ xác nhận",
          value: ORDERS_STATUS.PENDING,
        },
        {
          text: "Đã xác nhận",
          value: ORDERS_STATUS.DONE,
        },
        {
          text: "Đã hủy",
          value: ORDERS_STATUS.REJECTED,
        },
      ],
      render: (status) => (
        <Tag
          color={
            status === ORDERS_STATUS.DONE
              ? "success"
              : status === ORDERS_STATUS.PENDING
              ? "warning"
              : "error"
          }
          className="cell-status"
        >
          {status || ""}
        </Tag>
      ),
    },
  ];

  if (
    hasPermission(profile, [permission.ordersMentorAdmin_update]) ||
    hasPermission(profile, [permission.ordersMentorAdmin_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [
            permission.ordersMentorAdmin_update,
          ])}
          isHasPermissonDelete={hasPermission(profile, [
            permission.ordersMentorAdmin_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteItem(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa đơn hàng này?"
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

  const searchFields = useMemo(() => {
    return [
      { label: "Giảng viên", value: "mentorName" },
      { label: "Học viên", value: "userName" },
      { label: "Ghi chú", value: "note" },
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
    handleFetchData(params);
  };

  return (
    <div className="orders-mentor-page common-page">
      <div className="orders-mentor-content">
        <PageHeader pageTitle="Đơn hàng giảng viên" />
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
          isHasPermissonAdd={false}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={ordersMentor?.data || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {ordersMentor?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={ordersMentor?.page?.total_elements || 0}
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
        <AddOrEditOrdersMentor
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchData(params);
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
    ordersMentor: state.orderMentor?.ordersMentor,
    isFetching: state.orderMentor?.isFetching,
  }),
  { actionGetOrdersMentor }
)(withRouter(OrdersMentor));
