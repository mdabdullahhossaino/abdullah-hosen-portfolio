import ContactTypes "types/contact";
import ProjectTypes "types/project";
import Common "types/common";
import List "mo:core/List";

import AuthMixin "mixins/auth-api";
import ContactMixin "mixins/contact-api";
import ProjectMixin "mixins/project-api";
import DashboardMixin "mixins/dashboard-api";

actor {
  let contacts = List.empty<ContactTypes.ContactSubmission>();
  let projects = List.empty<ProjectTypes.Project>();
  var nextContactId : { var value : Nat } = { var value = 1 };
  var nextProjectId : { var value : Nat } = { var value = 1 };
  var activeToken : { var value : Common.SessionToken } = { var value = "" };

  include AuthMixin(activeToken);
  include ContactMixin(contacts, nextContactId, activeToken);
  include ProjectMixin(projects, nextProjectId, activeToken);
  include DashboardMixin(contacts, projects, activeToken);
};
