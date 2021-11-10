import React from "react";
import { Space, Popconfirm, Divider, Typography, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./TableCellActions.scss";

function TableCellActions(props) {
  const {
    onEdit,
    onDelete,
    deleteNessage,
    isHasPermissonUpdate = false,
    isHasPermissonDelete = false,
  } = props;
  return (
    <Space
      className="table-cell-action"
      size="small"
      split={<Divider type="vertical" />}
    >
      {isHasPermissonUpdate && (
        <Tooltip title="Chỉnh sửa">
          <Typography.Link onClick={onEdit} className="btn-cell-action">
            <EditOutlined />
          </Typography.Link>
        </Tooltip>
      )}
      {isHasPermissonDelete && (
        <Popconfirm
          title={deleteNessage || "Bạn có chắc chắn muốn xóa phần tử này?"}
          onConfirm={onDelete}
          placement="topRight"
        >
          <Tooltip title="Xóa">
            <Typography.Link type="danger" className="btn-cell-action">
              <DeleteOutlined />
            </Typography.Link>
          </Tooltip>
        </Popconfirm>
      )}
    </Space>
  );
}

export default React.memo(TableCellActions);
