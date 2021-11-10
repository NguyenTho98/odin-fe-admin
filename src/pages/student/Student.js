import React, { useCallback, useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, Pagination, Button } from "antd";
import { isEmpty } from "../../utils/helpers";
import { actionGetStudents } from "./StudentAction";
import { PageHeader, HeaderAction } from "../../components";
import "./Student.scss";
let params = {
  page: 1,
  size: 20,
  query: "type==STUDENT",
};

const Student = (props) => {
  const {
    profile = {},
    actionGetStudents,
    students = {},
    isFetching,
    history,
  } = props;
  const [filteredStatus, setFilteredStatus] = useState([]);
  const [searchData, setSearchData] = useState({});

  useEffect(() => {
    return () => {
      params = {
        page: 1,
        size: 20,
        query: "type==STUDENT",
      };
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(profile)) {
      handleFetchStudent(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleFetchStudent = (params = {}) => {
    actionGetStudents({ ...params, page: params.page - 1 });
  };



  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: true,
      render: (id, record) => (
        <Button type="link" onClick={() => history?.push(`student/${record?.id}`)}>
          {id || ""}
        </Button>
      ),
    },
    {
      title: "Tên tài khoản",
      dataIndex: "userName",
      key: "userName",
      sorter: true,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: true,
    },
    {
      title: "Tên quyền",
      dataIndex: "roles",
      key: "roles",
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      sorter: true,
    },
    // {
    //   title: "Thành tựu",
    //   dataIndex: "achievement",
    //   key: "achievement",
    //   sorter: true,
    // },
    // {
    //   title: "Huy hiệu",
    //   dataIndex: "star",
    //   key: "star",
    //   sorter: true,
    // },
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
    //       value: STUDENT_STATUS.ACTIVE,
    //     },
    //     {
    //       text: "Draff",
    //       value: STUDENT_STATUS.DRAFF,
    //     },
    //   ],
    //   render: (status) => (
    //     <Tag
    //       color={status === STUDENT_STATUS.ACTIVE ? "success" : "warning"}
    //       className="cell-status"
    //     >
    //       {status || ""}
    //     </Tag>
    //   ),
    // },
  ];

//   if (
//     hasPermission(profile, [permission.student_update]) ||
//     hasPermission(profile, [permission.student_delete])
//   ) {
//     columns.push({
//       title: "Action",
//       key: "action",
//       align: "center",
//       width: "100px",
//       render: (_, record) => (
//         <TableCellActions
//           isHasPermissonUpdate={hasPermission(profile, [
//             permission.student_update,
//           ])}
//           isHasPermissonDelete={hasPermission(profile, [
//             permission.student_delete,
//           ])}
//           onEdit={() => handleEditItem(record)}
//           onDelete={() => handleDeleteStudent(record.id)}
//           deleteNessage="Bạn có chắc chắn muốn xóa học viên này?"
//         />
//       ),
//     });
//   }

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

      handleFetchStudent(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredStatus]
  );


  const searchFields = useMemo(() => {
    return [
      { label: "Tên học viên", value: "studentName" },
      { label: "Mô tả", value: "studentDescription" },
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
    handleFetchStudent(params);
  };

  return (
    <div className="student-page common-page">
      <div className="student-content">
        <PageHeader pageTitle="Học viên" />
        <HeaderAction
          searchFields={searchFields}
          defaultSearchType={searchFields[0]?.value}
          onSearch={handleSearch}
        />
        <Table
          className="table-content"
          columns={columns}
          dataSource={students?.data || []}
          loading={isFetching}
          pagination={false}
          rowKey={(record) => record?.id}
          onChange={handleOnChangeTable}
          scroll={{ x: true }}
          size="middle"
        />
        {students?.page?.total_elements > 0 && (
          <Pagination
            size="small"
            className="pagination-table"
            defaultCurrent={params.page}
            defaultPageSize={params.size}
            total={students?.page?.total_elements || 0}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} phần tử`}
            onChange={(page, size) => {
              params = { ...params, page: page, size: size };
              handleFetchStudent(params);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default connect(
  (state) => ({
    profile: state.system?.profile,
    students: state.student?.students,
    isFetching: state.student?.isFetching,
  }),
  { actionGetStudents }
)(withRouter(Student));
