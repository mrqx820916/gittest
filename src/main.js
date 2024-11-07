import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css'
import './styles/index.scss'
import 'amfe-flexible'

// 按需引入 vant 组件
import {
  Button,
  NavBar,
  Tabbar,
  TabbarItem,
  Icon,
  Search,
  Swipe,
  SwipeItem,
  Grid,
  GridItem,
  Card,
  Tag,
  List,
  PullRefresh,
  Empty,
  Form,
  Field,
  CellGroup,
  Cell,
  Checkbox,
  CheckboxGroup,
  SubmitBar,
  Stepper,
  SwipeCell,
  AddressEdit,
  AddressList,
  Popup,
  ActionSheet,
  Tab,
  Tabs,
  Dialog,
  Toast,
  Loading,
  Uploader,
  Rate
} from 'vant'

const app = createApp(App)

// 注册 vant 组件
const components = [
  Button,
  NavBar,
  Tabbar,
  TabbarItem,
  Icon,
  Search,
  Swipe,
  SwipeItem,
  Grid,
  GridItem,
  Card,
  Tag,
  List,
  PullRefresh,
  Empty,
  Form,
  Field,
  CellGroup,
  Cell,
  Checkbox,
  CheckboxGroup,
  SubmitBar,
  Stepper,
  SwipeCell,
  AddressEdit,
  AddressList,
  Popup,
  ActionSheet,
  Tab,
  Tabs,
  Dialog,
  Toast,
  Loading,
  Uploader,
  Rate
]

components.forEach(component => {
  app.use(component)
})

app.use(createPinia())
app.use(router)

app.mount('#app') 