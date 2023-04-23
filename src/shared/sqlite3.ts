import sqlite3, {Database} from "sqlite3";
import {BookingDb, BookingTableCreationQuery} from "@/app/booking/db";

sqlite3.verbose();

export class Sqlite3 {
  private static dbName: string;
  static db: Database;

  static async init(dbName: string) {
    this.dbName = dbName;
    //Sqlite3.db = new sqlite3.Database(`:memory:`);  // in-memory database
    Sqlite3.db = new sqlite3.Database(`./${dbName}.sqlite`);  // persistent database
    return new Promise((resolve, reject) => {
      Sqlite3.db.run(BookingTableCreationQuery, (error: Error | null) => {
        if (error) return reject(error);
        resolve(undefined);
      });
    })
  }

  static getDb() {
    if (!Sqlite3.db) throw new Error("database is not initialized");
    return Sqlite3.db;
  }

  /**
   * NOTE: used only by tests
   * */
  static async __clearData() {
    return new Promise((resolve, reject) => {
      if (Sqlite3.dbName.includes("-test")) {
        Sqlite3.getDb().run(`DELETE
                             FROM ${BookingDb.tableName}`, (error: Error | null) => {
          if (error) return reject(error);
          resolve(undefined);
        });
      } else {
        throw new Error("permission denied!");
      }
    })
  }
}
