import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import {
  actionDeleteUserLesson,
  actionGetUserLessons,
} from "./UserLessonAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddOrEditUserLessonModal from "./AddOrEditUserLessonModal";
import "./UserLesson.scss";
import { permission } from "../../utils/constants/permission";
let params = {
  page: 1,
  size: 20,
  query: "",
};

const UserLesson = (props) => {
  const {
    profile = {},
    actionGetUserLessons,
    userLessons = {},
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
      handleFetchUserLesson(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchUserLesson = (params = {}) => {
    actionGetUserLessons({ ...params, page: params.page - 1 });
  };

  const handleDeleteUserLesson = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteUserLesson(id);
      handleFetchUserLesson(params);
      message.success("Xóa điểm danh thành công!");
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
      title: "Học viên",
      dataIndex: "studentName",
      key: "studentName",
      sorter: true,
    },
    {
      title: "Bài học",
      dataIndex: "lessonName",
      key: "lessonName",
      sorter: true,
    },
    {
      title: "Phòng học",
      dataIndex: "roomName",
      key: "roomName",
      sorter: true,
    },
    {
      title: "Tình trạng",
      dataIndex: "attendStatus",
      key: "attendStatus",
      sorter: true,
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      key: "comment",
      sorter: true,
    },
    {
      title: "Lý do",
      dataIndex: "score",
      key: "score",
      sorter: true,
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   align: "center",
    //   width: "150px",
    //   sorter: true,
    //   filterMultiple: false,
    //   filteredValue: filteredStatus,
    //   filters: [
    //     {
    //       text: "Active",
    //       value: USER_LESSON_STATUS.ACTIVE,
    //     },
    //     {
    //       text: "Draff",
    //       value: USER_LESSON_STATUS.DRAFF,
    //     },
    //   ],
    //   render: (status) => (
    //     <Tag
    //       color={status === USER_LESSON_STATUS.ACTIVE ? "success" : "warning"}
    //       className="cell-status"
    //     >
    //       {status || ""}
    //     </Tag>
    //   ),
    // },
  ];

  if (
    hasPermission(profile, [permission.userLesson_update]) ||
    hasPermission(profile, [permission.userLesson_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [
            permission.userLesson_update,
          ])}
          isHasPermissonDelete={hasPermission(profile, [
            permission.userLesson_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteUserLesson(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa điểm danh này?"
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

      handleFetchUserLesson(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const handleAddNew = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const searchFields = useMemo(() => {
    return [{ label: "ID học viên", value: "userId" }];
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
    handleFetchUserLesson(params);
  };

  return (
    <div className="userLesson-page common-page">
      <div className="userLesson-content">
        <PageHeader pageTitle="Điểm danh" />
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
          onAction={handleAddNew}
          isHasPermissonAdd={hasPermission(profile, [
            permission.userLesson_add,
          ])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={userLessons?.data || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {userLessons?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={userLessons?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchUserLesson(params);
            }}
          />
        )}
      </div>
      {visibleModal && (
        <AddOrEditUserLessonModal
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchUserLesson(params);
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
    userLessons: state.userLesson?.userLessons,
    isFetching: state.userLesson?.isFetching,
  }),
  { actionGetUserLessons }
)(withRouter(UserLesson));
