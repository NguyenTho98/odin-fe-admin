import React, { useState } from "react";
import { Image, Typography, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import "./PreviewImage.scss";

const PreviewImage = (props) => {
  const { srcImg = "", height = 0, label = "Xem ảnh" } = props;
  const [visibleMask, setVisibleMask] = useState(false);

  const handleViewImage = () => {
    setVisibleMask(true);
  };

  return (
    <span className="preview-img">
      <Tooltip title={srcImg}>
        <Typography.Text className="btn-view-img" onClick={handleViewImage}>
          {label}
        </Typography.Text>
      </Tooltip>
      {srcImg && visibleMask && (
        <Image
          height={height}
          preview={{
            src: srcImg,
            visible: visibleMask,
            onVisibleChange: () => {
              setVisibleMask(false);
            },
            mask: (
              <div className="ant-image-mask-info">
                <EyeOutlined />
              </div>
            ),
          }}
        />
      )}
    </span>
  );
};

export default PreviewImage;
