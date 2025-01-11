-- login store procedure
DELIMITER $$
CREATE PROCEDURE `login`(
IN _emailId VARCHAR(100)
)
BEGIN
	IF EXISTS(SELECT * FROM inventorydb.users u WHERE u.emailId = _emailId)
		THEN
			SELECT 1 as status;
            SELECT * FROM inventorydb.users u WHERE u.emailId = _emailId;
	ELSE
		SELECT 0 as status;
	END IF;
END$$
DELIMITER ;

-- Create user
DELIMITER $$
CREATE PROCEDURE `addUser`(
	IN _firstName VARCHAR(255),
    IN _lastName VARCHAR(255),
    IN _designation VARCHAR(255),
    IN _emailId VARCHAR(255),
    IN _password VARCHAR(255),
    IN _createdBy INT,
    IN _roleId INT
    )
BEGIN
IF EXISTS(SELECT * FROM inventorydb.users u WHERE u.emailId = _emailId) 
	THEN
		SELECT 1 as userExists;
ELSE 
	SELECT 0 as userExists;
	INSERT INTO inventorydb.users (firstName, lastName, designation, emailId, password, created, modified, createdBy, roleId) 
	VALUES(_firstName, _lastName, _designation, _emailId, _password, current_timestamp, current_timestamp, _createdBy, _roleId);

    SELECT * FROM inventorydb.users u WHERE u.userId = last_insert_id();
END IF;
END$$
DELIMITER ;

-- Update user
DELIMITER $$
CREATE PROCEDURE `updateUser`(
	IN _userId INT,
	IN _firstName VARCHAR(255),
    IN _lastName VARCHAR(255),
    IN _designation VARCHAR(255),
    IN _roleId INT,
    IN _modifiedBy INT,
    IN _isActive boolean
)
BEGIN
	UPDATE inventorydb.users SET
    firstName = _firstName,
    lastName = _lastName,
    designation = _designation,
    roleId = _roleId,
    modified = current_timestamp,
    modifiedBy = _modifiedBy,
    isActive = _isActive
    WHERE userId = _userId;
    SELECT * FROM inventorydb.users WHERE userId = _userId;
END$$
DELIMITER ;

-- Delete user
DELIMITER $$
CREATE PROCEDURE `deleteUser`(
	IN _userId INT,
    IN _modifiedBy INT
)
BEGIN
	UPDATE inventorydb.users SET
    isDeleted = true,
    modified = current_timestamp,
    modifiedBy = _modifiedBy
    WHERE userId = _userId;
END$$
DELIMITER ;