import React, { useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Button, Select, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./HeaderAction.scss";

const { Option } = Select;

const HeaderAction = (props) => {
  const {
    onSearch,
    onAction,
    searchFields = [],
    defaultSearchType = null,
    isHasPermissonAdd = false,
    customActions = [],
  } = props;
  const [searchType, setSearchType] = useState(defaultSearchType);

  return (
    <Row className="header-action-content" gutter={[8, 8]}>
      <Col className="filter-data">
        <Row gutter={[8, 8]}>
          <Col className="filter-group">
            <div className="filter-title">Tìm kiếm theo:</div>
            <Input.Group compact className="search-box">
              <Select
                value={searchType}
                onChange={(value) => setSearchType(value)}
                dropdownClassName="dropdown-search-type"
              >
                {searchFields.map((it, idx) => (
                  <Option key={idx} value={it.value}>
                    {it.label}
                  </Option>
                ))}
              </Select>
              <Input.Search
                className="search-input"
                placeholder="Tìm kiếm"
                allowClear
                onSearch={(value) => {
                  onSearch(searchType, `*${value}*`);
                }}
                enterButton
              />
            </Input.Group>
          </Col>
        </Row>
      </Col>
      <Col className="btn-actions">
        {customActions.map((it, idx) => (
          <Button
            type="primary"
            ghost={it.ghost}
            danger={it.danger}
            onClick={it.action}
            className="btn-item"
            key={idx}
            disabled={it.disabled}
          >
            {it.name}
          </Button>
        ))}
        {isHasPermissonAdd && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onAction}>
            Thêm mới
          </Button>
        )}
      </Col>
    </Row>
  );
};

export default React.memo(HeaderAction);

HeaderAction.propTypes = {
  onSearch: PropTypes.func.isRequired,
  searchFields: PropTypes.array.isRequired,
  defaultSearchType: PropTypes.string.isRequired,
};
