import { AccessSettingsConstantsProps } from "@/types/chats";
import { HttpsOutlined } from "@mui/icons-material";

export const GroupRequirementConstants = [
  {
    title: "Collaboration",
    description: "Collaborate on projects, plans or topics"
  },
  {
    title: "Announcements",
    description: "Broadcast and share updates with your group"
  }
]

export const AccessSettingsConstants: AccessSettingsConstantsProps[] = [
  { 
    title: "Private",
    icon: <HttpsOutlined />
  },
  {
    title: "Public",
    icon: <HttpsOutlined />
  }
]

export const FilterConstants = {
  "allActivity": [
    { id: 1, title: "Unread messages only" },
    { id: 2, title: "Mentions only" },
    { id: 3, title: "Messages with attachments"}
  ]
}