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
exports.NotificationResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Notification_1 = require("../entities/Notification");
const User_1 = require("../entities/User");
let NotificationResolver = class NotificationResolver {
    createNotification(receiver, content, type, isSeen, url, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            let notification;
            try {
                notification = yield Notification_1.Notification.create({
                    content,
                    receiver,
                    url,
                    type,
                    isSeen,
                    userId: req.session.userId,
                }).save();
            }
            catch (err) { }
            const user = yield User_1.User.findOne({
                where: {
                    id: req.session.userId,
                },
            });
            return Object.assign(Object.assign({}, notification), { user });
        });
    }
    seenNotification(id, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.session.userId) {
                yield Notification_1.Notification.update(id, {
                    isSeen: true,
                });
            }
            return true;
        });
    }
    notifications({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield Notification_1.Notification.find({
                where: {
                    receiver: req.session.userId,
                },
            });
            return notifications;
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => Notification_1.Notification, { nullable: true }),
    __param(0, type_graphql_1.Arg("receiver")),
    __param(1, type_graphql_1.Arg("content")),
    __param(2, type_graphql_1.Arg("type")),
    __param(3, type_graphql_1.Arg("isSeen")),
    __param(4, type_graphql_1.Arg("url")),
    __param(5, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Boolean, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationResolver.prototype, "createNotification", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NotificationResolver.prototype, "seenNotification", null);
__decorate([
    type_graphql_1.Query(() => [Notification_1.Notification], { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationResolver.prototype, "notifications", null);
NotificationResolver = __decorate([
    type_graphql_1.Resolver()
], NotificationResolver);
exports.NotificationResolver = NotificationResolver;
//# sourceMappingURL=notification.js.map