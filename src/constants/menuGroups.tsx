import {
  TextSnippet,
  StarBorder,
  TrendingUp,
  FavoriteBorder,
  TableRestaurantOutlined,
  ChatOutlined,
  PaymentOutlined,
  CorporateFare,
  AccessTime,
} from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import styles from "@/components/Layouts/Sidebar/Sidebar.module.scss";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { PERMISSIONS } from "@/constants/permissionsNames";
import BlockIcon from "@mui/icons-material/Block";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import { SidebarItemProps } from "@/types/sidebar";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import BinLogoOutlined from "@/components/common/BinLogoOutlined";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

export const menuGroups: SidebarItemProps[] = [
  {
    icon: <TextSnippet className={styles.menuIcon} />,
    permission_name: PERMISSIONS.RESOURCE_AND_RESEARCH.MAIN,
    navigation: URL_CONSTANTS.RESOURCE_AND_RESEARCH,
    isSideMenuDisplay: true,
    isEducator: true,
    subpermissions: [
      {
        permission_name: PERMISSIONS.RESOURCE_AND_RESEARCH.CONTINUE_WATCHING,
        navigation: `${URL_CONSTANTS.RESOURCE_AND_RESEARCH}/continue-watching`,
        icon: <AccessTime className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.RESOURCE_AND_RESEARCH.NEW,
        navigation: `${URL_CONSTANTS.RESOURCE_AND_RESEARCH}/new`,
        icon: <StarBorder className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.RESOURCE_AND_RESEARCH.POPULAR,
        navigation: `${URL_CONSTANTS.RESOURCE_AND_RESEARCH}/popular`,
        icon: <TrendingUp className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.RESOURCE_AND_RESEARCH.PRESONALISED,
        navigation: `${URL_CONSTANTS.RESOURCE_AND_RESEARCH}/personalised`,
        icon: <FavoriteBorder className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.RESOURCE_AND_RESEARCH.MAIN,
        navigation: URL_CONSTANTS.RESOURCE_AND_RESEARCH_PRIVIEW("test"),
        icon: null,
        isSideMenuDisplay: false
      },
      {
        permission_name: PERMISSIONS.RESOURCE_AND_RESEARCH.MAIN,
        navigation: `${URL_CONSTANTS.RESOURCE_AND_RESEARCH}/creator/0`,
        icon: <FavoriteBorder className={styles.menuIcon} />,
        isSideMenuDisplay: false
      },
    ],
  },
  {
    icon: <TableRestaurantOutlined className={styles.menuIcon} />,
    permission_name: PERMISSIONS.MY_PROFILE.MAIN,
    navigation: URL_CONSTANTS.MY_PROFILE,
    isSideMenuDisplay: false
  },
  {
    icon: <TableRestaurantOutlined className={styles.menuIcon} />,
    permission_name: PERMISSIONS.COMMUNITY_TABLE.MAIN,
    navigation: URL_CONSTANTS.COMMUNITY_TABLE,
    isSideMenuDisplay: true,
    isEducator: true,
  },
  {
    icon: (
      <div className="relative h-8 w-8">
        <BinLogoOutlined />
      </div>
    ),
    permission_name: PERMISSIONS.BINS.MAIN,
    navigation: `${URL_CONSTANTS.BINS}/recents`,
    isSideMenuDisplay: true,
    isEducator: true,
    subpermissions: [
      {
        permission_name: PERMISSIONS.BINS.RECENTS,
        navigation: `${URL_CONSTANTS.BINS}/recents`,
        icon: <AccessTimeIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.BINS.MY_BIN,
        navigation: `${URL_CONSTANTS.BINS}/mybin`,
        icon: (
          <div className="relative h-8 w-8">
            <BinLogoOutlined />
          </div>
        ),
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.BINS.SHARED_WITH_ME,
        navigation: `${URL_CONSTANTS.BINS}/shared-with-me`,
        icon: <PeopleAltOutlinedIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
    ],
  },
  {
    icon: <ChatOutlined className={styles.menuIcon} />,
    permission_name: PERMISSIONS.CHATS.MAIN,
    navigation: URL_CONSTANTS.CHATS,
    isSideMenuDisplay: true,
    isEducator: true,
  },
  {
    icon: <DashboardIcon className={styles.menuIcon} />,
    permission_name: PERMISSIONS.DASHBOARD,
    navigation: URL_CONSTANTS.ADMIN_DASHBORAD,
    isSideMenuDisplay: true,
    isEducator: false,
  },
  {
    icon: <EngineeringOutlinedIcon className={styles.menuIcon} />,
    permission_name: PERMISSIONS.ROLES_PERMISSIONS.MAIN,
    navigation: URL_CONSTANTS.ADMIN_ROLE_MANAGEMENT_VIEW,
    isSideMenuDisplay: true,
    isEducator: false,
    subpermissions: [
      {
        permission_name: PERMISSIONS.ROLES_PERMISSIONS.LIST,
        navigation: URL_CONSTANTS.ADMIN_ROLE_MANAGEMENT_VIEW,
        icon: <ListAltOutlinedIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.ROLES_PERMISSIONS.CREATE,
        navigation: URL_CONSTANTS.ADMIN_ROLE_MANAGEMENT_CREATE,
        icon: <AddBoxOutlinedIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.ROLES_PERMISSIONS.EDIT,
        navigation: URL_CONSTANTS.ADMIN_ROLE_MANAGEMENT_EDIT(0),
        icon: null,
        isSideMenuDisplay: false
      },
      {
        permission_name: PERMISSIONS.ROLES_PERMISSIONS.DELETE,
        navigation: "",
        icon: null,
        isSideMenuDisplay: false
      },
    ],
  },
  {
    icon: <GroupsIcon className={styles.menuIcon} />,
    permission_name: PERMISSIONS.USER_MANAGEMENT.MAIN,
    navigation: URL_CONSTANTS.ADMIN_USER_MANAGEMENT_VIEW_USER,
    isSideMenuDisplay: true,
    isEducator: false,
    subpermissions: [
      {
        permission_name: PERMISSIONS.USER_MANAGEMENT.LIST,
        navigation: URL_CONSTANTS.ADMIN_USER_MANAGEMENT_VIEW_USER,
        icon: <ListAltOutlinedIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.USER_MANAGEMENT.CREATE,
        navigation: URL_CONSTANTS.ADMIN_USER_MANAGEMENT_CREATE_USER,
        icon: <AddBoxOutlinedIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.USER_MANAGEMENT.EDIT,
        navigation: URL_CONSTANTS.ADMIN_USER_MANAGEMENT_EDIT_USER(0),
        icon: null,
        isSideMenuDisplay: false
      },
      {
        permission_name: PERMISSIONS.USER_MANAGEMENT.SUSPEND_ACTIVATE,
        navigation: "",
        icon: null,
        isSideMenuDisplay: false
      },
      {
        permission_name: PERMISSIONS.USER_MANAGEMENT.APPROVE_REJECT,
        navigation: "",
        icon: null,
        isSideMenuDisplay: false
      },
      {
        permission_name: PERMISSIONS.USER_MANAGEMENT.RESEND_INVITATION,
        navigation: "",
        icon: null,
        isSideMenuDisplay: false
      },
      {
        permission_name: PERMISSIONS.USER_MANAGEMENT.MAIN,
        navigation: URL_CONSTANTS.ADMIN_USER_MANAGEMENT_PREVIEW_CONTENT_CREATOR(0),
        icon: null,
        isSideMenuDisplay: false
      },
    ],
  },
  {
    icon: <PaymentOutlined className={styles.menuIcon} />,
    permission_name: PERMISSIONS.SUBSCRIPTION_PLANS.MAIN,
    navigation: URL_CONSTANTS.ADMIN_SUBSCRIPTION_MANAGEMENT_VIEW,
    isSideMenuDisplay: true,
    isEducator: false,
    subpermissions: [
      {
        permission_name: PERMISSIONS.SUBSCRIPTION_PLANS.LIST,
        navigation: URL_CONSTANTS.ADMIN_SUBSCRIPTION_MANAGEMENT_VIEW,
        icon: <ListAltOutlinedIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.SUBSCRIPTION_PLANS.CREATE,
        navigation: URL_CONSTANTS.ADMIN_SUBSCRIPTION_MANAGEMENT_CREATE,
        icon: <AddBoxOutlinedIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.SUBSCRIPTION_PLANS.EDIT,
        navigation: URL_CONSTANTS.ADMIN_SUBSCRIPTION_MANAGEMENT_EDIT(0),
        icon: <AddBoxOutlinedIcon className={styles.menuIcon} />,
        isSideMenuDisplay: false
      },
    ],
  },
  {
    icon: <ForumOutlinedIcon className={styles.menuIcon} />,
    navigation: URL_CONSTANTS.ADMIN_COMMUNITY_LIST,
    permission_name: PERMISSIONS.COMMUNITY_MANAGEMENT.MAIN,
    isSideMenuDisplay: true,
    isEducator: false,
    subpermissions: [
      {
        permission_name: PERMISSIONS.COMMUNITY_MANAGEMENT.LIST,
        navigation: URL_CONSTANTS.ADMIN_COMMUNITY_LIST,
        icon: <ListAltOutlinedIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.COMMUNITY_MANAGEMENT.CREATE,
        navigation: URL_CONSTANTS.ADMIN_COMMUNITY_CREATION,
        icon: <AddBoxOutlinedIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.COMMUNITY_MANAGEMENT.REPORTED_COMMENTS,
        navigation: URL_CONSTANTS.ADMIN_COMMUNITY_REPORTED_COMMENTS,
        icon: <ReportOutlinedIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.COMMUNITY_MANAGEMENT.EDIT,
        navigation: URL_CONSTANTS.ADMIN_COMMUNITY_EDIT(0),
        icon: null,
        isSideMenuDisplay: false
      },
      {
        permission_name: PERMISSIONS.COMMUNITY_MANAGEMENT.BLOCKED,
        navigation: URL_CONSTANTS.ADMIN_COMMUNITY_BLOCK,
        icon: <BlockIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
    ],
  },
  {
    icon: <MenuBookOutlined className={styles.menuIcon} />,
    navigation: URL_CONSTANTS.ADMIN_CONTENT_LIST,
    permission_name: PERMISSIONS.CONTENT_MANAGEMENT.MAIN,
    isSideMenuDisplay: true,
    isEducator: false,
    subpermissions: [
      {
        permission_name: PERMISSIONS.CONTENT_MANAGEMENT.LIST,
        navigation: URL_CONSTANTS.ADMIN_CONTENT_LIST,
        icon: <ListAltOutlinedIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.CONTENT_MANAGEMENT.CREATE,
        navigation: URL_CONSTANTS.ADMIN_CONTENT_CREATION,
        icon: <AddBoxOutlinedIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.CONTENT_MANAGEMENT.BLOCKED,
        navigation: URL_CONSTANTS.ADMIN_CONTENT_BLOCK,
        icon: <BlockIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.CONTENT_MANAGEMENT.EDIT,
        navigation: URL_CONSTANTS.ADMIN_CONTENT_EDIT(""),
        icon: null,
        isSideMenuDisplay: false
      },
      {
        permission_name: PERMISSIONS.CONTENT_MANAGEMENT.LIST,
        navigation: URL_CONSTANTS.ADMIN_CONTENT_PRIVIEW(""),
        icon: null,
        isSideMenuDisplay: false
      },
      {
        permission_name: PERMISSIONS.CONTENT_MANAGEMENT.CONTENT_CREATOR_PROFILE,
        navigation: URL_CONSTANTS.ADMIN_CONTENT_CREATOR_PROFILE,
        icon: <PersonAddAltIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
    ],
  },
  {
    icon: <CorporateFare className={styles.menuIcon} />,
    navigation: URL_CONSTANTS.ADMIN_ORGANISATION_MANAGEMENT_VIEW,
    permission_name: PERMISSIONS.ORGANIZATIONS.MAIN,
    isSideMenuDisplay: true,
    isEducator: false,
    subpermissions: [
      {
        permission_name: PERMISSIONS.ORGANIZATIONS.LIST,
        navigation: URL_CONSTANTS.ADMIN_ORGANISATION_MANAGEMENT_VIEW,
        icon: <ListAltOutlinedIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.ORGANIZATIONS.CREATE,
        navigation: URL_CONSTANTS.ADMIN_ORGANISATION_MANAGEMENT_CREATE,
        icon: <AddBoxOutlinedIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.ORGANIZATIONS.EDIT,
        navigation: URL_CONSTANTS.ADMIN_ORGANISATION_MANAGEMENT_EDIT(0),
        icon: null,
        isSideMenuDisplay: false,
      },
    ],
  },
  {
    icon: <ChatOutlined className={styles.menuIcon} />,
    navigation: URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT,
    permission_name: PERMISSIONS.CHAT_MANAGEMENT.MAIN,
    isSideMenuDisplay: true,
    isEducator: false,
    subpermissions: [
      {
        permission_name: PERMISSIONS.CHAT_MANAGEMENT.LIST_CHANNEL,
        navigation: URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_VIEW_CHANNEL,
        icon: <ListAltOutlinedIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.CHAT_MANAGEMENT.CREATE_CHANNEL,
        navigation: URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_CREATE_CHANNEL,
        icon: <AddBoxOutlinedIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.CHAT_MANAGEMENT.BLOCKED_CHANNEL,
        navigation: URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_BLOCKED_CHANNEL,
        icon: <BlockIcon className={styles.menuIcon} />,
        isSideMenuDisplay: true
      },
      {
        permission_name: PERMISSIONS.CHAT_MANAGEMENT.EDIT_CHANNEL,
        navigation: URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_EDIT_CHANNEL(0),
        icon: <BlockIcon className={styles.menuIcon} />,
        isSideMenuDisplay: false
      },
      //NOSONAR
      // {
      //   permission_name: PERMISSIONS.CHAT_MANAGEMENT.LIST_GROUP,
      //   navigation: URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_VIEW_GROUP,
      //   icon: <ListAltOutlinedIcon className={styles.menuIcon} />,
      // },
      // {
      //   permission_name: PERMISSIONS.CHAT_MANAGEMENT.CREATE_GROUP,
      //   navigation: URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_CREATE_GROUP,
      //   icon: <AddBoxOutlinedIcon className={styles.menuIcon} />,
      // },
    ]
  },
];
