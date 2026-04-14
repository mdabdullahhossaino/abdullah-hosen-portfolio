import DashboardTypes "../types/dashboard";
import ContactTypes "../types/contact";
import ProjectTypes "../types/project";
import Common "../types/common";
import ContactLib "../lib/contact";
import ProjectLib "../lib/project";
import AuthLib "../lib/auth";
import List "mo:core/List";
import Time "mo:core/Time";

mixin (
  contacts : List.List<ContactTypes.ContactSubmission>,
  projects : List.List<ProjectTypes.Project>,
  activeToken : { var value : Common.SessionToken },
) {
  public func getDashboardStats(token : Common.SessionToken) : async DashboardTypes.DashboardStats {
    if (not AuthLib.validateToken(activeToken, token)) {
      return {
        totalContacts = 0;
        totalProjects = 0;
        contactsLast30Days = [];
        projectsByCategory = [];
      };
    };
    let now = Time.now();
    {
      totalContacts = ContactLib.count(contacts);
      totalProjects = projects.size();
      contactsLast30Days = ContactLib.countLast30Days(contacts, now);
      projectsByCategory = ProjectLib.countByCategory(projects);
    };
  };
};
