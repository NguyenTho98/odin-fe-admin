import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import { actionDeleteClassRoom, actionGetClassRooms } from "./ClassRoomAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddOrEditClassRoomModal from "./AddOrEditClassRoomModal";
import "./ClassRoom.scss";
import { permission } from "../../utils/constants/permission";
import PreviewImage from "../../components/previewImage";
let params = {
  page: 1,
  size: 20,
  query: "",
};

const ClassRoom = (props) => {
  const { profile = {}, actionGetClassRooms, classRooms = {}, isFetching } = props;
  const [processing, setProcessing] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [filteredStatus, setFilteredStatus] = useState([]);
  const [searchData, setSearchData] = useState({});
  console.log("classRooms", classRooms);
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
      handleFetchClassRoom(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchClassRoom = (params = {}) => {
    actionGetClassRooms({ ...params, page: params.page - 1 });
  };

  const handleDeleteClassRoom = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteClassRoom(id);
      handleFetchClassRoom(params);
      message.success("Xóa phòng học thành công!");
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
      title: "Mã phòng học",
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
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      sorter: true,
    },
    {
      title: "Số ghế",
      dataIndex: "size",
      key: "size",
      sorter: true,
    },
    
    {
      title: "Trung tâm",
      dataIndex: "center",
      key: "center",
      sorter: true,
    },
  
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   align: "classRoom",
    //   width: "150px",
    //   sorter: true,
    //   filterMultiple: false,
    //   filteredValue: filteredStatus,
    //   filters: [
    //     {
    //       text: "Active",
    //       value: CLASSROOM_STATUS.ACTIVE,
    //     },
    //     {
    //       text: "Draff",
    //       value: CLASSROOM_STATUS.DRAFF,
    //     },
    //   ],
    //   render: (status) => (
    //     <Tag
    //       color={status === CLASSROOM_STATUS.ACTIVE ? "success" : "warning"}
    //       className="cell-status"
    //     >
    //       {status || ""}
    //     </Tag>
    //   ),
    // },
  ];

  if (
    !hasPermission(profile, [permission.classRoom_update]) ||
    !hasPermission(profile, [permission.classRoom_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "classRoom",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={!hasPermission(profile, [
            permission.classRoom_update,
          ])}
          isHasPermissonDelete={!hasPermission(profile, [
            permission.classRoom_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteClassRoom(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa phòng học này?"
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

      handleFetchClassRoom(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const handleAddNew = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const searchFields = useMemo(() => {
    return [
      { label: "Tên phòng học ", value: "name " },
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
    handleFetchClassRoom(params);
  };

  return (
    <div className="classRoom-page common-page">
      <div className="classRoom-content">
        <PageHeader pageTitle="Phòng học" />
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
          onAction={handleAddNew}
          isHasPermissonAdd={!hasPermission(profile, [permission.classRoom_add])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={classRooms?.results || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {classRooms?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={classRooms?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchClassRoom(params);
            }}
          />
        )}
      </div>
      {visibleModal && (
        <AddOrEditClassRoomModal
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchClassRoom(params);
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
    classRooms: state.classRoom?.classRooms,
    isFetching: state.classRoom?.isFetching,
  }),
  { actionGetClassRooms }
)(withRouter(ClassRoom));
