export var UserRole;
(function (UserRole) {
    UserRole["OPERATOR"] = "operator";
    UserRole["TECHNOLOGIST"] = "technologist";
    UserRole["SHIFT_MASTER"] = "shift_master";
    UserRole["LABORATORY"] = "laboratory";
    UserRole["PRODUCTION_HEAD"] = "production_head";
    UserRole["LOGISTICS"] = "logistics";
    UserRole["ADMIN"] = "admin";
})(UserRole || (UserRole = {}));
export var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["IN_PROGRESS"] = "in_progress";
    OrderStatus["COMPLETED"] = "completed";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (OrderStatus = {}));
export var BatchStatus;
(function (BatchStatus) {
    BatchStatus["PLANNED"] = "planned";
    BatchStatus["DOSING"] = "dosing";
    BatchStatus["MIXING"] = "mixing";
    BatchStatus["DISCHARGING"] = "discharging";
    BatchStatus["COMPLETED"] = "completed";
    BatchStatus["ERROR"] = "error";
})(BatchStatus || (BatchStatus = {}));
export var QualityStatus;
(function (QualityStatus) {
    QualityStatus["PENDING"] = "pending";
    QualityStatus["APPROVED"] = "approved";
    QualityStatus["REJECTED"] = "rejected";
})(QualityStatus || (QualityStatus = {}));
