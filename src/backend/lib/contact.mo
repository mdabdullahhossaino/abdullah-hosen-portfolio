import Types "../types/contact";
import Common "../types/common";
import List "mo:core/List";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";

module {
  public func submit(
    contacts : List.List<Types.ContactSubmission>,
    nextId : { var value : Nat },
    name : Text,
    email : Text,
    subject : Text,
    message : Text,
  ) : Types.ContactSubmission {
    let id = nextId.value;
    nextId.value += 1;
    let contact : Types.ContactSubmission = {
      id;
      name;
      email;
      subject;
      message;
      timestamp = Time.now();
    };
    contacts.add(contact);
    contact;
  };

  public func getAll(contacts : List.List<Types.ContactSubmission>) : [Types.ContactSubmission] {
    contacts.toArray();
  };

  public func count(contacts : List.List<Types.ContactSubmission>) : Nat {
    contacts.size();
  };

  public func deleteById(
    contacts : List.List<Types.ContactSubmission>,
    id : Nat,
  ) : Bool {
    let before = contacts.size();
    contacts.retain(func(c) { c.id != id });
    contacts.size() < before;
  };

  // Convert nanosecond timestamp to YYYY-MM-DD string
  func dateFromTimestamp(ts : Common.Timestamp) : Text {
    // ts is nanoseconds since Unix epoch
    let secondsSinceEpoch = ts / 1_000_000_000;
    // Days since epoch
    let days = secondsSinceEpoch / 86400;
    // Using algorithm to compute YYYY-MM-DD from day count
    // Reference: https://en.wikipedia.org/wiki/Julian_day#Julian_day_number_from_Julian_calendar_date
    let z = days + 719468;
    let era = (if (z >= 0) z else z - 146096) / 146097;
    let doe = z - era * 146097;
    let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = mp + (if (mp < 10) 3 else -9);
    let year = y + (if (m <= 2) 1 else 0);
    let pad2 = func(n : Int) : Text {
      if (n < 10) { "0" # n.toText() } else { n.toText() };
    };
    year.toText() # "-" # pad2(m) # "-" # pad2(d);
  };

  public func countLast30Days(
    contacts : List.List<Types.ContactSubmission>,
    now : Common.Timestamp,
  ) : [{ date : Text; count : Nat }] {
    let thirtyDaysNs : Int = 30 * 24 * 60 * 60 * 1_000_000_000;
    let cutoff = now - thirtyDaysNs;

    // Count contacts per date using a Map<Text, Nat>
    let dateMap = Map.empty<Text, Nat>();
    contacts.forEach(func(c) {
      if (c.timestamp >= cutoff) {
        let d = dateFromTimestamp(c.timestamp);
        let existing = switch (dateMap.get(d)) {
          case (?n) n;
          case null 0;
        };
        dateMap.add(d, existing + 1);
      };
    });

    // Convert to array
    let result = List.empty<{ date : Text; count : Nat }>();
    dateMap.forEach(func(date, cnt) {
      result.add({ date; count = cnt });
    });
    result.toArray();
  };
};
