import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import { actionDeleteMentor, actionGetMentorList } from "./MentorAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import "./Mentor.scss";
import { ITEM_STATUS, routes } from "../../utils/constants/config";
import PreviewImage from "../../components/previewImage";
import { permission } from "../../utils/constants/permission";

let params = {
  page: 1,
  size: 20,
  query: "",
};

const Mentor = (props) => {
  const {
    profile = {},
    actionGetMentorList,
    mentorList = {},
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
      handleFetchData(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchData = (params = {}) => {
    actionGetMentorList({ ...params, page: params.page - 1 });
  };

  const handleDeleteMentor = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteMentor(id);
      handleFetchData(params);
      message.success("Xóa giảng viên thành công!");
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
    }
  };

  const handleEditItem = (items = {}) => {
    history.push(routes.MENTOR + "/" + items.id);
  };

  const columns = [
    {
      title: "Ảnh đại diện",
      dataIndex: "avt_img",
      width: 130,
      align: "center",
      key: "avt_img",
      render: (srcUrl) => (srcUrl ? <PreviewImage srcImg={srcUrl} /> : null),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: true,
    },
    {
      title: "Ngôn ngữ",
      dataIndex: "language",
      key: "language",
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
      title: "Số lượng đặt trước",
      dataIndex: "totalBookings",
      key: "totalBookings",
      align: "center",
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      width: "150px",
      align: "center",
      sorter: true,
      render: (price) => (
        <div style={{ textAlign: "right" }}>
          {price ? `${price} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
        </div>
      ),
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
          text: "Chờ xử lý",
          value: ITEM_STATUS.ACTIVE,
        },
        {
          text: "Đã xử lý",
          value: ITEM_STATUS.DONE,
        },
        {
          text: "Đã hủy",
          value: ITEM_STATUS.REJECTED,
        },
      ],
      render: (status) => (
        <Tag
          color={
            status === ITEM_STATUS.ACTIVE
              ? "success"
              : status === ITEM_STATUS.PENDING
              ? "warning"
              : "warning"
          }
          className="cell-status"
        >
          {status || ""}
        </Tag>
      ),
    },
  ];

  if (
    hasPermission(profile, [permission.mentor_update]) ||
    hasPermission(profile, [permission.mentor_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [
            permission.mentor_update,
          ])}
          isHasPermissonDelete={hasPermission(profile, [
            permission.mentor_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteMentor(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa giảng viên này không?"
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
    handleFetchData(params);
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

      handleFetchData(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const handleAddNew = useCallback(() => {
    history?.push(routes.MENTOR_ADD);
  }, [history]);

  const searchFields = useMemo(() => {
    return [
      { label: "Tên giảng viên", value: "fullName" },
      { label: "Email", value: "email" },
      { label: "Số điện thoại", value: "phone" },
    ];
  }, []);

  return (
    <div className="mentor-page common-page">
      <div className="mentor-content">
        <PageHeader pageTitle="Giảng viên" />
        <HeaderAction
          onSearch={handleSearch}
          onAction={handleAddNew}
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          isHasPermissonAdd={hasPermission(profile, [permission.mentor_add])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={mentorList?.data || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {mentorList?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={mentorList?.page?.total_elements || 0}
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
    </div>
  );
};

export default connect(
  (state) => ({
    profile: state.system?.profile,
    mentorList: state.mentor?.mentorList,
    isFetching: state.mentor?.isFetching,
  }),
  { actionGetMentorList }
)(withRouter(Mentor));
