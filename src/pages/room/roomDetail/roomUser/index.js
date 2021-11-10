import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, message, Tag, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { isEmpty } from "../../../../utils/helpers";
import { actionGetRoomUsers, actionDeleteRoomUsers } from "./RoomUserAction";
import AddRoomUserModal from "./AddRoomUserModal";
import "./RoomUser.scss";
import { ITEM_STATUS } from "../../../../utils/constants/config";

const RoomUser = (props) => {
  const {
    profile = {},
    actionGetRoomUsers,
    roomUsers = {},
    isFetching,
    roomId,
  } = props;
  const [processing, setProcessing] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [sortedInfo, setSortedInfo] = useState(null);

  useEffect(() => {
    if (!isEmpty(profile) && roomId) {
      handleFetchRoomUser(roomId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, roomId]);

  const handleFetchRoomUser = (roomId) => {
    actionGetRoomUsers(roomId);
  };

  const handleDeleteRoomUser = async () => {
    if (processing || !selectedRowKeys.length) return;
    try {
      setProcessing(true);
      await actionDeleteRoomUsers({ ids: selectedRowKeys, roomId });
      clearFiltersAndSorters();
      setSelectedRowKeys([]);
      handleFetchRoomUser(roomId);
      message.success("Xóa học viên thành công!");
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => `${a.id}`.localeCompare(`${b.id}`),
      sortOrder: sortedInfo?.columnKey === "id" && sortedInfo?.order,
    },
    {
      title: "Họ và Tên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => `${a.fullName}`.localeCompare(`${b.fullName}`),
      sortOrder: sortedInfo?.columnKey === "fullName" && sortedInfo?.order,
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "userName",
      key: "userName",
      sorter: (a, b) => `${a.userName}`.localeCompare(`${b.userName}`),
      sortOrder: sortedInfo?.columnKey === "userName" && sortedInfo?.order,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => `${a.email}`.localeCompare(`${b.email}`),
      sortOrder: sortedInfo?.columnKey === "email" && sortedInfo?.order,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => `${a.phone}`.localeCompare(`${b.phone}`),
      sortOrder: sortedInfo?.columnKey === "phone" && sortedInfo?.order,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => `${a.address}`.localeCompare(`${b.address}`),
      sortOrder: sortedInfo?.columnKey === "address" && sortedInfo?.order,
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      align: "center",
      width: "140px",
      filters: [
        {
          text: "Hoạt động",
          value: ITEM_STATUS.ACTIVE,
        },
        {
          text: "Bản nháp",
          value: ITEM_STATUS.DRAFF,
        },
      ],
      filteredValue: filteredInfo?.status || null,
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag
          color={status === ITEM_STATUS.ACTIVE ? "success" : "warning"}
          className="cell-status"
        >
          {status || ""}
        </Tag>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowKeys) => {
      setSelectedRowKeys(rowKeys || []);
    },
  };

  const clearFiltersAndSorters = () => {
    setFilteredInfo(null);
    setSortedInfo(null);
  };

  const handleOnChangeTable = (_, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  return (
    <div className="room-user-page">
      <div className="room-user-content">
        <div className="table-header">
          <div className="selected-info">
            <span>Đã chọn</span>
            <span className="select-items">{` ${selectedRowKeys.length}`}</span>
            <span>{`/${(roomUsers?.data || []).length} `}</span>
            <span>học viên</span>
          </div>
          <div>
            <Button
              className="btn-action"
              type="primary"
              danger
              onClick={handleDeleteRoomUser}
              disabled={selectedRowKeys.length === 0}
            >
              Xóa
            </Button>
            <Button
              className="btn-action btn-add-new"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setVisibleModal(true)}
            >
              Thêm học viên
            </Button>
          </div>
        </div>
        <Table
          className="table-content"
          onChange={handleOnChangeTable}
          columns={columns}
          dataSource={roomUsers?.data || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          scroll={{ x: true }}
          size="middle"
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
        />
      </div>
      {visibleModal && (
        <AddRoomUserModal
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              clearFiltersAndSorters();
              handleFetchRoomUser(roomId);
            }
            setVisibleModal(false);
          }}
          roomId={roomId}
        />
      )}
    </div>
  );
};

export default connect(
  (state) => ({
    profile: state.system?.profile,
    roomUsers: state.roomUser?.roomUsers,
    isFetching: state.roomUser?.isFetching,
  }),
  { actionGetRoomUsers }
)(RoomUser);
