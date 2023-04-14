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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Schedule_1 = require("../entities/Schedule");
const User_1 = require("../entities/User");
const UserSchedule_1 = require("../entities/UserSchedule");
let ScheduleValue = class ScheduleValue {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Schedule_1.Schedule)
], ScheduleValue.prototype, "schedule", void 0);
__decorate([
    type_graphql_1.Field(() => [User_1.User]),
    __metadata("design:type", Array)
], ScheduleValue.prototype, "users", void 0);
ScheduleValue = __decorate([
    type_graphql_1.ObjectType()
], ScheduleValue);
let ScheduleResolver = class ScheduleResolver {
    saveSchedule(title, dateType, startAt, banner, members, description, company, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            let schedule;
            try {
                schedule = yield Schedule_1.Schedule.create({
                    title,
                    description,
                    dateType,
                    startAt,
                    company,
                    banner,
                    hostId: req.session.userId,
                }).save();
                members.map((member) => __awaiter(this, void 0, void 0, function* () {
                    yield UserSchedule_1.UserSchedule.create({
                        userId: member,
                        scheduleId: schedule.id,
                    }).save();
                }));
                yield UserSchedule_1.UserSchedule.create({
                    userId: req.session.userId,
                    scheduleId: schedule.id,
                }).save();
            }
            catch (err) { }
            const host = yield User_1.User.findOne({
                where: {
                    id: schedule.hostId,
                },
            });
            return Object.assign(Object.assign({}, schedule), { host });
        });
    }
    getSchedules({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const schedules = yield UserSchedule_1.UserSchedule.find({
                where: {
                    userId: req.session.userId,
                },
                relations: ["schedule"],
            });
            return schedules.map(({ schedule }) => {
                return schedule;
            });
        });
    }
    getSchedule(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield UserSchedule_1.UserSchedule.find({
                where: {
                    scheduleId: id,
                },
                relations: ["schedule"],
            });
            return {
                schedule: users[0].schedule,
                users: users.map(({ user }) => {
                    return user;
                }),
            };
        });
    }
    deleteSchedule(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Schedule_1.Schedule.delete(id);
            return true;
        });
    }
    updateSchedule(id, title, dateType, startAt, banner, members, description, company, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userSchedule = yield UserSchedule_1.UserSchedule.find({
                where: {
                    scheduleId: id,
                },
            });
            members.map((value) => __awaiter(this, void 0, void 0, function* () {
                if (!userSchedule.find(({ userId }) => userId === value)) {
                    yield UserSchedule_1.UserSchedule.create({
                        userId: value,
                        scheduleId: id,
                    }).save();
                }
            }));
            userSchedule.map(({ userId }) => __awaiter(this, void 0, void 0, function* () {
                if (req.session.userId !== userId &&
                    !members.find((value) => userId === value)) {
                    yield UserSchedule_1.UserSchedule.delete({ userId, scheduleId: id });
                }
            }));
            yield Schedule_1.Schedule.update(id, {
                title,
                description,
                dateType,
                startAt,
                company,
                banner,
            });
            return yield Schedule_1.Schedule.findOne({
                where: {
                    id,
                },
            });
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => Schedule_1.Schedule, { nullable: true }),
    __param(0, type_graphql_1.Arg("title")),
    __param(1, type_graphql_1.Arg("dateType")),
    __param(2, type_graphql_1.Arg("startAt")),
    __param(3, type_graphql_1.Arg("banner")),
    __param(4, type_graphql_1.Arg("members", (_) => [Number])),
    __param(5, type_graphql_1.Arg("description", { nullable: true })),
    __param(6, type_graphql_1.Arg("company", { nullable: true })),
    __param(7, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Array, String, String, Object]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "saveSchedule", null);
__decorate([
    type_graphql_1.Query(() => [Schedule_1.Schedule]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "getSchedules", null);
__decorate([
    type_graphql_1.Query(() => ScheduleValue, { nullable: true }),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "getSchedule", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "deleteSchedule", null);
__decorate([
    type_graphql_1.Mutation(() => Schedule_1.Schedule),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Arg("title")),
    __param(2, type_graphql_1.Arg("dateType")),
    __param(3, type_graphql_1.Arg("startAt")),
    __param(4, type_graphql_1.Arg("banner")),
    __param(5, type_graphql_1.Arg("members", (_) => [Number])),
    __param(6, type_graphql_1.Arg("description", { nullable: true })),
    __param(7, type_graphql_1.Arg("company", { nullable: true })),
    __param(8, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, String, Array, String, String, Object]),
    __metadata("design:returntype", Promise)
], ScheduleResolver.prototype, "updateSchedule", null);
ScheduleResolver = __decorate([
    type_graphql_1.Resolver(Schedule_1.Schedule)
], ScheduleResolver);
exports.ScheduleResolver = ScheduleResolver;
//# sourceMappingURL=schedule.js.map