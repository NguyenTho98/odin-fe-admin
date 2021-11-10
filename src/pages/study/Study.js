import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import { actionDeleteStudy, actionGetStudys } from "./StudyAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddOrEditStudyModal from "./AddOrEditStudyModal";
import "./Study.scss";
import { permission } from "../../utils/constants/permission";
import PreviewImage from "../../components/previewImage";
let params = {
  page: 1,
  size: 20,
  query: "",
};

const Study = (props) => {
  const { profile = {}, actionGetStudys, studys = {}, isFetching } = props;
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
      handleFetchStudy(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchStudy = (params = {}) => {
    actionGetStudys({ ...params, page: params.page - 1 });
  };

  const handleDeleteStudy = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteStudy(id);
      handleFetchStudy(params);
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
      title: "Trạng thái",
      dataIndex: "state",
      key: "state",
      sorter: true,
    },
    {
      title: "Lực học",
      dataIndex: "ability",
      key: "ability",
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
    //   align: "study",
    //   width: "150px",
    //   sorter: true,
    //   filterMultiple: false,
    //   filteredValue: filteredStatus,
    //   filters: [
    //     {
    //       text: "Active",
    //       value: STUDY_STATUS.ACTIVE,
    //     },
    //     {
    //       text: "Draff",
    //       value: STUDY_STATUS.DRAFF,
    //     },
    //   ],
    //   render: (status) => (
    //     <Tag
    //       color={status === STUDY_STATUS.ACTIVE ? "success" : "warning"}
    //       className="cell-status"
    //     >
    //       {status || ""}
    //     </Tag>
    //   ),
    // },
  ];

  if (
    !hasPermission(profile, [permission.study_update]) ||
    !hasPermission(profile, [permission.study_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "study",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={!hasPermission(profile, [
            permission.study_update,
          ])}
          isHasPermissonDelete={!hasPermission(profile, [
            permission.study_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteStudy(record.id)}
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

      handleFetchStudy(params);
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
    handleFetchStudy(params);
  };

  return (
    <div className="study-page common-page">
      <div className="study-content">
        <PageHeader pageTitle="Trung tâm" />
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
          onAction={handleAddNew}
          isHasPermissonAdd={!hasPermission(profile, [permission.study_add])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={studys?.results || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {studys?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={studys?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchStudy(params);
            }}
          />
        )}
      </div>
      {visibleModal && (
        <AddOrEditStudyModal
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchStudy(params);
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
    studys: state.study?.studys,
    isFetching: state.study?.isFetching,
  }),
  { actionGetStudys }
)(withRouter(Study));
