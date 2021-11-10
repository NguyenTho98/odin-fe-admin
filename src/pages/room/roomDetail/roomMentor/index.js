import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, message, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { isEmpty } from "../../../../utils/helpers";
import {
  actionGetRoomMentors,
  actionDeleteRoomMentors,
} from "./RoomMentorAction";
import AddOrEditRoomMentorModal from "./AddOrEditRoomMentorModal";
import "./RoomMentor.scss";
import { TableCellActions } from "../../../../components";

const RoomMentor = (props) => {
  const {
    profile = {},
    actionGetRoomMentors,
    roomMentors = {},
    isFetching,
    roomId,
  } = props;
  const [processing, setProcessing] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [sortedInfo, setSortedInfo] = useState(null);

  useEffect(() => {
    if (!isEmpty(profile) && roomId) {
      handleFetchRoomUser(roomId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, roomId]);

  const handleFetchRoomUser = (roomId) => {
    actionGetRoomMentors(roomId);
  };

  const handleDeleteRoomUser = async (id) => {
    if (processing) return;
    try {
      setProcessing(true);
      const userIds = id ? [id] : selectedRowKeys;
      await actionDeleteRoomMentors({ ids: userIds, roomId });
      clearFiltersAndSorters();
      setSelectedRowKeys([]);
      handleFetchRoomUser(roomId);
      message.success("Xóa giảng viên thành công!");
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
    }
  };

  const handleEditItem = (item = {}) => {
    setSelectedItem(item);
    setVisibleModal(true);
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
      title: "Chức vụ",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={true}
          isHasPermissonDelete={true}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteRoomUser(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa giảng viên này?"
        />
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
    setSortedInfo(null);
  };

  const handleOnChangeTable = (_, __, sorter) => {
    setSortedInfo(sorter);
  };

  return (
    <div className="room-mentor-page">
      <div className="room-mentor-content">
        <div className="table-header">
          <div className="selected-info">
            <span>Đã chọn</span>
            <span className="select-items">{` ${selectedRowKeys.length}`}</span>
            <span>{`/${(roomMentors?.data || []).length} `}</span>
            <span>giảng viên</span>
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
              Thêm giảng viên
            </Button>
          </div>
        </div>
        <Table
          className="table-content"
          onChange={handleOnChangeTable}
          columns={columns}
          dataSource={roomMentors?.data || []}
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
        <AddOrEditRoomMentorModal
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              clearFiltersAndSorters();
              setSelectedItem();
              handleFetchRoomUser(roomId);
            }
            setVisibleModal(false);
          }}
          roomId={roomId}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default connect(
  (state) => ({
    profile: state.system?.profile,
    roomMentors: state.roomMentor?.roomMentors,
    isFetching: state.roomMentor?.isFetching,
  }),
  { actionGetRoomMentors }
)(RoomMentor);
