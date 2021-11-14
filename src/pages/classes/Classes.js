import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import { actionDeleteClasses, actionGetClassess } from "./ClassesAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddOrEditClassesModal from "./AddOrEditClassesModal";
import "./Classes.scss";
import { permission } from "../../utils/constants/permission";
import PreviewImage from "../../components/previewImage";
let params = {
  page: 1,
  size: 20,
  query: "",
};

const Classes = (props) => {
  const { profile = {}, actionGetClassess, classess = {}, isFetching } = props;
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
    if (isEmpty(profile)) {
      handleFetchClasses(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchClasses = (params = {}) => {
    actionGetClassess({ ...params, page: params.page - 1 });
  };

  const handleDeleteClasses = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteClasses(id);
      handleFetchClasses(params);
      message.success("Xóa lớp học thành công!");
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
      title: "Mã lớp học",
      dataIndex: "code",
      key: "code",
      sorter: true,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Lịch học",
      dataIndex: "schedule",
      key: "schedule",
      sorter: true,
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      sorter: true,
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      sorter: true,
    },
    {
      title: "Số buổi học",
      dataIndex: "available",
      key: "available",
      sorter: true,
    },
    {
      title: "Số học viên",
      dataIndex: "capacity",
      key: "capacity",
      sorter: true,
    },
    {
      title: "Giảng viên",
      dataIndex: "teachers",
      key: "teachers",
      sorter: true,
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
      sorter: true,
    },
    {
      title: "Trung tâm",
      dataIndex: "centre",
      key: "centre",
      sorter: true,
    },
    {
      title: "Khóa học",
      dataIndex: "course",
      key: "course",
      sorter: true,
    },
    {
      title: "Phòng học",
      dataIndex: "classroom",
      key: "classroom",
      sorter: true,
    },
    {
      title: "Trạng thái lớp học",
      dataIndex: "status_classes",
      key: "status_classes",
      sorter: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "classes",
      width: "150px",
      sorter: true,
      // filterMultiple: false,
      // filteredValue: filteredStatus,
      // filters: [
      //   {
      //     text: "Active",
      //     value: CLASSES_STATUS.ACTIVE,
      //   },
      //   {
      //     text: "Draff",
      //     value: CLASSES_STATUS.DRAFF,
      //   },
      // ],
      // render: (status) => (
      //   <Tag
      //     color={status === CLASSES_STATUS.ACTIVE ? "success" : "warning"}
      //     className="cell-status"
      //   >
      //     {status || ""}
      //   </Tag>
      // ),
    },
  ];

  if (
    !hasPermission(profile, [permission.classes_update]) ||
    !hasPermission(profile, [permission.classes_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "classes",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={!hasPermission(profile, [
            permission.classes_update,
          ])}
          isHasPermissonDelete={!hasPermission(profile, [
            permission.classes_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteClasses(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa lớp học này?"
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

      handleFetchClasses(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const handleAddNew = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const searchFields = useMemo(() => {
    return [
      { label: "Tên lớp học ", value: "name " },
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
    handleFetchClasses(params);
  };

  return (
    <div className="classes-page common-page">
      <div className="classes-content">
        <PageHeader pageTitle="Lớp học" />
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
          onAction={handleAddNew}
          isHasPermissonAdd={!hasPermission(profile, [permission.classes_add])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={classess?.results || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {classess?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={classess?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchClasses(params);
            }}
          />
        )}
      </div>
      {visibleModal && (
        <AddOrEditClassesModal
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchClasses(params);
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
    classess: state.classes?.classess,
    isFetching: state.classes?.isFetching,
  }),
  { actionGetClassess }
)(withRouter(Classes));
