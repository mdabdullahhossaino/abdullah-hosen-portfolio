import Common "common";

module {
  public type Project = {
    id : Common.ProjectId;
    title : Text;
    description : Text;
    category : Text;
    imageUrls : [Text];
    createdAt : Common.Timestamp;
  };
};
