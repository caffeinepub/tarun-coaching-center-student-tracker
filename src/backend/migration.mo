import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {
  type OldActor = {
    nextStudentId : Nat;
  };

  type NewRole = {
    #admin;
    #staff;
    #student;
  };

  type NewUser = {
    username : Text;
    passwordHash : Text;
    role : NewRole;
    name : Text;
    principal : ?Principal;
  };

  type NewActor = {
    users : Map.Map<Text, NewUser>;
    principalToUsername : Map.Map<Principal, Text>;
    nextStudentId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      users = Map.empty<Text, NewUser>();
      principalToUsername = Map.empty<Principal, Text>();
      nextStudentId = old.nextStudentId;
    };
  };
};
