import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { message, Spin, Tabs } from "antd";
import { PageHeader } from "../../../components";
import { getStudentDetail } from "../StudentAction";
import "./StudentDetail.scss";
import StudentCourse from "./StudentCourse";
import StudentHistory from "./StudentHistory";
import StudentBill from "./StudentBill";
import StudentInfo from "./StudentInfo";
import { routes } from "../../../utils/constants/config";

const { TabPane } = Tabs;

const StudentDetail = (props) => {
  const { match, history } = props;
  const [isProcessing, setProcessing] = useState(false);
  const [studentDetail, setStudentDetail] = useState({});

  useEffect(() => {
    if (match?.params?.studentId) {
      handleFetchStudentDetail(match?.params?.studentId);
    }
  }, [match]);

  const handleFetchStudentDetail = async (studentId) => {
    try {
      setProcessing(true);
      const { data } = await getStudentDetail(studentId);
      if (data?.data?.length > 0) {
        setStudentDetail(data?.data[0]);
      }
      setProcessing(false);
    } catch (error) {
      message.error("Lớp học không tồn tại!");
      setProcessing(false);
    }
  };

  return (
    <div className="student-detail-page common-page">
      <div className="student-detail-content">
        <Spin spinning={isProcessing}>
          <PageHeader
            pageTitle={
              <div>
                <span
                  className="back-to-student"
                  onClick={() => {
                    history?.push(routes.STUDENT);
                  }}
                >{`Học viên / `}</span>
                <span>{`${studentDetail?.fullName || ""}`}</span>
              </div>
            }
          />
          <Tabs
            type="card"
            defaultActiveKey="studentDetail"
            className="tab-student-detail"
          >
            <TabPane tab="Chi tiết học viên" key="studentDetail">
              <StudentInfo item={studentDetail} history={history} />
            </TabPane>
            <TabPane tab="Khoá học" key="studentCourse">
              <StudentCourse studentId={studentDetail.id} />
            </TabPane>
            <TabPane tab="Lịch sử giao dịch" key="studentHistory">
              <StudentHistory studentId={studentDetail.id} />
            </TabPane>
            <TabPane tab="Hóa đơn" key="studentOrder">
              <StudentBill studentId={studentDetail.id} />
            </TabPane>
          </Tabs>
        </Spin>
      </div>
    </div>
  );
};

export default withRouter(StudentDetail);
