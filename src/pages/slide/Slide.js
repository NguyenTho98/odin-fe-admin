import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Tag, Button, Pagination } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { TableCellActions } from "../../components";
import { hasPermission, isEmpty } from "../../utils/helpers";
import { actionDeleteSlide, actionGetSlides } from "./SlideAction";
import AddOrEditSlideModal from "./AddOrEditSlideModal";
import "./Slide.scss";
import { SLIDE_STATUS } from "../../utils/constants/config";
import { permission } from "../../utils/constants/permission";
import PreviewImage from "../../components/previewImage";

let params = {
  page: 1,
  size: 10,
  query: "",
};

const Slide = (props) => {
  const { profile = {}, idMaterial = "" } = props;
  const [processing, setProcessing] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [slides, setSlides] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [filteredStatus, setFilteredStatus] = useState([]);
  const [searchData] = useState({});

  useEffect(() => {
    return () => {
      params = {
        page: 1,
        size: 10,
        query: "",
      };
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(profile)) {
      params.query = `materialId==${idMaterial}`;
      handleFetchSlide(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchSlide = async (params = {}) => {
    try {
      setIsFetching(true);
      const { data } = await actionGetSlides({
        ...params,
        page: params.page - 1,
      });
      setIsFetching(false);
      setSlides(data);
    } catch (error) {
      setIsFetching(true);
    }
  };

  const handleDeleteSlide = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteSlide(id);
      handleFetchSlide(params);
      message.success("Xóa slide thành công!");
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
      title: "Ảnh",
      dataIndex: "slideAvatar",
      key: "slideAvatar",
      width: 130,
      render: (srcUrl) => (srcUrl ? <PreviewImage srcImg={srcUrl} /> : null),
    },
    {
      title: "Thứ tự slide",
      dataIndex: "orderInMaterial",
      key: "orderInMaterial",
    },
    {
      title: "Mô tả",
      dataIndex: "slideDetail",
      key: "slideDetail",
      sorter: true,
    },
    {
      title: "Ghi chú",
      dataIndex: "slideNote",
      key: "slideNote",
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
          value: SLIDE_STATUS.ACTIVE,
        },
        {
          text: "Draff",
          value: SLIDE_STATUS.DRAFF,
        },
      ],
      render: (status) => (
        <Tag
          color={status === SLIDE_STATUS.ACTIVE ? "success" : "warning"}
          className="cell-status"
        >
          {status || ""}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteSlide(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa slide này?"
        />
      ),
    },
  ];

  if (
    hasPermission(profile, [permission.slide_update]) ||
    hasPermission(profile, [permission.slide_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [
            permission.slide_update,
          ])}
          isHasPermissonDelete={hasPermission(profile, [
            permission.slide_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteSlide(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa slide này?"
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
    handleFetchSlide(params);
  };

  return (
    <div className="slide-page">
      <Table
        className="table-content"
        columns={columns}
        dataSource={slides?.data || []}
        loading={isFetching || processing}
        pagination={false}
        title={() => (
          <div className="table-header">
            <div className="table-title">Danh sách Slide</div>
            {hasPermission(profile, [permission.slide_add]) && (
              <Button
                className="btn-add-slide"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setVisibleModal(true)}
              >
                Thêm Slide
              </Button>
            )}
          </div>
        )}
        rowKey={(record) => record?.id}
        onChange={handleOnChangeTable}
        size="small"
      />
      {slides?.page?.total_elements > 0 && (
        <Pagination
          size="small"
          className="pagination-table"
          defaultCurrent={params.page}
          defaultPageSize={params.size}
          total={slides?.page?.total_elements || 0}
          showSizeChanger
          showQuickJumper
          showLessItems
          showTotal={(total) => `Tổng số ${total} phần tử`}
          onChange={(page, size) => {
            params = { ...params, page: page, size: size };
            handleFetchSlide(params);
          }}
        />
      )}
      {visibleModal && (
        <AddOrEditSlideModal
          visible={visibleModal}
          idMaterial={idMaterial}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchSlide(params);
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
    slides: state.slide?.slides,
    isFetching: state.slide?.isFetching,
  }),
  { actionGetSlides }
)(withRouter(Slide));
