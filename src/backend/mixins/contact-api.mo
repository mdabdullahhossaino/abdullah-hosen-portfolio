import ContactTypes "../types/contact";
import Common "../types/common";
import ContactLib "../lib/contact";
import AuthLib "../lib/auth";
import List "mo:core/List";
import Time "mo:core/Time";

mixin (
  contacts : List.List<ContactTypes.ContactSubmission>,
  nextContactId : { var value : Nat },
  activeToken : { var value : Common.SessionToken },
) {
  public func submitContact(
    name : Text,
    email : Text,
    subject : Text,
    message : Text,
  ) : async ContactTypes.ContactSubmission {
    ContactLib.submit(contacts, nextContactId, name, email, subject, message);
  };

  public func getContacts(token : Common.SessionToken) : async [ContactTypes.ContactSubmission] {
    if (not AuthLib.validateToken(activeToken, token)) {
      return [];
    };
    ContactLib.getAll(contacts);
  };

  public func getContactCount() : async Nat {
    ContactLib.count(contacts);
  };

  public func deleteContact(token : Common.SessionToken, id : Common.ContactId) : async Bool {
    if (not AuthLib.validateToken(activeToken, token)) {
      return false;
    };
    ContactLib.deleteById(contacts, id);
  };
};
