import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag, Button } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import { actionDeleteRevenue, actionGetRevenues } from "./RevenueAction";
import { TableCellActions, HeaderAction } from "../../components";
import "./Revenue.scss";
import { REVENUE_STATUS, routes } from "../../utils/constants/config";
import { permission } from "../../utils/constants/permission";
let params = {
  page: 1,
  size: 20,
  query: "",
};

const Revenue = (props) => {
  const {
    profile = {},
    actionGetRevenues,
    revenues = {},
    isFetching,
    history,
  } = props;
  const [processing, setProcessing] = useState(false);
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
      handleFetchRevenue(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchRevenue = (params = {}) => {
    actionGetRevenues({ ...params, page: params.page - 1 });
  };

  const handleDeleteRevenue = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteRevenue(id);
      handleFetchRevenue(params);
      message.success("Xóa thành công!");
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
    }
  };
  const handleAddNew = () => {
    history?.push(routes.REVENUE_ADD);
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: true,
    },
    {
      title: "Tên học sinh",
      dataIndex: "userName",
      key: "userName",
      sorter: true,
      render: (userName, record) => (
        <Button type="link" onClick={() => history?.push(`student/${record?.userId}`)}>
          {userName || ""}
        </Button>
      ),
    },
    {
      title: "Tên khóa học",
      dataIndex: "courseName",
      key: "courseName",
      sorter: true,
    },
    {
      title: "Tổng tiền phải thu",
      dataIndex: "amount",
      key: "amount",
      sorter: true,
      render: (amount) => (
        <div style={{ textAlign: "right" }}>
          {amount ? `${amount} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
        </div>
      ),
    },
    {
      title: "Tổng tiền còn nợ",
      dataIndex: "debit",
      key: "debit",
      sorter: true,
      render: (debit) => (
        <div style={{ textAlign: "right" }}>
          {debit ? `${debit} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      sorter: true,
      render: (total) => (
        <div style={{ textAlign: "right" }}>
          {total ? `${total} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
        </div>
      ),
    },
    {
      title: "Mã giảm giá",
      dataIndex: "voucherCode",
      key: "voucherCode",
      sorter: true,
    },
    {
      title: "Tên nhân viên",
      dataIndex: "salerName",
      key: "salerName",
      sorter: true,
    },
    {
      title: "Mã người giới thiệu",
      dataIndex: "refId",
      key: "refId",
      sorter: true,
    },
    {
      title: "Ghi chú",
      dataIndex: "noted",
      key: "noted",
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
          value: REVENUE_STATUS.ACTIVE,
        },
        {
          text: "Draff",
          value: REVENUE_STATUS.DRAFF,
        },
      ],
      render: (status) => (
        <Tag
          color={status === REVENUE_STATUS.ACTIVE ? "success" : "warning"}
          className="cell-status"
        >
          {status || ""}
        </Tag>
      ),
    },
  ];

  if (
    hasPermission(profile, [permission.revenue_update]) ||
    hasPermission(profile, [permission.revenue_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [
            permission.revenue_update,
          ])}
          isHasPermissonDelete={hasPermission(profile, [
            permission.revenue_delete,
          ])}
          onEdit={() => history?.push(`revenue/${record?.id}`)}
          onDelete={() => handleDeleteRevenue(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa doanh thu này?"
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

      handleFetchRevenue(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const searchFields = useMemo(() => {
    return [
      { label: "ID học sinh", value: "userId" },
      { label: "ID khóa học", value: "courseId" },
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
    handleFetchRevenue(params);
  };

  return (
    <React.Fragment>
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
          onAction={handleAddNew}
          isHasPermissonAdd={hasPermission(profile, [permission.revenue_add])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={revenues?.data || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {revenues?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={revenues?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchRevenue(params);
            }}
          />
        )}
     </React.Fragment>
  );
};

export default connect(
  (state) => ({
    profile: state.system?.profile,
    revenues: state.revenue?.revenues,
    isFetching: state.revenue?.isFetching,
  }),
  { actionGetRevenues }
)(withRouter(Revenue));
