import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import { actionDeleteVoucher, actionGetVouchers } from "./VoucherAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddOrEditVoucherModal from "./AddOrEditVoucherModal";
import "./Voucher.scss";
import { VOUCHER_STATUS } from "../../utils/constants/config";
import { permission } from "../../utils/constants/permission";
import moment from "moment";
let params = {
  page: 1,
  size: 20,
  query: "",
};

const Voucher = (props) => {
  const { profile = {}, actionGetVouchers, vouchers = {}, isFetching } = props;
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
      handleFetchVoucher(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchVoucher = (params = {}) => {
    actionGetVouchers({ ...params, page: params.page - 1 });
  };

  const handleDeleteVoucher = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteVoucher(id);
      handleFetchVoucher(params);
      message.success("Xóa voucher thành công!");
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
      title: "Code khuyến mãi",
      dataIndex: "voucherCode",
      key: "voucherCode",
      sorter: true,
    },
    {
      title: "Khuyến mãi (%)",
      dataIndex: "discount",
      key: "discount",
      sorter: true,
    },
    {
      title: "Số lượng",
      dataIndex: "total",
      key: "total",
      sorter: true,
    },
    {
      title: "Khóa học áp dụng",
      dataIndex: "courseName",
      key: "courseName",
      sorter: true,
    },
    // {
    //   title: "Sinh viên áp dụng",
    //   dataIndex: "userIdApply",
    //   key: "userIdApply",
    //   sorter: true,
    // },

    {
      title: "Thời gian hết hạn",
      dataIndex: "expiredTime",
      key: "expiredTime",
      sorter: true,
      render: (expiredTime) => (
        <span>
          {expiredTime ? moment(expiredTime).format("DD/MM/YYYY") : ""}
        </span>
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
          value: VOUCHER_STATUS.ACTIVE,
        },
        {
          text: "Draff",
          value: VOUCHER_STATUS.DRAFF,
        },
      ],
      render: (status) => (
        <Tag
          color={status === VOUCHER_STATUS.ACTIVE ? "success" : "warning"}
          className="cell-status"
        >
          {status || ""}
        </Tag>
      ),
    },
  ];

  if (
    hasPermission(profile, [permission.voucher_update]) ||
    hasPermission(profile, [permission.voucher_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [
            permission.voucher_update,
          ])}
          isHasPermissonDelete={hasPermission(profile, [
            permission.voucher_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteVoucher(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa voucher này?"
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

      handleFetchVoucher(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const handleAddNew = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const searchFields = useMemo(() => {
    return [{ label: "Code khuyến mãi", value: "voucherCode" }];
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
    handleFetchVoucher(params);
  };

  return (
    <div className="voucher-page common-page">
      <div className="voucher-content">
        <PageHeader pageTitle="Khuyến mãi" />
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
          onAction={handleAddNew}
          isHasPermissonAdd={hasPermission(profile, [permission.voucher_add])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={vouchers?.data || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {vouchers?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={vouchers?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchVoucher(params);
            }}
          />
        )}
      </div>
      {visibleModal && (
        <AddOrEditVoucherModal
          visible={visibleModal}
          profile={profile}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchVoucher(params);
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
    vouchers: state.voucher?.vouchers,
    isFetching: state.voucher?.isFetching,
  }),
  { actionGetVouchers }
)(withRouter(Voucher));
