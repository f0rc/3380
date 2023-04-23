"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("./database/db");
var getPackages = function () { return __awaiter(void 0, void 0, void 0, function () {
    var packages, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_1.postgresQuery)("SELECT *\n      FROM \"PACKAGE_LOCATION_HISTORY\"\n      WHERE \"package_id\" = (\n        SELECT \"package_id\"\n        FROM \"PACKAGE_LOCATION_HISTORY\"\n        WHERE \"status\" IN ('accepted', 'transit', 'out-for-delivery')\n        AND \"package_id\" NOT IN (\n          SELECT \"package_id\"\n          FROM \"PACKAGE_LOCATION_HISTORY\"\n          WHERE \"status\" IN ('fail', 'delivered')\n        )\n        ORDER BY \"processedAt\" ASC\n        LIMIT 1\n      )\n      ORDER BY \"processedAt\" ASC\n      LIMIT 10;", [])];
            case 1:
                packages = _a.sent();
                if (packages.rows.length === 0 || !packages.rows) {
                    return [2 /*return*/, []];
                }
                return [2 /*return*/, packages.rows];
            case 2:
                e_1 = _a.sent();
                console.log(e_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var updatePackage = function (_a) {
    var package_id = _a.package_id, postoffice_location_id = _a.postoffice_location_id, status = _a.status, intransitcounter = _a.intransitcounter;
    return __awaiter(void 0, void 0, void 0, function () {
        var packages, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, db_1.postgresQuery)("INSERT INTO \"PACKAGE_LOCATION_HISTORY\" (\"package_id\", \"status\", \"postoffice_location_id\", \"intransitcounter\", \"processedBy\") VALUES ($1, $2, $3, $4, $5);", [
                            package_id,
                            status,
                            postoffice_location_id,
                            intransitcounter,
                            "6cdf04bc-34d7-410b-b853-71672663d620",
                        ])];
                case 1:
                    packages = _b.sent();
                    return [2 /*return*/, packages.rows];
                case 2:
                    e_2 = _b.sent();
                    console.log(e_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
};
var canTransit = function (inTransitCounter) {
    if (inTransitCounter === 1) {
        var change = Math.random() < 0.8;
        console.log("CHANCE is 80%");
        return change;
    }
    else if (inTransitCounter === 2) {
        var change = Math.random() < 0.6;
        console.log("CHANCE is 60%");
        return change;
    }
    else if (inTransitCounter === 3) {
        var change = Math.random() < 0.4;
        console.log("CHANCE is 40%");
        return change;
    }
    else if (inTransitCounter === 4) {
        var change = Math.random() < 0.2;
        console.log("CHANCE is 20%");
        return change;
    }
};
var getOfficeList = function () { return __awaiter(void 0, void 0, void 0, function () {
    var offices, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_1.postgresQuery)("SELECT \"postoffice_location_id\"\n      FROM \"POSTOFFICE_LOCATION\";", [])];
            case 1:
                offices = _a.sent();
                return [2 /*return*/, offices.rows];
            case 2:
                e_3 = _a.sent();
                console.log(e_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// TypeScript function to get a random office location that is not in the zipcodeHistory array
var getRandomOfficeLocation = function (zipcodeHistory, count) {
    if (count === void 0) { count = 0; }
    return __awaiter(void 0, void 0, void 0, function () {
        var postOfficeLocations, randomLocation, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getOfficeList()];
                case 1:
                    postOfficeLocations = _a.sent();
                    if (!postOfficeLocations) {
                        throw new Error("No office locations found");
                    }
                    randomLocation = postOfficeLocations[Math.floor(Math.random() * postOfficeLocations.length)];
                    // Check if the random location is already in the history and the retry count is less than 10
                    if (zipcodeHistory.includes(randomLocation.postoffice_location_id) &&
                        count < 10) {
                        return [2 /*return*/, getRandomOfficeLocation(zipcodeHistory, count + 1)];
                    }
                    // If the retry count is 10 or more, throw an error
                    if (count >= 10) {
                        throw new Error("No office locations found");
                    }
                    // Return the random location ID as a string
                    return [2 /*return*/, randomLocation.postoffice_location_id];
                case 2:
                    e_4 = _a.sent();
                    console.log(e_4);
                    return [2 /*return*/, undefined];
                case 3: return [2 /*return*/];
            }
        });
    });
};
function simulatePackageDelivery(pkg) {
    return __awaiter(this, void 0, void 0, function () {
        var isDeliveryFailed, randomLocation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (pkg.status[pkg.status.length - 1] === "delivered") {
                        return [2 /*return*/];
                    }
                    isDeliveryFailed = Math.random() < 0.01;
                    return [4 /*yield*/, getRandomOfficeLocation(pkg.zipcodeHistory)];
                case 1:
                    randomLocation = _a.sent();
                    if (!randomLocation) {
                        return [2 /*return*/];
                    }
                    console.log("randomLocation", randomLocation);
                    if (!(pkg.status[pkg.status.length - 1] === "transit" &&
                        pkg.zipcodeHistory.length >= 2 &&
                        pkg.inTransitCounter >= 4)) return [3 /*break*/, 3];
                    return [4 /*yield*/, updatePackage({
                            package_id: pkg.package_id,
                            postoffice_location_id: randomLocation,
                            status: "out-for-delivery",
                            intransitcounter: pkg.inTransitCounter,
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 17];
                case 3:
                    if (!(pkg.status[pkg.status.length - 1] === "transit" &&
                        pkg.zipcodeHistory.length >= 2 &&
                        pkg.inTransitCounter <= 4)) return [3 /*break*/, 8];
                    if (!canTransit(pkg.inTransitCounter)) return [3 /*break*/, 5];
                    return [4 /*yield*/, updatePackage({
                            package_id: pkg.package_id,
                            postoffice_location_id: randomLocation,
                            status: "transit",
                            intransitcounter: pkg.inTransitCounter + 1,
                        })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, updatePackage({
                        package_id: pkg.package_id,
                        postoffice_location_id: randomLocation,
                        status: "out-for-delivery",
                        intransitcounter: pkg.inTransitCounter,
                    })];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [3 /*break*/, 17];
                case 8:
                    if (!(pkg.status[pkg.status.length - 1] === "out-for-delivery")) return [3 /*break*/, 13];
                    if (!isDeliveryFailed) return [3 /*break*/, 10];
                    return [4 /*yield*/, updatePackage({
                            package_id: pkg.package_id,
                            postoffice_location_id: pkg.zipcodeHistory[pkg.zipcodeHistory.length - 1],
                            status: "fail",
                            intransitcounter: pkg.inTransitCounter,
                        })];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, updatePackage({
                        package_id: pkg.package_id,
                        postoffice_location_id: pkg.zipcodeHistory[pkg.zipcodeHistory.length - 1],
                        status: "delivered",
                        intransitcounter: pkg.inTransitCounter,
                    })];
                case 11:
                    _a.sent();
                    _a.label = 12;
                case 12: return [3 /*break*/, 17];
                case 13:
                    if (!(pkg.status[pkg.status.length - 1] === "accepted" &&
                        pkg.zipcodeHistory.length === 1)) return [3 /*break*/, 15];
                    return [4 /*yield*/, updatePackage({
                            package_id: pkg.package_id,
                            postoffice_location_id: randomLocation,
                            status: "transit",
                            intransitcounter: pkg.inTransitCounter + 1,
                        })];
                case 14:
                    _a.sent();
                    return [3 /*break*/, 17];
                case 15:
                    if (!(pkg.status[pkg.status.length - 1] === "accepted")) return [3 /*break*/, 17];
                    return [4 /*yield*/, updatePackage({
                            package_id: pkg.package_id,
                            postoffice_location_id: randomLocation,
                            status: "transit",
                            intransitcounter: pkg.inTransitCounter + 1,
                        })];
                case 16:
                    _a.sent();
                    _a.label = 17;
                case 17: return [2 /*return*/];
            }
        });
    });
}
var simulate = function () { return __awaiter(void 0, void 0, void 0, function () {
    var dbpkg, statusList, zipcodelist, packageList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getPackages()];
            case 1:
                dbpkg = _a.sent();
                if (!dbpkg || dbpkg.length === 0) {
                    return [2 /*return*/];
                }
                statusList = dbpkg.map(function (pkg) { return pkg.status; });
                zipcodelist = dbpkg.map(function (pkg) { return pkg.postoffice_location_id; });
                console.log(dbpkg, "package");
                console.log(statusList, "status");
                console.log(zipcodelist, "zipcode");
                packageList = {
                    package_id: dbpkg[0].package_id,
                    id: dbpkg[0].package_location_id,
                    status: statusList,
                    zipcodeHistory: zipcodelist,
                    inTransitCounter: dbpkg[dbpkg.length - 1].intransitcounter,
                };
                console.log(packageList, "packageList");
                return [4 /*yield*/, simulatePackageDelivery(packageList)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
try {
    simulate();
    setInterval(simulate, 1000);
}
catch (e) {
    console.log(e);
}
