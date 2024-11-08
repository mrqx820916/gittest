import {
  Button,
  Cell,
  CellGroup,
  Icon,
  Image as VanImage,
  Loading,
  NavBar,
  Tabbar,
  TabbarItem,
  Toast,
  Dialog,
  Field,
  Form,
  Grid,
  GridItem,
  List,
  PullRefresh,
  Tag,
  Card,
  Swipe,
  SwipeItem,
  Lazyload,
  Stepper,
  SubmitBar,
  Checkbox,
  CheckboxGroup,
  SwipeCell,
  Empty,
  AddressEdit,
  AddressList,
  Area,
  Popup,
  Search,
  Tab,
  Tabs,
  Divider,
  Rate,
  ShareSheet,
  ActionSheet,
  Circle,
  Progress,
  Sidebar,
  SidebarItem,
  TimePicker,
  CouponList
} from 'vant'

const components = [
  Button,
  Cell,
  CellGroup,
  Icon,
  VanImage,
  Loading,
  NavBar,
  Tabbar,
  TabbarItem,
  Field,
  Form,
  Grid,
  GridItem,
  List,
  PullRefresh,
  Tag,
  Card,
  Swipe,
  SwipeItem,
  Stepper,
  SubmitBar,
  Checkbox,
  CheckboxGroup,
  SwipeCell,
  Empty,
  AddressEdit,
  AddressList,
  Area,
  Popup,
  Search,
  Tab,
  Tabs,
  Divider,
  Rate,
  ShareSheet,
  ActionSheet,
  Circle,
  Progress,
  Sidebar,
  SidebarItem,
  TimePicker,
  CouponList
]

export function vant(app) {
  // 注册组件
  components.forEach(component => {
    app.use(component)
  })
  
  // 注册指令
  app.use(Lazyload, {
    lazyComponent: true,
    loading: 'https://img.yzcdn.cn/vant/loading.gif',
    error: 'https://img.yzcdn.cn/vant/empty.png'
  })
  
  // 注册全局方法
  app.config.globalProperties.$toast = Toast
  app.config.globalProperties.$dialog = Dialog
} 