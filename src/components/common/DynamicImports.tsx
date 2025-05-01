import React from 'react';
import dynamic from 'next/dynamic';
import Loader from "@/components/common/Loader";

export const SubscriptionCreateComponent = dynamic(() => 
  import('@/components/admin/SubscriptionManagement/CreateSubscriptionPlan'), {
    loading: () => <Loader />,
    ssr: false
  }
)

export const BreadcrumbComponent = dynamic(() => 
  import('@/components/Breadcrumbs/Breadcrumb'), {
    loading: () => <></>,
    ssr: false
  }
)

export const SubscriptionListComponent = dynamic(() => 
  import('@/components/admin/SubscriptionManagement/ViewSubsciptionPlan'), {
    loading: () => <Loader />,
    ssr: false
  }
)

export const CreateRoleComponent = dynamic(() => 
  import('@/components/admin/RoleManagement/CreateRole'), {
    loading: () => <Loader />,
    ssr: false
  }
)

export const RoleListComponent = dynamic(() => 
  import('@/components/admin/RoleManagement/ViewRole'), {
    loading: () => <Loader />,
    ssr: false
  }
)

export const CommonTableComponent = dynamic(() => 
  import('@/components/common/CommonTable'), {
    loading: () => <Loader />,
    ssr: false
  }
)

export const RoleFilterComponent = dynamic(() => 
  import('@/components/admin/RoleManagement/ViewRole/RoleFilter'), {
    loading: () => <Loader />,
    ssr: true
  }
)

export const RoleMenuComponent = dynamic(() => 
  import('@/components/admin/RoleManagement/ViewRole/RoleMenu'), {
    loading: () => <Loader />,
    ssr: true
  }
)

export const SubscriptionFilterComponent = dynamic(() => 
  import('@/components/admin/SubscriptionManagement/ViewSubsciptionPlan/SubscriptionFilter'), {
    loading: () => <Loader />,
    ssr: true
  }
)

export const SubscriptionMoreActionsComponent = dynamic(() => 
  import('@/components/admin/SubscriptionManagement/ViewSubsciptionPlan/SubscriptionMoreActions'), {
    loading: () => <Loader />,
    ssr: true
  }
)

export const CommonUserFormComponent = dynamic(() => 
  import('@/components/admin/UserManagement/CommonUserForm'), {
    loading: () => <Loader />,
    ssr: false
  }
)

export const OrgAdminListComponent = dynamic(() => 
  import('@/components/admin/UserManagement/UsersList/OrgAdminList'), {
    loading: () => <Loader />,
    ssr: false
  }
)

export const CreateCommunityComponent = dynamic(() => 
  import('@/components/admin/CommunityMangement/formCommuinty'), {
    loading: () => <Loader />,
    ssr: false
  }
)

export const CommunityListComponent = dynamic(() => 
  import('@/components/admin/CommunityMangement/communityTable'), {
    loading: () => <Loader />,
    ssr: false
  }
)

export const CommunityTableComponent = dynamic(() => 
  import('@/components/CommunityTableComp'), {
    loading: () => <Loader />,
    ssr: false
  }
)

export const CommunityTableDetailsComponent = dynamic(() => 
  import('@/components/CommunityTableDetails'), {
    loading: () => <Loader />,
    ssr: false
  }
)

export const ContentListComponent = dynamic(() => 
  import('@/components/admin/ContentManagement/ContentList'), {
    loading: () => <Loader />,
    ssr: false
  }
)

export const CreateOrganisationComponent = dynamic(() => 
  import('@/components/admin/OrganisationManagement/CreateOrganisation'), {
    loading: () => <Loader />,
    ssr: false
  }
)

export const ViewOrganisationComponent = dynamic(() => 
  import('@/components/admin/OrganisationManagement/ViewOrganisation'), {
    loading: () => <Loader />,
    ssr: false
  }
)

export const ManageAdminGroupMembersComponent = dynamic(
  () => import("@/components/admin/ChatsAdminComponents/Group/View/GroupDetailsWithMembers/ManageAdminGroupMembers"),
  {
    loading: () => <Loader />,
    ssr: false
  }
)

export const ReportedCommentsComponent = dynamic(() => 
  import('@/components/admin/CommunityMangement/ReportedComments'), {
    loading: () => <Loader />,
    ssr: false
  }
)

export const ResourceAndResearch = dynamic(() => 
  import('@/components/ResourceAndResearch'), {
    loading: () => <Loader />,
    ssr: false
  }
)

export const ResourceAndResearchComponent = dynamic(
  () => import("@/components/ResourceAndResearch"),
  {
    loading: () => <Loader />,
    ssr: false,
  },
)


export const ContentFormComponents = dynamic(
  () => import("@/components/admin/ContentManagement/ContentForm"),
  {
    loading: () => <Loader />,
    ssr: false,
  },
);

export const CustomAudioPlayer = dynamic(
  () => import("@/components/CustomAudioPlayer"),
  {
    loading: () => <Loader />,
    ssr: false
  }
)

export const ManageMembersComponent = dynamic(
  () => import("@/components/Chats/ManageMembers"),
  {
    loading: () => <Loader />,
    ssr: false
  }
)

export const NotificationComponent = dynamic(
  () => import("@/components/Notifications"),
  {
    loading: () => <Loader />,
    ssr: false
  }
)