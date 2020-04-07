/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter,PageHeaderWrapper } from '@ant-design/pro-layout';
import React, {useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Link, useIntl, connect } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { Result, Button, Tabs  } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getAuthorityFromRouter  } from '@/utils/utils';
import logo from '../assets/logo.svg';
 

const { TabPane } = Tabs;
const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList) =>
  menuList.map((item) => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
  });

const defaultFooterDom = (
  <DefaultFooter
    copyright="2019 蚂蚁金服体验技术部出品"
    links={[
      {
        key: 'Ant Design Pro',
        title: 'Ant Design Pro',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/ant-design/ant-design-pro',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);



const BasicLayout = (props) => {
   const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  const panes = [
    {
      key: 'tab1',
      tab: '欢迎',
    },
    {
      key: 'tab2',
      tab: 'MapBox',
    },
    {
      key: 'tab3',
      tab: 'List',
    }
  ];
 const [activeKey, setActiveKey] = useState('welcome');
  console.log(props)
 
  /**
   * constructor
   */

  useEffect(() => {
    
    props.history.push(activeKey);
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);

  const onChange = (activeKey) => {
    console.log(activeKey)
    setActiveKey(activeKey)
    props.history.push(activeKey);
  };
  /**
   * init variables
   */

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  // const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
  //   authority: undefined,
  // };
  const {} = useIntl();
  return (
    <ProLayout
      logo={logo}
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/">
          {logoDom}
          {titleDom}
        </Link>
      )}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: '首页',
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={() => defaultFooterDom}
      menuDataRender={menuDataRender}
      rightContentRender={() => <RightContent />}
      {...props}
      {...settings}
    >
      {/* <PageHeaderWrapper tabList={panes} onTabChange={onOperationTabChange}> 
        {children}
      </PageHeaderWrapper> */}
      {/* <Authorized authority={authorized.authority} noMatch={noMatch}>
        {children}
      </Authorized> */}
      <Tabs activeKey={activeKey} type="editable-card"  onChange={onChange}
            >
              {props.route.routes.map((route) => (
                <TabPane tab={route.name} key={route.key}>
                   <Switch>
                   <Route key={route.path} path={route.path} closable="false" component={route.component} exact={route.exact} />
                  </Switch> 
                </TabPane>
              ))}
            </Tabs>
    </ProLayout>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
