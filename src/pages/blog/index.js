import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Tag, Pagination, Button, Tooltip } from "antd";
import { isEmpty } from "../../utils/helpers";
import {
  actionDeleteItem,
  actionGetBlog,
  actionGetBlogDetail,
} from "./BlogAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import { ITEM_STATUS, routes } from "../../utils/constants/config";
import PreviewImage from "../../components/previewImage";
import "./Blog.scss";
import PreviewContent from "./PreviewContent";
import ApproveOrRejectModal from "./ApproveOrRejectModal";

let params = {
  page: 1,
  size: 20,
  query: "",
};

const TYPE = {
  APPROVE: "APPROVE",
  REJECT: "REJECT",
};

const Blog = (props) => {
  const { profile = {}, history } = props;
  const [processing, setProcessing] = useState(false);
  const [filteredStatus, setFilteredStatus] = useState([]);
  const [searchData, setSearchData] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [blogs, setBlogs] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [itemDetail, setItemDetail] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [typeModal, setTypeModal] = useState();

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

  const handleFetchData = async (params = {}) => {
    try {
      setIsFetching(true);
      const { data } = await actionGetBlog({
        ...params,
        page: params.page - 1,
      });
      setBlogs(data || {});
      setIsFetching(false);
    } catch (error) {
      console.log(error);
      setIsFetching(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteItem(id);
      handleFetchData({ ...params, page: 1 });
      message.success("Xóa bài viết thành công!");
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
    }
  };

  const handleEditItem = (items = {}) => {
    history.push(routes.BLOG + "/" + items.id);
  };

  const handleApproveItem = async () => {
    if (processing) return;
    setTypeModal(TYPE.APPROVE);
    setVisibleModal(true);
  };

  const handleRejectItem = async () => {
    if (processing) return;
    setTypeModal(TYPE.REJECT);
    setVisibleModal(true);
  };

  const disableBtnAction = useCallback(() => {
    return !selectedRows.find((it) => it.status === ITEM_STATUS.DRAFF);
  }, [selectedRows]);

  const customActions = [
    {
      name: "Từ chối",
      danger: true,
      action: handleRejectItem,
      disabled: disableBtnAction(),
    },
    {
      name: "Phê duyệt",
      action: handleApproveItem,
      disabled: disableBtnAction(),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowKeys, rows) => {
      setSelectedRowKeys(rowKeys || []);
      setSelectedRows(rows);
    },
  };

  const resetSelectedItems = () => {
    setSelectedRows([]);
    setSelectedRowKeys([]);
  };

  const handlePreviewContent = async (item) => {
    try {
      const { data } = await actionGetBlogDetail(item?.id);
      setItemDetail(data?.data || {});
      setShowPreview(true);
    } catch (error) {}
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: 80,
    },
    {
      title: "Hình ảnh",
      dataIndex: "avatar",
      key: "avatar",
      width: 130,
      render: (srcUrl) => (srcUrl ? <PreviewImage srcImg={srcUrl} /> : null),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (title, item) => (
        <Tooltip title="Xem chi tiết nội dung">
          <Button type="link" onClick={() => handlePreviewContent(item)}>
            {title || ""}
          </Button>
        </Tooltip>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Thể loại",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Lượt thích",
      dataIndex: "likePost",
      key: "likePost",
      align: "center",
    },
    {
      title: "Lượt xem",
      dataIndex: "viewPost",
      key: "viewPost",
      align: "center",
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
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
          text: "Đã phê duyệt",
          value: ITEM_STATUS.ACTIVE,
        },
        {
          text: "Chưa phê duyệt",
          value: ITEM_STATUS.DRAFF,
        },
        {
          text: "Đã từ chối",
          value: ITEM_STATUS.REJECTED,
        },
      ],
      render: (status) => (
        <Tag
          color={
            status === ITEM_STATUS.ACTIVE
              ? "success"
              : status === ITEM_STATUS.REJECTED
              ? "error"
              : "warning"
          }
          className="cell-status"
        >
          {status === ITEM_STATUS.ACTIVE
            ? "Đã phê duyệt"
            : status === ITEM_STATUS.REJECTED
            ? "Đã từ chối"
            : "Chưa phê duyệt"}
        </Tag>
      ),
    },
  ];

  columns.push({
    title: "Actions",
    key: "action",
    align: "center",
    width: "100px",
    render: (_, record) => (
      <TableCellActions
        isHasPermissonUpdate={record?.status !== ITEM_STATUS.DRAFF}
        isHasPermissonDelete={true}
        onEdit={() => handleEditItem(record)}
        onDelete={() => handleDeleteItem(record.id)}
        deleteNessage="Bạn có chắc chắn muốn xóa bài viết này?"
      />
    ),
  });

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

  const handleAddNew = useCallback(() => {
    history.push(routes.BLOG_ADD);
  }, [history]);

  const searchFields = useMemo(() => {
    return [
      { label: "Thể loại", value: "categoryId" },
      { label: "Mô tả", value: "description" },
    ];
  }, []);

  return (
    <div className="blog-page common-page">
      <div className="blog-content">
        <PageHeader pageTitle="Bài viết" />
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
          onAction={handleAddNew}
          isHasPermissonAdd={true}
          customActions={customActions}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={blogs?.data || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          scroll={{ x: true }}
          size="middle"
          onChange={handleOnChangeTable}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
        />
        {blogs?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={blogs?.page?.total_elements || 0}
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
      {showPreview && (
        <PreviewContent
          item={itemDetail}
          onCancel={(isRefresh) => {
            setItemDetail({});
            setShowPreview(false);
            if (isRefresh) {
              handleFetchData(params);
            }
          }}
        />
      )}
      {visibleModal && (
        <ApproveOrRejectModal
          selectedRows={selectedRows}
          type={typeModal}
          onCancel={(isRefresh) => {
            setVisibleModal(false);
            if (isRefresh) {
              resetSelectedItems();
              handleFetchData(params);
            }
          }}
        />
      )}
    </div>
  );
};

export default connect(
  (state) => ({
    profile: state.system?.profile,
  }),
  {}
)(withRouter(Blog));
