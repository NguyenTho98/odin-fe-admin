import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag, Button } from "antd";
import moment from "moment";
import { isEmpty, formatCurrency, hasPermission } from "../../utils/helpers";
import { actionDeleteOrder, actionGetOrders } from "./OrderAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddOrEditOrderModal from "./AddOrEditOrderModal";
import "./Order.scss";
import { ORDERS_STATUS, routes } from "../../utils/constants/config";
import { permission } from "../../utils/constants/permission";
let params = {
  page: 1,
  size: 20,
  query: "",
};

const Order = (props) => {
  const {
    profile = {},
    actionGetOrders,
    orders = {},
    isFetching,
    history,
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
    actionGetOrders({ ...params, page: params.page - 1 });
  };

  const handleDeleteOrder = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteOrder(id);
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
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: true,
    },
    {
      title: "Tài khoản",
      dataIndex: "fullName",
      key: "fullName",
      sorter: true,
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "payments",
      key: "payments",
      sorter: true,
      with: 220,
    },
    {
      title: "Mã Voucher",
      dataIndex: "voucherCode",
      key: "voucherCode",
      sorter: true,
    },
    {
      title: "Ngày mua",
      dataIndex: "createdTime",
      key: "createdTime",
      sorter: true,
      render: (createdTime) => (
        <span>{createdTime ? moment(createdTime).format("L LTS") : ""}</span>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: true,
      render: (totalPrice) => (
        <div style={{ textAlign: "right" }}>
          {totalPrice ? formatCurrency(totalPrice) : 0}
        </div>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "promotionPrice",
      key: "promotionPrice",
      sorter: true,
      render: (promotionPrice) => (
        <div style={{ textAlign: "right" }}>
          {promotionPrice ? formatCurrency(promotionPrice) : 0}
        </div>
      ),
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
    hasPermission(profile, [permission.orders_update]) ||
    hasPermission(profile, [permission.orders_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [
            permission.orders_update,
          ])}
          isHasPermissonDelete={hasPermission(profile, [
            permission.orders_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteOrder(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa hóa đơn này?"
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

      handleFetchData(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const searchFields = useMemo(() => {
    return [
      { label: "Tài khoản", value: "fullName" },
      { label: "Ghi chú", value: "note" },
      { label: "Mã voucher", value: "voucherCode" },
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

  const expandedRowRender = (props) => {
    const courseCol = [
      {
        title: "Khóa học",
        dataIndex: "courseName",
        key: "courseName",
        render: (courseName, record) => (
          <Button
            type="link"
            onClick={() =>
              history?.push(`${routes.COURSES}/${record?.courseId}`)
            }
          >
            {courseName || ""}
          </Button>
        ),
      },

      {
        title: "Mã voucher",
        dataIndex: "voucherCode",
        key: "voucherCode",
      },
      {
        title: "Giá gốc",
        dataIndex: "originalPrice",
        key: "originalPrice",
        align: "right",
        render: (originalPrice) => <span>{formatCurrency(originalPrice)}</span>,
      },
      {
        title: "Giá khuyến mãi",
        dataIndex: "promotionPrice",
        key: "promotionPrice",
        align: "right",
        render: (promotionPrice) => (
          <span>
            {!isEmpty(promotionPrice) ? formatCurrency(promotionPrice) : ""}
          </span>
        ),
      },
      {
        title: "Tạm tính",
        dataIndex: "temporaryPrice",
        key: "temporaryPrice",
        align: "right",
        render: (temporaryPrice) => (
          <span>{formatCurrency(temporaryPrice)}</span>
        ),
      },
    ];
    return (
      <Table
        columns={courseCol}
        dataSource={props?.orderItems || []}
        pagination={false}
        rowKey={(record) => record?.courseId}
      />
    );
  };

  return (
    <div className="order-page common-page">
      <div className="order-content">
        <PageHeader pageTitle="Đơn hàng" />
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
          isHasPermissonAdd={false}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={orders?.data || []}
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
        {orders?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={orders?.page?.total_elements || 0}
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
        <AddOrEditOrderModal
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
    orders: state.order?.orders,
    isFetching: state.order?.isFetching,
  }),
  { actionGetOrders }
)(withRouter(Order));
