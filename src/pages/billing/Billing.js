import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import { actionDeleteBilling, actionGetBillings } from "./BillingAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddOrEditBillingModal from "./AddOrEditBillingModal";
import "./Billing.scss";
import { BILLING_STATUS } from "../../utils/constants/config";
import { permission } from "../../utils/constants/permission";
import PreviewImage from "../../components/previewImage";
let params = {
  page: 1,
  size: 20,
  query: "",
};

const Billing = (props) => {
  const { profile = {}, actionGetBillings, billings = {}, isFetching } = props;
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
      handleFetchBilling(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchBilling = (params = {}) => {
    actionGetBillings({ ...params, page: params.page - 1 });
  };

  const handleDeleteBilling = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteBilling(id);
      handleFetchBilling(params);
      message.success("Xóa hóa đơn thành công!");
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
      title: "Học viên",
      dataIndex: "studentName",
      key: "studentName",
      sorter: true,
    },
    {
      title: "Nhân viên sale",
      dataIndex: "salerName",
      key: "salerName",
      sorter: true,
    },
    {
      title: "Hóa đơn",
      dataIndex: "billImg",
      key: "billImg",
      width: 130,
      render: (srcUrl) => (srcUrl ? <PreviewImage srcImg={srcUrl} /> : null),
    },
    {
      title: "Biên lại",
      dataIndex: "receipts",
      key: "receipts",
      width: 130,
      render: (srcUrl) => (srcUrl ? <PreviewImage srcImg={srcUrl} /> : null),
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      align: "right",
      key: "amount",
      sorter: true,
      render: (amount) => (
        <div style={{ textAlign: "right" }}>
          {amount ? `${amount} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
        </div>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "noted",
      key: "noted",
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
          value: BILLING_STATUS.ACTIVE,
        },
        {
          text: "Draff",
          value: BILLING_STATUS.DRAFF,
        },
      ],
      render: (status) => (
        <Tag
          color={status === BILLING_STATUS.ACTIVE ? "success" : "warning"}
          className="cell-status"
        >
          {status || ""}
        </Tag>
      ),
    },
  ];

  if (
    hasPermission(profile, [permission.billing_update]) ||
    hasPermission(profile, [permission.billing_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [
            permission.billing_update,
          ])}
          isHasPermissonDelete={hasPermission(profile, [
            permission.billing_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteBilling(record.id)}
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

      handleFetchBilling(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const handleAddNew = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const searchFields = useMemo(() => {
    return [
      { label: "Học viên ", value: "studentName " },
      { label: "Nhân viên sales", value: "salerName" },
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
    handleFetchBilling(params);
  };

  return (
    <div className="billing-page common-page">
      <div className="billing-content">
        <PageHeader pageTitle="Hóa đơn" />
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
          onAction={handleAddNew}
          isHasPermissonAdd={hasPermission(profile, [permission.billing_add])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={billings?.data || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {billings?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={billings?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchBilling(params);
            }}
          />
        )}
      </div>
      {visibleModal && (
        <AddOrEditBillingModal
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchBilling(params);
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
    billings: state.billing?.billings,
    isFetching: state.billing?.isFetching,
  }),
  { actionGetBillings }
)(withRouter(Billing));
