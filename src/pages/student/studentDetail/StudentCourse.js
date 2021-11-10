import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, message, Button } from "antd";
import { getStudentCourse } from "../StudentAction";
import PreviewImage from "../../../components/previewImage";
import { routes } from "../../../utils/constants/config";

const StudentCourse = (props) => {
  const {
    profile = {},
    isFetching,
    studentId,
    history
  } = props;

  const [studentCourse, setStudentCourse] = useState([]);

  useEffect(() => {
    if (studentId) {
        handleFetchStudentDetail(studentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, studentId]);


  const handleFetchStudentDetail = async (studentId) => {
    try {
      const { data } = await getStudentCourse(studentId);
      if (data?.data?.length > 0) {
        setStudentCourse(data?.data);
      }
    } catch (error) {
      message.error("Lớp học không tồn tại!");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên khóa học",
      dataIndex: "courseName",
      key: "courseName",
      render: (courseName, record) => (
        <Button
          type="link"
          onClick={() => history?.push(`${routes.COURSES}/${record?.id}`)}
        >
          {courseName || ""}
        </Button>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "courseDescription",
      key: "courseDescription",
    },
    {
      title: "Hình ảnh",
      dataIndex: "courseAvatar",
      width: 130,
      key: "courseAvatar",
      render: (srcUrl) => (srcUrl ? <PreviewImage srcImg={srcUrl} /> : null),
    },
    {
      title: "Ngôn ngữ",
      dataIndex: "language",
      key: "language",
      width: "150px",
    },
    {
      title: "Số lượng bài học",
      dataIndex: "lessonQuantity",
      key: "lessonQuantity",
      align: "center",
      width: "180px",
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   align: "center",
    //   width: "180px",
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

  return (
    <div className="student-user-page">
      <div className="student-user-content">
        <Table
          className="table-content"
          columns={columns}
          dataSource={studentCourse || []}
          loading={isFetching}
          pagination={false}
          rowKey={(record) => record?.id}
          scroll={{ x: true }}
          size="middle"
        />
      </div>
    </div>
  );
};

export default connect(
  (state) => ({
    profile: state.system?.profile,
    studentUsers: state.studentUser?.studentUsers,
    isFetching: state.studentUser?.isFetching,
  }),
  { getStudentCourse }
)(StudentCourse);
