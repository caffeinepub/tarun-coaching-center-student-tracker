import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    role : Text; // e.g., "Teacher", "Administrator", "Staff"
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Student Management Types
  type Student = {
    id : Nat;
    name : Text;
    rollNumber : Text;
    grade : Text;
    contact : Text;
  };

  module Student {
    public func compare(student1 : Student, student2 : Student) : Order.Order {
      switch (Nat.compare(student1.id, student2.id)) {
        case (#equal) { Text.compare(student1.name, student2.name) };
        case (order) { order };
      };
    };
  };

  type Mark = {
    studentId : Nat;
    subject : Text;
    examType : Text;
    score : Nat;
  };

  module Mark {
    public func compare(mark1 : Mark, mark2 : Mark) : Order.Order {
      switch (Nat.compare(mark1.studentId, mark2.studentId)) {
        case (#equal) { Text.compare(mark1.subject, mark2.subject) };
        case (order) { order };
      };
    };

    public func compareBySubject(mark1 : Mark, mark2 : Mark) : Order.Order {
      Text.compare(mark1.subject, mark2.subject);
    };
  };

  type AttendanceRecord = {
    studentId : Nat;
    date : Text;
    present : Bool;
  };

  module AttendanceRecord {
    public func compare(record1 : AttendanceRecord, record2 : AttendanceRecord) : Order.Order {
      switch (Nat.compare(record1.studentId, record2.studentId)) {
        case (#equal) { Text.compare(record1.date, record2.date) };
        case (order) { order };
      };
    };

    public func compareByDate(record1 : AttendanceRecord, record2 : AttendanceRecord) : Order.Order {
      Text.compare(record1.date, record2.date);
    };
  };

  let students = Map.empty<Nat, Student>();
  var nextStudentId = 0;
  let marks = List.empty<Mark>();
  let attendance = List.empty<AttendanceRecord>();

  // New subject management state
  let subjects = Map.empty<Text, Bool>();

  // Admin-only: Add student
  public shared ({ caller }) func addStudent(name : Text, rollNumber : Text, grade : Text, contact : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let student : Student = {
      id = nextStudentId;
      name;
      rollNumber;
      grade;
      contact;
    };
    students.add(nextStudentId, student);
    nextStudentId += 1;
    student.id;
  };

  // User-only: View student information
  public query ({ caller }) func getStudent(id : Nat) : async Student {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view student information");
    };
    if (not students.containsKey(id)) {
      Runtime.trap("Student does not exist");
    };
    switch (students.get(id)) {
      case (null) { Runtime.trap("Student does not exist") };
      case (?student) { student };
    };
  };

  // Admin-only: Manage subjects (add, edit)
  public shared ({ caller }) func addSubject(subjectName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add subjects");
    };
    if (subjects.containsKey(subjectName)) {
      Runtime.trap("Subject already exists");
    };
    subjects.add(subjectName, true);
  };

  public shared ({ caller }) func editSubject(oldSubject : Text, newSubject : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit subjects");
    };
    if (not subjects.containsKey(oldSubject)) {
      Runtime.trap("Subject does not exist");
    };
    subjects.remove(oldSubject);
    subjects.add(newSubject, true);
  };

  // Query all subjects (user-only)
  public query ({ caller }) func getAllSubjects() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view subjects");
    };
    subjects.keys().toArray();
  };

  // Admin-only: Add marks
  public shared ({ caller }) func addMark(studentId : Nat, subject : Text, examType : Text, score : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not subjects.containsKey(subject)) {
      Runtime.trap("Subject does not exist");
    };
    if (score > 100) {
      Runtime.trap("Score cannot exceed 100 points");
    };
    let mark : Mark = {
      studentId;
      subject;
      examType;
      score;
    };
    marks.add(mark);
  };

  // User-only: View marks by student
  public query ({ caller }) func getMarksByStudent(studentId : Nat) : async [Mark] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view marks");
    };
    marks.values().toArray().filter(func(mark) { mark.studentId == studentId }).sort();
  };

  // Admin-only: Record attendance
  public shared ({ caller }) func recordAttendance(studentId : Nat, date : Text, present : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let record : AttendanceRecord = {
      studentId;
      date;
      present;
    };
    attendance.add(record);
  };

  // User-only: View attendance by student
  public query ({ caller }) func getAttendanceByStudent(studentId : Nat) : async [AttendanceRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view attendance records");
    };
    attendance.values().toArray().filter(func(record) { record.studentId == studentId }).sort();
  };

  // User-only: View attendance by date
  public query ({ caller }) func getAttendanceByDate(date : Text) : async [AttendanceRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view attendance records");
    };
    attendance.values().toArray().filter(func(record) { record.date == date }).sort();
  };
};
