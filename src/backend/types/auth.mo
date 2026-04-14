import Common "common";

module {
  public type LoginRequest = {
    username : Text;
    password : Text;
  };

  public type LoginResult = {
    #ok : Common.SessionToken;
    #err : Text;
  };
};
