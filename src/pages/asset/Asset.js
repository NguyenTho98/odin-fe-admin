import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import {
  actionDeleteAsset,
  actionGetAssets,
} from "./AssetAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddOrEditAssetModal from "./AddOrEditAssetModal";
import "./Asset.scss";
import { ASSET_STATUS } from "../../utils/constants/config";
import { permission } from "../../utils/constants/permission";
import PreviewImage from "../../components/previewImage";
let params = {
  page: 1,
  size: 20,
  query: "",
};

const Asset = (props) => {
  const {
    profile = {},
    actionGetAssets,
    assets = {},
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
      handleFetchAsset(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchAsset = (params = {}) => {
    actionGetAssets({ ...params, page: params.page - 1 });
  };

  const handleDeleteAsset = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteAsset(id);
      handleFetchAsset(params);
      message.success("Xóa quản lý tài sản thành công!");
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
      title: "Tên",
      dataIndex: "assetName",
      key: "assetName",
      sorter: true,
    },
    {
      title: "Hình ảnh",
      dataIndex: "assetImg",
      key: "assetImg",
      sorter: true,
      width: 130,
      align: "center",
      render: (srcUrl) => (srcUrl ? <PreviewImage srcImg={srcUrl} /> : null),
    },
    {
      title: "Mô tả",
      dataIndex: "assetDescription",
      key: "assetDescription",
      sorter: true,
    },
    {
      title: "Số lượng",
      dataIndex: "assetQuantity",
      key: "assetQuantity",
      sorter: true,
    },
    {
      title: "Đơn vị",
      dataIndex: "assetUnit",
      key: "assetUnit",
      sorter: true,
    },
    {
      title: "Vị trí",
      dataIndex: "assetLocation",
      key: "assetLocation",
      sorter: true,
    },
    {
      title: "Người cập nhật cuối",
      dataIndex: "userIdLastUpdated",
      key: "userIdLastUpdated",
      sorter: true,
    },
    
    {
      title: "Loại",
      dataIndex: "assetType",
      key: "assetType",
      sorter: true,
    },
    {
      title: "Kế toán viên",
      dataIndex: "accountant",
      key: "accountant",
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
          value: ASSET_STATUS.ACTIVE,
        },
        {
          text: "Draff",
          value: ASSET_STATUS.DRAFF,
        },
      ],
      render: (status) => (
        <Tag
          color={status === ASSET_STATUS.ACTIVE ? "success" : "warning"}
          className="cell-status"
        >
          {status || ""}
        </Tag>
      ),
    },
  ];

  if (
    hasPermission(profile, [permission.asset_update]) ||
    hasPermission(profile, [permission.asset_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [
            permission.asset_update,
          ])}
          isHasPermissonDelete={hasPermission(profile, [
            permission.asset_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteAsset(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa quản lý tài sản này?"
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

      handleFetchAsset(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const handleAddNew = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const searchFields = useMemo(() => {
    return [{ label: "Tên quản lý tài sản", value: "assetName" }];
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
    handleFetchAsset(params);
  };

  return (
    <div className="asset-page common-page">
      <div className="asset-content">
        <PageHeader pageTitle="Quản lý tài sản" />
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
          onAction={handleAddNew}
          isHasPermissonAdd={hasPermission(profile, [
            permission.asset_add,
          ])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={assets?.data || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {assets?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={assets?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchAsset(params);
            }}
          />
        )}
      </div>
      {visibleModal && (
        <AddOrEditAssetModal
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchAsset(params);
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
    assets: state.asset?.assets,
    isFetching: state.asset?.isFetching,
  }),
  { actionGetAssets }
)(withRouter(Asset));
