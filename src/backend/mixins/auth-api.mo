import Types "../types/auth";
import Common "../types/common";
import AuthLib "../lib/auth";

mixin (activeToken : { var value : Common.SessionToken }) {
  public func adminLogin(username : Text, password : Text) : async Types.LoginResult {
    AuthLib.login(activeToken, username, password);
  };

  public func validateToken(token : Text) : async Bool {
    AuthLib.validateToken(activeToken, token);
  };
};
