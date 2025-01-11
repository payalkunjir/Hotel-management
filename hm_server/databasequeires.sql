ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';  -- If connection failed
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root123';

CREATE DATABASE Hotel_Management;

CREATE TABLE `User` (
  `UserId` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `UserFirstName` varchar(255),
  `UserMiddleName` varchar(255),
  `UserLastName` varchar(255),
  `UserEmail` varchar(255),
  `UserContactNo` varchar(255),
  `Username` varchar(255),
  `Password` varchar(255),
  `IsDeleted` boolean,
  `CreatedDate` datetime,
  `CreatedBy` int,
  `ModifiedDate` datetime,
  `ModifiedBy` int
);

CREATE TABLE `Designation` (
  `DesignationId` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `DesignationName` varchar(255),
  `DesignationCode` varchar(255),
  `IsDeleted` boolean,
  `CreatedDate` datetime,
  `CreatedBy` int,
  `ModifiedDate` datetime,
  `ModifiedBy` int
);

CREATE TABLE `GuestCategory` (
  `GuestCategoryId` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `GuestCategoryName` varchar(255),
  `GuestCategoryCode` varchar(255),
  `IsDeleted` boolean,
  `CreatedDate` datetime,
  `CreatedBy` int,
  `ModifiedDate` datetime,
  `ModifiedBy` int
);

CREATE TABLE `Hotel` (
  `HotelId` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `HotelName` varchar(255),
  `HotelCategory` varchar(255),
  `HotelAddress` varchar(255),
  `RoomCategory` varchar(255),
  `TotalRoom` int,
  `HotelDistanceFromVenue` varchar(255),
  `HotelContactNo` varchar(255),
  `AreaId` int,
  `IsDeleted` boolean,
  `CreatedDate` datetime,
  `CreatedBy` int,
  `ModifiedDate` datetime,
  `ModifiedBy` int
);

CREATE TABLE `Area` (
  `AreaId` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `AreaName` varchar(255),
  `AreaCode` varchar(255),
  `IsDeleted` boolean,
  `CreatedDate` datetime,
  `CreatedBy` int,
  `ModifiedDate` datetime,
  `ModifiedBy` int
);

CREATE TABLE `ParticipantDetails` (
  `ParticipantDetailsId` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `ParticipantFirstName` varchar(255),
  `ParticipantMiddleName` varchar(255),
  `ParticipantLastName` varchar(255),
  `IdentityNo` varchar(255),
  `DesignationId` int,
  `ContactNo` varchar(255),
  `State` varchar(255),
  `GuestCategoryId` int,
  `ExpectedArrivalTime` timestamp,
  `ExpectedDepartureTime` timestamp,
  `CheckinTime` timestamp,
  `CheckinDate` datetime,
  `CheckoutTime` timestamp,
  `CheckoutDate` datetime,
  `HotelId` int,
  `AllotedRoomNo` varchar(255),
  `OccupanyType` varchar(255),
  `LOFirstName` varchar(255),
  `LOMiddleName` varchar(255),
  `LOLastName` varchar(255),
  `IdentityNoOfLO` varchar(255),
  `ContactNoOfLO` varchar(255),
  `VehicleId` int,
  `AllotedVehicle` varchar(255),
  `DriverId` int,
  `IsDeleted` boolean,
  `CreatedDate` datetime,
  `CreatedBy` int,
  `ModifiedDate` datetime,
  `ModifiedBy` int
);

CREATE TABLE `Vehicle` (
  `VehicleId` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `NameOfVehicle` varchar(255),
  `TypeOfVehicle` varchar(255),
  `VehicleNo` varchar(255),
  `IsDeleted` boolean,
  `CreatedDate` datetime,
  `CreatedBy` int,
  `ModifiedDate` datetime,
  `ModifiedBy` int
);

CREATE TABLE `Driver` (
  `DriverId` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `DriverName` varchar(255),
  `DriverCode` varchar(255),
  `DriverNumber` varchar(255),
  `IsDeleted` boolean,
  `CreatedDate` datetime,
  `CreatedBy` int,
  `ModifiedDate` datetime,
  `ModifiedBy` int
);

CREATE TABLE `Venue` (
  `VenueId` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `VenueName` varchar(255),
  `VenueCode` varchar(255),
  `IsDeleted` boolean,
  `CreatedDate` datetime,
  `CreatedBy` int,
  `ModifiedDate` datetime,
  `ModifiedBy` int
);

ALTER TABLE `User` ADD FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`UserId`);

ALTER TABLE `User` ADD FOREIGN KEY (`ModifiedBy`) REFERENCES `User` (`UserId`);

ALTER TABLE `Designation` ADD FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`UserId`);

ALTER TABLE `Designation` ADD FOREIGN KEY (`ModifiedBy`) REFERENCES `User` (`UserId`);

ALTER TABLE `GuestCategory` ADD FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`UserId`);

ALTER TABLE `GuestCategory` ADD FOREIGN KEY (`ModifiedBy`) REFERENCES `User` (`UserId`);

ALTER TABLE `Hotel` ADD FOREIGN KEY (`AreaId`) REFERENCES `Area` (`AreaId`);

ALTER TABLE `Hotel` ADD FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`UserId`);

ALTER TABLE `Hotel` ADD FOREIGN KEY (`ModifiedBy`) REFERENCES `User` (`UserId`);

ALTER TABLE `Area` ADD FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`UserId`);

ALTER TABLE `Area` ADD FOREIGN KEY (`ModifiedBy`) REFERENCES `User` (`UserId`);

ALTER TABLE `ParticipantDetails` ADD FOREIGN KEY (`DesignationId`) REFERENCES `Designation` (`DesignationId`);

ALTER TABLE `ParticipantDetails` ADD FOREIGN KEY (`GuestCategoryId`) REFERENCES `GuestCategory` (`GuestCategoryId`);

ALTER TABLE `ParticipantDetails` ADD FOREIGN KEY (`HotelId`) REFERENCES `Hotel` (`HotelId`);

ALTER TABLE `ParticipantDetails` ADD FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`UserId`);

ALTER TABLE `ParticipantDetails` ADD FOREIGN KEY (`ModifiedBy`) REFERENCES `User` (`UserId`);

ALTER TABLE `ParticipantDetails` ADD FOREIGN KEY (`VehicleId`) REFERENCES `Vehicle` (`VehicleId`);

ALTER TABLE `ParticipantDetails` ADD FOREIGN KEY (`DriverId`) REFERENCES `Driver` (`DriverId`);

ALTER TABLE `Vehicle` ADD FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`UserId`);

ALTER TABLE `Vehicle` ADD FOREIGN KEY (`ModifiedBy`) REFERENCES `User` (`UserId`);

ALTER TABLE `Driver` ADD FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`UserId`);

ALTER TABLE `Driver` ADD FOREIGN KEY (`ModifiedBy`) REFERENCES `User` (`UserId`);

ALTER TABLE `Venue` ADD FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`UserId`);

ALTER TABLE `Venue` ADD FOREIGN KEY (`ModifiedBy`) REFERENCES `User` (`UserId`);
