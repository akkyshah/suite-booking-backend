import sqlite3, {Database} from "sqlite3";
import {BookingDb, BookingTableCreationQuery} from "@/app/booking/db";

sqlite3.verbose();

export class Sqlite3 {
  private static dbName: string;
  static db: Database;

  static init(dbName: string) {
    this.dbName = dbName;
    //Sqlite3.db = new sqlite3.Database(`:memory:`);  // in-memory database
    Sqlite3.db = new sqlite3.Database(`./${dbName}.sqlite`);  // persistent database
    Sqlite3.db.run(BookingTableCreationQuery);
  }

  static getDb() {
    if (!Sqlite3.db) throw new Error("database is not initialized");
    return Sqlite3.db;
  }

  /**
   * NOTE: used only by tests
   * */
  static __dropTable() {
    if (Sqlite3.dbName.includes("-test")) {
      Sqlite3.getDb().run(`DROP TABLE IF EXISTS ${BookingDb.tableName}`);
    } else {
      throw new Error("permission denied!");
    }
  }
}
