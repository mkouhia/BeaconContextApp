/**
 * sqlite.ios.callback.js
 *
 * Created by Andrzej Porebski on 10/29/15.
 * Copyright (c) 2015 Andrzej Porebski.
 *
 * Test App using JS Callbacks for react-naive-sqlite-storage
 *
 * This library is available under the terms of the MIT License (2008).
 * See http://opensource.org/licenses/alphabetical for full text.
 */
'use strict';

import React, { Component } from 'react';


import SQLite from 'react-native-sqlite-storage';
SQLite.DEBUG(true);
SQLite.enablePromise(false);

const database_name = "Test.db";
const database_version = "1.0";
const database_displayname = "SQLite Test Database";
const database_size = 200000;
let db;

export default class DatabaseHelper extends Component {

  componentWillUnmount = () => {
    this.closeDatabase();
  }

  errorCB = (err) => {
    console.log("SQL resulted in error: " + err);
//    console.log("Error: "+ (err.message || err));
    return false;
  }

  successCB = () => {
    console.log("Callback: success!");
  }

  openCB = () => {
    console.log("Callback: OPEN");
  }

  closeCB = () => {
    console.log("Callback: CLOSED");
  }

  deleteCB = () => {
    console.log("Callback: DELETED");
  }

  populateDatabase = (db) => {
    console.log("Database integrity check");
    db.executeSql('SELECT 1 FROM Version LIMIT 1', [],
      () => {
        console.log("Database is ready ... executing query ...");
        db.transaction(this.queryEmployees,this.errorCB,() => {
          console.log("Processing completed");
        });
      },
      (error) => {
        console.log("received version error:", error);
        console.log("Database not yet ready ... populating data");
        db.transaction(this.populateDB, this.errorCB, () => {
          console.log("Database populated ... executing query ...");
          db.transaction(this.queryEmployees,this.errorCB, () => {
            console.log("Transaction is now finished");
            console.log("Processing completed");
            this.closeDatabase();
          });
        });
      });
  }

  populateDB = (tx) => {
    console.log("Executing DROP stmts");

    tx.executeSql('DROP TABLE IF EXISTS Employees;');
    tx.executeSql('DROP TABLE IF EXISTS Offices;');
    tx.executeSql('DROP TABLE IF EXISTS Departments;');

    console.log("Executing CREATE stmts");

    tx.executeSql('CREATE TABLE IF NOT EXISTS Version( '
      + 'version_id INTEGER PRIMARY KEY NOT NULL); ', [], this.successCB, this.errorCB);

    tx.executeSql('CREATE TABLE IF NOT EXISTS Departments( '
      + 'department_id INTEGER PRIMARY KEY NOT NULL, '
      + 'name VARCHAR(30) ); ', [], this.successCB, this.errorCB);

    tx.executeSql('CREATE TABLE IF NOT EXISTS Offices( '
      + 'office_id INTEGER PRIMARY KEY NOT NULL, '
      + 'name VARCHAR(20), '
      + 'longtitude FLOAT, '
      + 'latitude FLOAT ) ; ', [], this.successCB, this.errorCB);

    tx.executeSql('CREATE TABLE IF NOT EXISTS Employees( '
      + 'employe_id INTEGER PRIMARY KEY NOT NULL, '
      + 'name VARCHAR(55), '
      + 'office INTEGER, '
      + 'department INTEGER, '
      + 'FOREIGN KEY ( office ) REFERENCES Offices ( office_id ) '
      + 'FOREIGN KEY ( department ) REFERENCES Departments ( department_id ));', []);

    console.log("Executing INSERT stmts");

    tx.executeSql('INSERT INTO Departments (name) VALUES ("Client Services");', []);
    tx.executeSql('INSERT INTO Departments (name) VALUES ("Investor Services");', []);
    tx.executeSql('INSERT INTO Departments (name) VALUES ("Shipping");', []);
    tx.executeSql('INSERT INTO Departments (name) VALUES ("Direct Sales");', []);

    tx.executeSql('INSERT INTO Offices (name, longtitude, latitude) VALUES ("Denver", 59.8,  34.);', []);
    tx.executeSql('INSERT INTO Offices (name, longtitude, latitude) VALUES ("Warsaw", 15.7, 54.);', []);
    tx.executeSql('INSERT INTO Offices (name, longtitude, latitude) VALUES ("Berlin", 35.3, 12.);', []);
    tx.executeSql('INSERT INTO Offices (name, longtitude, latitude) VALUES ("Paris", 10.7, 14.);', []);

    tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Sylvester Stallone", 2,  4);', []);
    tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Elvis Presley", 2, 4);', []);
    tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Leslie Nelson", 3,  4);', []);
    tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Fidel Castro", 3, 3);', []);
    tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Bill Clinton", 1, 3);', []);
    tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Margaret Thatcher", 1, 3);', []);
    tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Donald Trump", 1, 3);', []);
    tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Dr DRE", 2, 2);', []);
    tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Samantha Fox", 2, 1);', []);
    console.log("all config SQL done");
  }

  queryEmployees = (tx) => {
    console.log("Executing employee query...");

    tx.executeSql('SELECT a.name, b.name as deptName FROM Employees a, Departments b WHERE a.department = b.department_id and a.department=?', [3],
      this.queryEmployeesSuccess,this.errorCB);
    //tx.executeSql('SELECT a.name, from TEST', [],() => {},this.errorCB);
  }

  queryEmployeesSuccess = (tx,results) => {
    console.log("queryEmployeesSuccess");
    var len = results.rows.length;
    for (let i = 0; i < len; i++) {
      let row = results.rows.item(i);
      console.log(`Empl Name: ${row.name}, Dept Name: ${row.deptName}`);
    }
  }

  loadAndQueryDB = () => {
    console.log("Opening database ...");
    db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, this.openCB, this.errorCB);
    this.populateDatabase(db);
  }

  deleteDatabase = () => {
    console.log("Deleting database");
    SQLite.deleteDatabase(database_name, this.deleteCB, this.errorCB);
  }

  closeDatabase = () => {
    if (db) {
      console.log("Closing database ...");
      db.close(this.closeCB,this.errorCB);
    } else {
      console.log("Database was not OPENED");
    }
  }

  runDemo = () => {
    console.log("Starting SQLite Callback Demo");
    this.loadAndQueryDB();
  }

}
