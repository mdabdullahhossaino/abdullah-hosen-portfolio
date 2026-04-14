import ProjectTypes "../types/project";
import Common "../types/common";
import ProjectLib "../lib/project";
import AuthLib "../lib/auth";
import List "mo:core/List";

mixin (
  projects : List.List<ProjectTypes.Project>,
  nextProjectId : { var value : Nat },
  activeToken : { var value : Common.SessionToken },
) {
  public func createProject(
    token : Common.SessionToken,
    title : Text,
    description : Text,
    category : Text,
    imageUrls : [Text],
  ) : async ?ProjectTypes.Project {
    if (not AuthLib.validateToken(activeToken, token)) {
      return null;
    };
    ?ProjectLib.create(projects, nextProjectId, title, description, category, imageUrls);
  };

  public func updateProject(
    token : Common.SessionToken,
    id : Common.ProjectId,
    title : Text,
    description : Text,
    category : Text,
    imageUrls : [Text],
  ) : async Bool {
    if (not AuthLib.validateToken(activeToken, token)) {
      return false;
    };
    ProjectLib.update(projects, id, title, description, category, imageUrls);
  };

  public func deleteProject(token : Common.SessionToken, id : Common.ProjectId) : async Bool {
    if (not AuthLib.validateToken(activeToken, token)) {
      return false;
    };
    ProjectLib.delete(projects, id);
  };

  public func getProjects() : async [ProjectTypes.Project] {
    ProjectLib.getAll(projects);
  };

  public func getProject(id : Common.ProjectId) : async ?ProjectTypes.Project {
    ProjectLib.getById(projects, id);
  };
};
