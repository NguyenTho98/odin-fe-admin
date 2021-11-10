import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag, Button } from "antd";
import moment from "moment";
import { hasPermission, isEmpty } from "../../utils/helpers";
import { actionDeleteRoom, actionGetRooms } from "./RoomAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddOrEditRoomModal from "./AddOrEditRoomModal";
import "./Room.scss";
import { ROOM_STATUS, routes } from "../../utils/constants/config";
import { permission } from "../../utils/constants/permission";
let params = {
  page: 1,
  size: 20,
  query: "",
};

const Room = (props) => {
  const {
    profile = {},
    actionGetRooms,
    rooms = {},
    isFetching,
    history,
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
      handleFetchRoom(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchRoom = (params = {}) => {
    actionGetRooms({ ...params, page: params.page - 1 });
  };

  const handleDeleteRoom = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteRoom(id);
      handleFetchRoom(params);
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
      title: "Phòng học",
      dataIndex: "roomName",
      key: "roomName",
      sorter: true,
      render: (roomName, record) => (
        <Button type="link" onClick={() => history?.push(`room/${record?.id}`)}>
          {roomName || ""}
        </Button>
      ),
    },
    {
      title: "Khóa học",
      dataIndex: "courseName",
      key: "courseName",
      render: (courseName, record) => (
        <Button
          type="link"
          onClick={() => history?.push(`${routes.COURSES}/${record?.courseId}`)}
        >
          {courseName || ""}
        </Button>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "roomDescription",
      key: "roomDescription",
      sorter: true,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      sorter: true,
      render: (startDate) => (
        <span>{startDate ? moment(startDate).format("DD/MM/YYYY") : ""}</span>
      ),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      sorter: true,
      render: (endDate) => (
        <span>{endDate ? moment(endDate).format("DD/MM/YYYY") : ""}</span>
      ),
    },
    {
      title: "Tổng số thành viên",
      dataIndex: "totalUser",
      key: "totalUser",
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
          value: ROOM_STATUS.ACTIVE,
        },
        {
          text: "Draff",
          value: ROOM_STATUS.DRAFF,
        },
      ],
      render: (status) => (
        <Tag
          color={status === ROOM_STATUS.ACTIVE ? "success" : "warning"}
          className="cell-status"
        >
          {status || ""}
        </Tag>
      ),
    },
  ];

  if (
    hasPermission(profile, [permission.room_update]) ||
    hasPermission(profile, [permission.room_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [
            permission.room_update,
          ])}
          isHasPermissonDelete={hasPermission(profile, [
            permission.room_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteRoom(record.id)}
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

      handleFetchRoom(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const handleAddNew = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const searchFields = useMemo(() => {
    return [
      { label: "Tên phòng học", value: "roomName" },
      { label: "Mô tả", value: "roomDescription" },
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
    handleFetchRoom(params);
  };

  return (
    <div className="room-page common-page">
      <div className="room-content">
        <PageHeader pageTitle="Phòng học" />
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
          onAction={handleAddNew}
          isHasPermissonAdd={hasPermission(profile, [permission.room_add])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={rooms?.data || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {rooms?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={rooms?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchRoom(params);
            }}
          />
        )}
      </div>
      {visibleModal && (
        <AddOrEditRoomModal
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchRoom(params);
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
    rooms: state.room?.rooms,
    isFetching: state.room?.isFetching,
  }),
  { actionGetRooms }
)(withRouter(Room));
