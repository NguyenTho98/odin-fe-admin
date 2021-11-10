import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { message, Spin, Tabs } from "antd";
import { PageHeader } from "../../../components";
import { getRoomDetail } from "../RoomAction";
import "./RoomDetail.scss";
import RoomUser from "./roomUser";
import RoomMentor from "./roomMentor";
import RoomInfo from "./RoomInfo";
import { routes } from "../../../utils/constants/config";

const { TabPane } = Tabs;

const RoomDetail = (props) => {
  const { match, history } = props;
  const [isProcessing, setProcessing] = useState(false);
  const [roomDetail, setRoomDetail] = useState({});

  useEffect(() => {
    if (match?.params?.roomId) {
      handleFetchRoomDetail(match?.params?.roomId);
    }
  }, [match]);

  const handleFetchRoomDetail = async (roomId) => {
    try {
      setProcessing(true);
      const { data } = await getRoomDetail(roomId);
      if (data?.data?.length > 0) {
        setRoomDetail(data?.data[0]);
      }
      setProcessing(false);
    } catch (error) {
      message.error("Lớp học không tồn tại!");
      setProcessing(false);
    }
  };

  return (
    <div className="room-detail-page common-page">
      <div className="room-detail-content">
        <Spin spinning={isProcessing}>
          <PageHeader
            pageTitle={
              <div>
                <span
                  className="back-to-room"
                  onClick={() => {
                    history?.push(routes.ROOM);
                  }}
                >{`Phòng học / `}</span>
                <span>{`${roomDetail?.roomName || ""}`}</span>
              </div>
            }
          />
          <Tabs
            type="card"
            defaultActiveKey="roomDetail"
            className="tab-room-detail"
          >
            <TabPane tab="Chi tiết phòng học" key="roomDetail">
              <RoomInfo item={roomDetail} history={history} />
            </TabPane>
            <TabPane tab="Học viên" key="roomUser">
              <RoomUser roomId={roomDetail.id} />
            </TabPane>
            <TabPane tab="Giảng viên" key="roomMentor">
              <RoomMentor roomId={roomDetail.id} />
            </TabPane>
          </Tabs>
        </Spin>
      </div>
    </div>
  );
};

export default withRouter(RoomDetail);
