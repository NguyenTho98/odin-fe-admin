import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import { actionDeleteLesson, actionGetLessons } from "./LessonAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddOrEditLessonModal from "./AddOrEditLessonModal";
import "./Lesson.scss";
import { LESSON_STATUS } from "../../utils/constants/config";
import { permission } from "../../utils/constants/permission";
import PreviewImage from "../../components/previewImage";
let params = {
  page: 1,
  size: 20,
  query: "",
};

const Lesson = (props) => {
  const { profile = {}, actionGetLessons, lessons = {}, isFetching } = props;
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
      handleFetchLesson(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchLesson = (params = {}) => {
    actionGetLessons({ ...params, page: params.page - 1 });
  };

  const handleDeleteLesson = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteLesson(id);
      handleFetchLesson(params);
      message.success("Xóa bài học thành công!");
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
      title: "Tên bài học",
      dataIndex: "lessonName",
      key: "lessonName",
      sorter: true,
    },
    {
      title: "Tên khóa học",
      dataIndex: "courseName",
      key: "courseName",
      sorter: true,
    },
    {
      title: "Mô tả",
      dataIndex: "lessonDescription",
      key: "lessonDescription",
      sorter: true,
    },
    {
      title: "Hình ảnh",
      dataIndex: "lessonAvatar",
      key: "lessonAvatar",
      width: 130,
      render: (srcUrl) => (srcUrl ? <PreviewImage srcImg={srcUrl} /> : null),
    },
    {
      title: "Thể loại",
      dataIndex: "lessonType",
      key: "lessonType",
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
          value: LESSON_STATUS.ACTIVE,
        },
        {
          text: "Draff",
          value: LESSON_STATUS.DRAFF,
        },
      ],
      render: (status) => (
        <Tag
          color={status === LESSON_STATUS.ACTIVE ? "success" : "warning"}
          className="cell-status"
        >
          {status || ""}
        </Tag>
      ),
    },
  ];

  if (
    hasPermission(profile, [permission.lesson_update]) ||
    hasPermission(profile, [permission.lesson_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "center",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={hasPermission(profile, [
            permission.lesson_update,
          ])}
          isHasPermissonDelete={hasPermission(profile, [
            permission.lesson_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteLesson(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa bài học này?"
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

      handleFetchLesson(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const handleAddNew = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const searchFields = useMemo(() => {
    return [
      { label: "Tên bài học", value: "lessonName" },
      { label: "Mô tả", value: "lessonDescription" },
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
    handleFetchLesson(params);
  };

  return (
    <div className="lesson-page common-page">
      <div className="lesson-content">
        <PageHeader pageTitle="Bài học" />
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
          onAction={handleAddNew}
          isHasPermissonAdd={hasPermission(profile, [permission.lesson_add])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={lessons?.data || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {lessons?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={lessons?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchLesson(params);
            }}
          />
        )}
      </div>
      {visibleModal && (
        <AddOrEditLessonModal
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchLesson(params);
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
    lessons: state.lesson?.lessons,
    isFetching: state.lesson?.isFetching,
  }),
  { actionGetLessons }
)(withRouter(Lesson));
