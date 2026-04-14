import Common "common";

module {
  public type ContactSubmission = {
    id : Common.ContactId;
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
    timestamp : Common.Timestamp;
  };

  public type SubmitContactRequest = {
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
  };
};
