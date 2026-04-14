module {
  public type DailyContactCount = {
    date : Text;
    count : Nat;
  };

  public type CategoryProjectCount = {
    category : Text;
    count : Nat;
  };

  public type DashboardStats = {
    totalContacts : Nat;
    totalProjects : Nat;
    contactsLast30Days : [DailyContactCount];
    projectsByCategory : [CategoryProjectCount];
  };
};
