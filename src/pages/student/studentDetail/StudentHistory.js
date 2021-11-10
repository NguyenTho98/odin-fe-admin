import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, message,  } from "antd";
import { getStudentHistory } from "../StudentAction";

const StudentHistory= (props) => {
  const {
    profile = {},
    isFetching,
    studentId,
  } = props;

  const [studentHistory, setStudentHistory] = useState([]);

  useEffect(() => {
    if (studentId) {
        handleFetchStudentDetail(studentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, studentId]);


  const handleFetchStudentDetail = async (studentId) => {
    try {
      const { data } = await getStudentHistory(studentId);
      if (data?.data?.length > 0) {
        setStudentHistory(data?.data);
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
      sorter: true,
    },
    {
      title: "Tên học sinh",
      dataIndex: "userName",
      key: "userName",
      sorter: true,
    },
    {
      title: "Tên khóa học",
      dataIndex: "courseName",
      key: "courseName",
      sorter: true,
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      sorter: true,
      render: (amount) => (
        <div style={{ textAlign: "right" }}>
          {amount ? `${amount} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
        </div>
      ),
    },
    {
      title: "Ghi nợ",
      dataIndex: "debit",
      key: "debit",
      sorter: true,
      render: (debit) => (
        <div style={{ textAlign: "right" }}>
          {debit ? `${debit} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
        </div>
      ),
    },
    {
      title: "total",
      dataIndex: "total",
      key: "total",
      sorter: true,
      render: (total) => (
        <div style={{ textAlign: "right" }}>
          {total ? `${total} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
        </div>
      ),
    },
    {
      title: "Mã giảm giá",
      dataIndex: "voucherCode",
      key: "voucherCode",
      sorter: true,
    },
    {
      title: "Tên nhân viên",
      dataIndex: "salerName",
      key: "salerName",
      sorter: true,
    },
    {
      title: "Mã người giới thiệu",
      dataIndex: "refId",
      key: "refId",
      sorter: true,
    },
    {
      title: "Ghi chú",
      dataIndex: "noted",
      key: "noted",
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
    //       value: REVENUE_STATUS.ACTIVE,
    //     },
    //     {
    //       text: "Draff",
    //       value: REVENUE_STATUS.DRAFF,
    //     },
    //   ],
    //   render: (status) => (
    //     <Tag
    //       color={status === REVENUE_STATUS.ACTIVE ? "success" : "warning"}
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
          dataSource={studentHistory || []}
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
  { getStudentHistory }
)(StudentHistory);
