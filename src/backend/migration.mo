import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";

module {
  type OldUserProfile = {
    name : Text;
    role : Text;
  };

  type OldStudent = {
    id : Nat;
    name : Text;
    rollNumber : Text;
    grade : Text;
    contact : Text;
  };

  type OldMark = {
    studentId : Nat;
    subject : Text;
    examType : Text;
    score : Nat;
  };

  type OldAttendanceRecord = {
    studentId : Nat;
    date : Text;
    present : Bool;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    students : Map.Map<Nat, OldStudent>;
    nextStudentId : Nat;
    marks : List.List<OldMark>;
    attendance : List.List<OldAttendanceRecord>;
  };

  type NewUserProfile = {
    name : Text;
    role : Text;
  };

  type NewStudent = {
    id : Nat;
    name : Text;
    rollNumber : Text;
    grade : Text;
    contact : Text;
  };

  type NewMark = {
    studentId : Nat;
    subject : Text;
    examType : Text;
    score : Nat;
  };

  type NewAttendanceRecord = {
    studentId : Nat;
    date : Text;
    present : Bool;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    students : Map.Map<Nat, NewStudent>;
    nextStudentId : Nat;
    marks : List.List<NewMark>;
    attendance : List.List<NewAttendanceRecord>;
    subjects : Map.Map<Text, Bool>;
  };

  public func run(old : OldActor) : NewActor {
    let subjectsList = [
      "Biologie",
      "Chemie",
      "Deutsch",
      "Englisch",
      "Erdkunde",
      "Ethik",
      "Frankreich",
      "Geschichte",
      "Griechisch",
      "Informatik",
      "Italienisch",
      "Kunst",
      "Latein",
      "Mathematik",
      "Musik",
      "Physik",
      "Religion",
      "Russisch",
      "Sozialkunde",
      "Spanisch",
      "Sport",
    ];
    let subjects = Map.fromIter(subjectsList.values().map(func(subject) { (subject, true) }));

    {
      old with
      subjects
    };
  };
};
