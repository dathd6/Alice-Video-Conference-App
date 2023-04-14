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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetResolver = void 0;
const type_graphql_1 = require("type-graphql");
const uuid_1 = require("uuid");
let MeetResolver = class MeetResolver {
    createMeeting({ req }) {
        const code = uuid_1.v4();
        if (!req.session.meeting)
            req.session.meeting = [code];
        else
            req.session.meeting = [code, ...req.session.meeting];
        return code;
    }
    eraseMeeting(code, { req }) {
        if (req.session.meeting) {
            req.session.meeting = req.session.meeting.filter((meet) => {
                return meet !== code;
            });
        }
        return true;
    }
};
__decorate([
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MeetResolver.prototype, "createMeeting", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("code")), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MeetResolver.prototype, "eraseMeeting", null);
MeetResolver = __decorate([
    type_graphql_1.Resolver()
], MeetResolver);
exports.MeetResolver = MeetResolver;
//# sourceMappingURL=meet.js.map