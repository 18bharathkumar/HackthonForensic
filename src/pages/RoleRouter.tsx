
import { USER_ROLES } from "@/lib/constants";
import { useAuth } from "@/lib/auth";
import IndianGovernmentDashboard from "./government/IndianGovernmentDashboard";
import CFSLDashboard from "./cfsl/CFSLDashboard";
import FSLDashboard from "./fsl/FSLDashboard";
import PoliceStationDashboard from "./police/PoliceStationDashboard";
import FSLMemberDashboard from "./member/FSLMemberDashboard";
import UnregisteredDashboard from "./UnregisteredDashboard";

const RoleRouter = () => {
  const { user } = useAuth();

  console.log(user)

  if (!user) {
    return null;
  }

  switch (user.role) {
    case USER_ROLES.INDIAN_GOVT:
      return <IndianGovernmentDashboard />;
    case USER_ROLES.CFSL:
      return <CFSLDashboard />;
    case USER_ROLES.FSL:
      return <FSLDashboard />;
    case USER_ROLES.POLICE_STATION:
      return <PoliceStationDashboard />;
    case USER_ROLES.FSL_MEMBER:
      return <FSLMemberDashboard />;
    default:
      return <UnregisteredDashboard />;
  }
};

export default RoleRouter;
