import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, message, Pagination, Tag } from "antd";
import { hasPermission, isEmpty } from "../../utils/helpers";
import { actionDeleteCourse, actionGetCourses } from "./CourseAction";
import { TableCellActions, PageHeader, HeaderAction } from "../../components";
import AddOrEditCourseModal from "./AddOrEditCourseModal";
import "./Course.scss";
import { permission } from "../../utils/constants/permission";
import PreviewImage from "../../components/previewImage";
let params = {
  page: 1,
  size: 20,
  query: "",
};

const Course = (props) => {
  const { profile = {}, actionGetCourses, courses = {}, isFetching } = props;
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
      handleFetchCourse(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchCourse = (params = {}) => {
    actionGetCourses({ ...params, page: params.page - 1 });
  };

  const handleDeleteCourse = async (id) => {
    if (processing || !id) return;
    try {
      setProcessing(true);
      await actionDeleteCourse(id);
      handleFetchCourse(params);
      message.success("Xóa khóa học thành công!");
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
      title: "Mã khóa học",
      dataIndex: "code",
      key: "code",
      sorter: true,
    },
    {
      title: "Tên khóa học",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Giá gốc",
      dataIndex: "cost",
      key: "cost",
      sorter: true,
    },
    {
      title: "Giá ca ngày",
      dataIndex: "night_cost",
      key: "night_cost",
      sorter: true,
    },
    {
      title: "Giá ca tối",
      dataIndex: "daytime_cost",
      key: "daytime_cost",
      sorter: true,
    },
    {
      title: "Số buổi học",
      dataIndex: "study_shift_count",
      key: "study_shift_count",
      sorter: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      sorter: true,
    },

    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   align: "course",
    //   width: "150px",
    //   sorter: true,
    //   filterMultiple: false,
    //   filteredValue: filteredStatus,
    //   filters: [
    //     {
    //       text: "Active",
    //       value: COURSE_STATUS.ACTIVE,
    //     },
    //     {
    //       text: "Draff",
    //       value: COURSE_STATUS.DRAFF,
    //     },
    //   ],
    //   render: (status) => (
    //     <Tag
    //       color={status === COURSE_STATUS.ACTIVE ? "success" : "warning"}
    //       className="cell-status"
    //     >
    //       {status || ""}
    //     </Tag>
    //   ),
    // },
  ];

  if (
    !hasPermission(profile, [permission.course_update]) ||
    !hasPermission(profile, [permission.course_delete])
  ) {
    columns.push({
      title: "Action",
      key: "action",
      align: "course",
      width: "100px",
      render: (_, record) => (
        <TableCellActions
          isHasPermissonUpdate={!hasPermission(profile, [
            permission.course_update,
          ])}
          isHasPermissonDelete={!hasPermission(profile, [
            permission.course_delete,
          ])}
          onEdit={() => handleEditItem(record)}
          onDelete={() => handleDeleteCourse(record.id)}
          deleteNessage="Bạn có chắc chắn muốn xóa khóa học này?"
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

      handleFetchCourse(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );

  const handleAddNew = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const searchFields = useMemo(() => {
    return [
      { label: "Tên khóa học ", value: "name " },
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
    handleFetchCourse(params);
  };

  return (
    <div className="course-page common-page">
      <div className="course-content">
        <PageHeader pageTitle="Khóa học" />
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
          onAction={handleAddNew}
          isHasPermissonAdd={!hasPermission(profile, [permission.course_add])}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={courses?.results || []}
          loading={isFetching || processing}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {courses?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={courses?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchCourse(params);
            }}
          />
        )}
      </div>
      {visibleModal && (
        <AddOrEditCourseModal
          visible={visibleModal}
          onCancel={(isRefreshData) => {
            if (isRefreshData) {
              handleFetchCourse(params);
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
    courses: state.course?.courses,
    isFetching: state.course?.isFetching,
  }),
  { actionGetCourses }
)(withRouter(Course));
