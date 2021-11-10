import React, { useEffect, useState, useMemo } from "react";
import { withRouter } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  CalendarOutlined,
  OneToOneOutlined,
  BookOutlined,
  SnippetsOutlined,
  LaptopOutlined,
  UserOutlined,
  TeamOutlined,
  NotificationOutlined,
  ProfileOutlined,
  ClusterOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { ROLES, routes } from "../../../utils/constants/config";
import { lms_plus_logo, plus_logo_96x96 } from "../../../assets";
import "./LeftMenu.scss";
import { hasPermission, hasRole } from "../../../utils/helpers";
import { permission } from "../../../utils/constants/permission";

const { SubMenu } = Menu;

const LeftMenu = (props) => {
  const { location, isCollapsed, profile } = props;
  const [selectedMenu, setSelectedMenu] = useState("");

  useEffect(() => {
    if (location?.pathname !== selectedMenu) {
      handleSelectedMenu(location?.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleSelectedMenu = (pathName = "") => {
    let selectMenu = "";
    Object.keys(routes).some((key) => {
      if (pathName === routes[key]) {
        selectMenu = routes[key];
        return true;
      }
      return false;
    });

    menuList.some((it) => {
      if (selectMenu) {
        return true;
      }
      (it.subMenu || []).some((sub) => {
        if (
          pathName.indexOf(`${sub.key}`) > -1 ||
          pathName.indexOf(`${sub.key}/`) > -1
        ) {
          selectMenu = sub.key;
          return true;
        } else {
          return false;
        }
      });
      return false;
    });

    if (selectMenu) {
      setSelectedMenu(`${selectMenu}`);
    } else {
      setSelectedMenu(`${routes.COURSES}`);
    }
  };

  const goHomePage = () => {
    props.history.push(routes.COURSES);
  };

  const handleChangeMenu = ({ key }) => {
    if (!key) return;
    handleSelectedMenu(key);
    props.history.push(key);
  };

  const menuList = [
    {
      key: "centerManagement",
      icon: <ClusterOutlined />,
      name: "Quản lý Trung tâm",
      isShow: !hasPermission(profile, [permission.room_search]),
      subMenu: [
        {
          key: "/dashboard",
          name: "Dashboard",
          isShow: !hasPermission(profile, [permission.room_search]),
        },
        {
          key: routes.CENTER,
          name: "Trung tâm",
          isShow: !hasPermission(profile, [permission.room_search]),
        },
        {
          key: routes.CLASSES,
          name: "Lớp học",
          isShow: !hasPermission(profile, [permission.room_search]),
        },
        {
          key: routes.CLASSROOM,
          name: "Phòng học",
          isShow: !hasPermission(profile, [permission.room_search]),
        },
        {
          key: routes.COURSES,
          name: "Khóa học",
          isShow: !hasPermission(profile, [permission.room_search]),
        },
      ],
    },
    {
      key: "courseManagement",
      icon: <LaptopOutlined />,
      name: "Quản lý khóa học",
      isShow: !hasPermission(profile, [
        permission.course_search,
        permission.lesson_search,
        permission.session_search,
        permission.material_search,
        permission.assignment_search,
        permission.exam_search,
        permission.quizz_search,
      ]),
      subMenu: [
        {
          key: routes.COURSES,
          icon: <SnippetsOutlined />,
          name: "Khóa học",
          isShow: !hasPermission(profile, [permission.course_search]),
        },
        {
          key: routes.LESSON,
          icon: <BookOutlined />,
          name: "Bài học",
          isShow: !hasPermission(profile, [permission.lesson_search]),
        },
        {
          key: routes.SESSION,
          icon: <CalendarOutlined />,
          name: "Học phần",
          isShow: !hasPermission(profile, [permission.session_search]),
        },
        {
          key: routes.MATERIAL,
          icon: <OneToOneOutlined />,
          name: "Học liệu",
          isShow: !hasPermission(profile, [permission.material_search]),
        },
        {
          key: routes.ASSIGNMENT,
          icon: <OneToOneOutlined />,
          name: "Bài tập",
          isShow: !hasPermission(profile, [permission.assignment_search]),
        },
        {
          key: routes.EXAM,
          icon: <ProfileOutlined />,
          name: "Bài thi",
          isShow: !hasPermission(profile, [permission.exam_search]),
        },
        {
          key: routes.QUIZZ,
          icon: <ProfileOutlined />,
          name: "Quizz",
          isShow: !hasPermission(profile, [permission.quizz_search]),
        },
      ],
    },
    {
      key: "roomManagement",
      icon: <ClusterOutlined />,
      name: "Quản lý lớp học",
      isShow: !hasPermission(profile, [permission.room_search]),
      subMenu: [
        {
          key: routes.ROOM,
          name: "Lớp học",
          isShow: !hasPermission(profile, [permission.room_search]),
        },
        {
          key: routes.USER_LESSON,
          name: "Điểm danh",
          isShow: !hasPermission(profile, [permission.userLesson_search]),
        },
      ],
    },
    {
      key: "revenueAndExpenditure",
      icon: <ClusterOutlined />,
      name: "Quản lý thu chi",
      isShow: !hasPermission(profile, [
        permission.billing_search,
        permission.voucher_search,
        permission.revenue_search,
        permission.orders_search,
        permission.asset_search,
      ]),
      subMenu: [
        
        {
          key: routes.BILLING,
          name: "Hóa đơn",
          isShow: !hasPermission(profile, [permission.billing_search]),
        },
        {
          key: routes.REVENUE,
          name: "Doanh thu",
          isShow: !hasPermission(profile, [permission.revenue_search]),
        },
        {
          key: routes.VOUCHER,
          name: "Khuyến mãi",
          isShow: !hasPermission(profile, [permission.voucher_search]),
        },
        {
          key: routes.STUDENT,
          name: "Danh sách học viên",
          isShow: !hasPermission(profile, [permission.student_search]),
        },
        {
          key: routes.REVENUE_DEBT,
          name: "Danh sách ghi nợ",
          isShow: !hasPermission(profile, [permission.revenue_search]),
        },
        {
          key: routes.ASSET,
          name: "Quản lý tài sản",
          isShow: !hasPermission(profile, [permission.asset_search]),
        },
      ],
    },
    {
      key: "blogManagement",
      icon: <BookOutlined />,
      name: "Quản lý bài viết",
      isShow: hasRole(profile, [
        ROLES.CONTENT_USER,
        ROLES.CONTENT_ADMIN,
        ROLES.SUPER_ADMIN,
      ]),
      subMenu: [
        {
          key: routes.BLOG,
          icon: <BookOutlined />,
          name: "Bài viết",
          isShow: hasRole(profile, [
            ROLES.CONTENT_USER,
            ROLES.CONTENT_ADMIN,
            ROLES.SUPER_ADMIN,
          ]),
        },
      ],
    },
    {
      key: "userManagement",
      icon: <TeamOutlined />,
      name: "Quản lý người dùng",
      isShow: !hasPermission(profile, [
        permission.user_search,
        permission.role_search,
        permission.api_search,
      ]),
      subMenu: [
        {
          key: routes.USER,
          icon: <UserOutlined />,
          name: "Quản lý người dùng",
          isShow: !hasPermission(profile, [permission.user_search]),
        },
        {
          key: routes.MENTOR,
          icon: <UserOutlined />,
          name: "Giảng viên",
          isShow: !hasPermission(profile, [permission.mentor_search]),
        },
        {
          key: routes.ROLE,
          icon: <BookOutlined />,
          name: "Quản lý nhóm quyền",
          isShow: !hasPermission(profile, [permission.role_search]),
        },
        {
          key: routes.API,
          icon: <BookOutlined />,
          name: "Quản lý quyền",
          isShow: !hasPermission(profile, [permission.api_search]),
        },
      ],
    },
    {
      key: "roomSale",
      icon: <ClusterOutlined />,
      name: "Quản lý bán hàng",
      isShow: !hasPermission(profile, [permission.room_search]),
      subMenu: [
        {
          key: routes.ORDERS,
          name: "Đơn hàng",
          isShow: !hasPermission(profile, [permission.orders_search]),
        },
        {
          key: routes.ORDERS_MENTOR,
          name: "Đặt lịch giảng viên",
          isShow: !hasPermission(profile, [permission.ordersMentorAdmin_search]),
        },
      ],
    },
    {
      key: "notification",
      icon: <NotificationOutlined />,
      name: "Quản lý tin nhắn",
      isShow: true,
      subMenu: [
        {
          key: "email",
          name: "Email",
          isShow: true,
        },
        {
          key: "alarm",
          name: "Thông báo",
          isShow: true,
        },
      ],
    },
  ];

  const defaultOpenKey = useMemo(() => {
    const pathName = location?.pathname || "";
    let openKey = "";
    menuList.some((it) => {
      if (openKey) {
        return true;
      }
      (it.subMenu || []).some((sub) => {
        if (
          pathName.indexOf(`${sub.key}`) > -1 ||
          pathName.indexOf(`${sub.key}/`) > -1
        ) {
          openKey = it.key;
          return true;
        } else {
          return false;
        }
      });
      return false;
    });
    return openKey;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout.Sider
      collapsed={isCollapsed}
      width={220}
      className="left-menu-container"
    >
      <div className="app-logo">
        <span role="img" className="anticon" onClick={goHomePage}>
          <img
            className="img-logo"
            alt=""
            src={isCollapsed ? plus_logo_96x96 : lms_plus_logo}
          />
        </span>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        // defaultSelectedKeys={[`${location?.pathname || routes.COURSES}`]}
        selectedKeys={[selectedMenu]}
        defaultOpenKeys={[defaultOpenKey || "courseManagement"]}
        className="menu-list"
        onClick={handleChangeMenu}
      >
        {menuList.map(
          (item) =>
            item.isShow && (
              <SubMenu key={item.key} icon={item.icon} title={item.name}>
                {item.subMenu ? (
                  item.subMenu.map(
                    (subItem) =>
                      subItem.isShow && (
                        <Menu.Item
                          key={subItem.key}
                          icon={subItem.icon || null}
                        >
                          {subItem.name}
                        </Menu.Item>
                      )
                  )
                ) : (
                  <></>
                )}
              </SubMenu>
            )
        )}
      </Menu>
    </Layout.Sider>
  );
};

export default connect(
  (state) => ({
    profile: state.system.profile,
  }),
  {}
)(withRouter(LeftMenu));
