export const BookingDb = {
  tableName: "bookings",
  column: {
    id: "id",
    email: "email",
    firstName: "firstName",
    lastName: "lastName",
    noOfGuests: "noOfGuests",
    startDate: "startDate",
    endDate: "endDate",
    status: "status",
    createdOn: "createdOn",
    modifiedOn: "modifiedOn",
  }
};

export const BookingTableCreationQuery = `
    CREATE TABLE IF NOT EXISTS ${BookingDb.tableName}(
        ${BookingDb.column.id} TEXT PRIMARY KEY NOT NULL,
        ${BookingDb.column.email} TEXT NOT NULL,
        ${BookingDb.column.firstName} TEXT NOT NULL,
        ${BookingDb.column.lastName} TEXT NOT NULL,
        ${BookingDb.column.noOfGuests} INTEGER DEFAULT 1 NOT NULL,
        ${BookingDb.column.startDate} DATETIME NOT NULL,
        ${BookingDb.column.endDate} DATETIME NOT NULL,
        ${BookingDb.column.status} INTEGER NOT NULL,
        ${BookingDb.column.createdOn} DATETIME DEFAULT CURRENT_TIMESTAMP,
        ${BookingDb.column.modifiedOn} DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`;
