import Types "../types/project";
import Common "../types/common";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";

module {
  public func create(
    projects : List.List<Types.Project>,
    nextId : { var value : Nat },
    title : Text,
    description : Text,
    category : Text,
    imageUrls : [Text],
  ) : Types.Project {
    let id = nextId.value;
    nextId.value += 1;
    let project : Types.Project = {
      id;
      title;
      description;
      category;
      imageUrls;
      createdAt = Time.now();
    };
    projects.add(project);
    project;
  };

  public func update(
    projects : List.List<Types.Project>,
    id : Common.ProjectId,
    title : Text,
    description : Text,
    category : Text,
    imageUrls : [Text],
  ) : Bool {
    var found = false;
    projects.mapInPlace(func(p) {
      if (p.id == id) {
        found := true;
        { p with title; description; category; imageUrls };
      } else {
        p;
      };
    });
    found;
  };

  public func delete(projects : List.List<Types.Project>, id : Common.ProjectId) : Bool {
    let sizeBefore = projects.size();
    let filtered = projects.filter(func(p) { p.id != id });
    projects.clear();
    projects.append(filtered);
    projects.size() < sizeBefore;
  };

  public func getAll(projects : List.List<Types.Project>) : [Types.Project] {
    projects.toArray();
  };

  public func getById(projects : List.List<Types.Project>, id : Common.ProjectId) : ?Types.Project {
    projects.find(func(p) { p.id == id });
  };

  public func countByCategory(projects : List.List<Types.Project>) : [{ category : Text; count : Nat }] {
    let catMap = Map.empty<Text, Nat>();
    projects.forEach(func(p) {
      let existing = switch (catMap.get(p.category)) {
        case (?n) n;
        case null 0;
      };
      catMap.add(p.category, existing + 1);
    });

    let result = List.empty<{ category : Text; count : Nat }>();
    catMap.forEach(func(cat, cnt) {
      result.add({ category = cat; count = cnt });
    });
    result.toArray();
  };
};
