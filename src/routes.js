// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import TableChartIcon from '@material-ui/icons/TableChart';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import MyLocationIcon from '@material-ui/icons/MyLocation';

// core components/views for Admin layout
import ElectricalConnectivity from "views/Electrical-connectivity/econnectivity";
import PhysicalConnectivity from "views/Physical-connectivity/pconnectivity";
import FeedingPointMatrix from "views/Feeding-point-matrix/feedingpointmatrix";
import DashboardPage from "views/Dashboard/Dashboard";
import switchtable from "views/Switch-Table/switchtable";
import logs from "views/Logs/Logs";
import SingleLineMapScreen from "./views/SingleLineMapScreen/SingleLineMapScreen";
//import FaultGenerator from "views/FaultGenerater/FaultGenerator";

// core components/views for RTL layout

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Home",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/singlemap",
    name: "Single LIne Map",
    rtlName: "طباعة",
    icon: MyLocationIcon,
    component: SingleLineMapScreen,
    layout: "/admin"
  },

  {
    path: "/pconnectivity",
    name: "Physical Connectivity",
    rtlName: "قائمة الجدول",
    icon: SettingsInputComponentIcon,
    component: PhysicalConnectivity,
    layout: "/admin"
  },
  {
    path: "/econnectivity",
    name: "Electrical Connectivity",
    rtlName: "طباعة",
    icon: OfflineBoltIcon,
    component: ElectricalConnectivity,
    layout: "/admin"
  },
  {
    path: "/feedingpointmatrix",
    name: "Feeding Point Matrix",
    rtlName: "طباعة",
    icon: FlashOnIcon,
    component: FeedingPointMatrix,
    layout: "/admin"
  },
  {
    path: "/switchtable",
    name: "Switches Table",
    rtlName: "طباعة",
    icon: TableChartIcon,
    component: switchtable,
    layout: "/admin"
  },
  {
    path: "/logs",
    name: "Logs",
    rtlName: "طباعة",
    icon: AccessAlarmIcon,
    component: logs,
    layout: "/admin"
  },

];

export default dashboardRoutes;
