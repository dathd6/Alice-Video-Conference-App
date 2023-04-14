"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchedule = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const Schedule_1 = require("./Schedule");
const User_1 = require("./User");
let UserSchedule = class UserSchedule extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.updatedAt = new Date();
    }
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], UserSchedule.prototype, "userId", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], UserSchedule.prototype, "scheduleId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.schedules, { eager: true }),
    __metadata("design:type", User_1.User)
], UserSchedule.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Schedule_1.Schedule, (schedule) => schedule.users, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Schedule_1.Schedule)
], UserSchedule.prototype, "schedule", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], UserSchedule.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Object)
], UserSchedule.prototype, "updatedAt", void 0);
UserSchedule = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], UserSchedule);
exports.UserSchedule = UserSchedule;
//# sourceMappingURL=UserSchedule.js.map