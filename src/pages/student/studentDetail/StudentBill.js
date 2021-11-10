import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, message } from "antd";
import { getStudentBill } from "../StudentAction";
import PreviewImage from "../../../components/previewImage";

const StudentBill = (props) => {
  const {
    profile = {},
    isFetching,
    studentId,
  } = props;

  const [studentBill, setStudentBill] = useState([]);

  useEffect(() => {
    if (studentId) {
        handleFetchStudentDetail(studentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, studentId]);


  const handleFetchStudentDetail = async (studentId) => {
    try {
      const { data } = await getStudentBill(studentId);
      if (data?.data?.length > 0) {
        setStudentBill(data?.data);
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
      title: "Học viên",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Nhân viên sale",
      dataIndex: "salerName",
      key: "salerName",
    },
    {
      title: "Hóa đơn",
      dataIndex: "billImg",
      key: "billImg",
      width: 130,
      render: (srcUrl) => (srcUrl ? <PreviewImage srcImg={srcUrl} /> : null),
    },
    {
      title: "Biên lại",
      dataIndex: "receipts",
      key: "receipts",
      width: 130,
      render: (srcUrl) => (srcUrl ? <PreviewImage srcImg={srcUrl} /> : null),
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      align: "right",
      key: "amount",
      render: (amount) => (
        <div style={{ textAlign: "right" }}>
          {amount ? `${amount} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
        </div>
      ),
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
    //       value: BILLING_STATUS.ACTIVE,
    //     },
    //     {
    //       text: "Draff",
    //       value: BILLING_STATUS.DRAFF,
    //     },
    //   ],
    //   render: (status) => (
    //     <Tag
    //       color={status === BILLING_STATUS.ACTIVE ? "success" : "warning"}
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
          dataSource={studentBill || []}
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
  { getStudentBill }
)(StudentBill);
