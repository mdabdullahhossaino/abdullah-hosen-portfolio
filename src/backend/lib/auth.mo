import Types "../types/auth";
import Common "../types/common";
import Time "mo:core/Time";

module {
  let adminUsername = "ridoy";
  let adminPassword = "Ridoy@2024";

  public func login(
    activeToken : { var value : Common.SessionToken },
    username : Text,
    password : Text,
  ) : Types.LoginResult {
    if (username == adminUsername and password == adminPassword) {
      let now = Time.now();
      let token = now.toText();
      activeToken.value := token;
      #ok(token);
    } else {
      #err("Invalid username or password");
    };
  };

  public func validateToken(
    activeToken : { var value : Common.SessionToken },
    token : Common.SessionToken,
  ) : Bool {
    token != "" and token == activeToken.value;
  };
};
