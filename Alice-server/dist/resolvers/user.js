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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = exports.GetUserDocumentInput = void 0;
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const constances_1 = require("../constances");
const UsernamePasswordInput_1 = require("./UsernamePasswordInput");
const validateRegister_1 = require("../utils/validateRegister");
const uuid_1 = require("uuid");
const sendEmail_1 = require("../utils/sendEmail");
const typeorm_1 = require("typeorm");
const Relationship_1 = require("../entities/Relationship");
const UserSchedule_1 = require("../entities/UserSchedule");
let FieldError = class FieldError {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    type_graphql_1.ObjectType()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
let UserInfo = class UserInfo {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], UserInfo.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User),
    __metadata("design:type", User_1.User)
], UserInfo.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserInfo.prototype, "relationship", void 0);
UserInfo = __decorate([
    type_graphql_1.ObjectType()
], UserInfo);
let UserDocumentInfo = class UserDocumentInfo {
};
__decorate([
    type_graphql_1.Field(() => User_1.User),
    __metadata("design:type", User_1.User)
], UserDocumentInfo.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean),
    __metadata("design:type", Boolean)
], UserDocumentInfo.prototype, "isAbsent", void 0);
UserDocumentInfo = __decorate([
    type_graphql_1.ObjectType()
], UserDocumentInfo);
let GetUserDocumentInput = class GetUserDocumentInput {
};
__decorate([
    type_graphql_1.Field(() => [Number]),
    __metadata("design:type", Array)
], GetUserDocumentInput.prototype, "members", void 0);
__decorate([
    type_graphql_1.Field(() => [Number]),
    __metadata("design:type", Array)
], GetUserDocumentInput.prototype, "absents", void 0);
GetUserDocumentInput = __decorate([
    type_graphql_1.InputType()
], GetUserDocumentInput);
exports.GetUserDocumentInput = GetUserDocumentInput;
let UserResolver = class UserResolver {
    email(user, { req }) {
        if (req.session.userId === user.id) {
            return user.email;
        }
        return "";
    }
    changePassword(token, newPassword, { redis, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newPassword.length <= 2) {
                return {
                    errors: [
                        {
                            field: "newPassword",
                            message: "length must be greater than 2",
                        },
                    ],
                };
            }
            const key = constances_1.FORGET_PASSWORD_PREFIX + token;
            const userId = yield redis.get(key);
            if (!userId) {
                return {
                    errors: [
                        {
                            field: "token",
                            message: "token expired",
                        },
                    ],
                };
            }
            const user = yield User_1.User.findOne(parseInt(userId));
            if (!user) {
                return {
                    errors: [
                        {
                            field: "token",
                            message: "user no longer existed",
                        },
                    ],
                };
            }
            yield User_1.User.update({ id: parseInt(userId) }, {
                password: yield argon2_1.default.hash(newPassword),
            });
            yield redis.del(key);
            req.session.userId = user.id;
            return { user };
        });
    }
    forgotPassword(email, { redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { email } });
            if (!user) {
                return true;
            }
            const token = uuid_1.v4();
            const html = `<a href="http://localhost:3000/change-password/${token}">reset password</a>`;
            yield redis.set(constances_1.FORGET_PASSWORD_PREFIX + token, user.id, "ex", 1000 * 60 * 60);
            yield sendEmail_1.sendEmail(email, html);
            return true;
        });
    }
    me({ req }) {
        if (!req.session.userId) {
            return null;
        }
        return User_1.User.findOne(req.session.userId);
    }
    register(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(options);
            const errors = validateRegister_1.validateRegister(options);
            console.log(errors);
            if (errors) {
                return { errors };
            }
            const hashedPassword = yield argon2_1.default.hash(options.password);
            let user;
            try {
                user = yield User_1.User.create({
                    username: options.username,
                    password: hashedPassword,
                    email: options.email,
                    fullname: options.fullName,
                }).save();
            }
            catch (err) {
                if (err.code === "23505") {
                    return {
                        errors: [
                            {
                                field: "username",
                                message: "username already taken",
                            },
                        ],
                    };
                }
            }
            req.session.userId = user === null || user === void 0 ? void 0 : user.id;
            return { user };
        });
    }
    login(usernameOrEmail, password, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne(usernameOrEmail.includes("@")
                ? {
                    where: { email: usernameOrEmail },
                }
                : {
                    where: { username: usernameOrEmail },
                });
            if (!user) {
                return {
                    errors: [
                        {
                            field: "usernameOrEmail",
                            message: "that username/email doesn't exist",
                        },
                    ],
                };
            }
            const valid = yield argon2_1.default.verify(user.password, password);
            if (!valid) {
                return {
                    errors: [
                        {
                            field: "password",
                            message: "incorrect password",
                        },
                    ],
                };
            }
            req.session.userId = user.id;
            return { user };
        });
    }
    logout({ req, res }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie(constances_1.COOKIE_NAME);
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        }));
    }
    relationships(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const relation1 = yield Relationship_1.Relationship.find({
                where: { userId1: id },
            });
            const relation2 = yield Relationship_1.Relationship.find({
                where: { userId2: id },
            });
            const relation = [...relation1, ...relation2];
            const result = yield Promise.all(relation.map(({ userId1, userId2, type }) => __awaiter(this, void 0, void 0, function* () {
                const userId = id === userId1 ? userId2 : userId1;
                let user = yield User_1.User.findOne({
                    where: {
                        id: userId,
                    },
                });
                return {
                    id: user.id,
                    user,
                    relationship: type,
                };
            })));
            return result;
        });
    }
    updateInfo(banner, avatar, fullname, email, username, timeSpend, joined, cancel, document, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId)
                return null;
            if (avatar) {
                yield User_1.User.update({ id: req.session.userId }, {
                    avatar,
                });
            }
            if (banner) {
                yield User_1.User.update({ id: req.session.userId }, {
                    banner,
                });
            }
            if (timeSpend) {
                yield User_1.User.update({ id: req.session.userId }, {
                    timeSpend,
                });
            }
            if (joined) {
                yield User_1.User.update({ id: req.session.userId }, {
                    joined,
                });
            }
            if (cancel) {
                yield User_1.User.update({ id: req.session.userId }, {
                    cancel,
                });
            }
            if (document) {
                yield User_1.User.update({ id: req.session.userId }, {
                    document,
                });
            }
            if (fullname && email && username) {
                try {
                    yield User_1.User.update({ id: req.session.userId }, {
                        fullname,
                        email,
                        username,
                    });
                }
                catch (err) {
                    console.log(err);
                }
            }
            return User_1.User.findOne({
                where: {
                    id: req.session.userId,
                },
            });
        });
    }
    searchUser(search, friend, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield typeorm_1.getConnection()
                .getRepository(User_1.User)
                .createQueryBuilder("user")
                .where("user.fullname like :search OR user.username like :search", {
                search: `%${search}%`,
            })
                .getMany();
            const result = yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                if (!req.session.userId)
                    return {
                        id: user.id,
                        user,
                    };
                const userId1 = req.session.userId < user.id ? req.session.userId : user.id;
                const userId2 = req.session.userId < user.id ? user.id : req.session.userId;
                let relationship;
                try {
                    relationship = yield Relationship_1.Relationship.findOne({
                        where: {
                            userId1,
                            userId2,
                        },
                    });
                }
                catch (err) {
                    relationship = null;
                }
                return {
                    id: user.id,
                    user,
                    relationship: relationship === null || relationship === void 0 ? void 0 : relationship.type,
                };
            })));
            if (friend) {
                return result.filter((user) => {
                    return user.relationship === "follow";
                });
            }
            return result;
        });
    }
    getUserById(id, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne(id);
            if (!user)
                return undefined;
            if (!req.session.userId)
                return { id: user.id, user };
            else {
                const userId1 = req.session.userId < id ? req.session.userId : id;
                const userId2 = req.session.userId < id ? id : req.session.userId;
                let relationship;
                try {
                    relationship = yield Relationship_1.Relationship.findOne({
                        where: {
                            userId1,
                            userId2,
                        },
                    });
                }
                catch (err) {
                    relationship = null;
                }
                return { id: user.id, user, relationship: relationship === null || relationship === void 0 ? void 0 : relationship.type };
            }
        });
    }
    getUserFromSchedule(scheduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (scheduleId) {
                const users = yield UserSchedule_1.UserSchedule.find({
                    where: {
                        scheduleId,
                    },
                    relations: ["schedule"],
                });
                return users.map(({ user }) => {
                    return user;
                });
            }
            else
                return [];
        });
    }
    getUserDocument(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                ...options.members.map((id) => __awaiter(this, void 0, void 0, function* () {
                    const user = yield User_1.User.findOne({
                        where: {
                            id,
                        },
                    });
                    console.log(user);
                    return {
                        isAbsent: false,
                        user,
                    };
                })),
                ...options.absents.map((id) => __awaiter(this, void 0, void 0, function* () {
                    const user = yield User_1.User.findOne({
                        where: {
                            id,
                        },
                    });
                    return {
                        isAbsent: true,
                        user,
                    };
                })),
            ];
        });
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => String),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User, Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "email", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg("token")),
    __param(1, type_graphql_1.Arg("newPassword")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("email")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg("options")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput_1.UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg("usernameOrEmail")),
    __param(1, type_graphql_1.Arg("password")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
__decorate([
    type_graphql_1.Query(() => [UserInfo]),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "relationships", null);
__decorate([
    type_graphql_1.Mutation(() => User_1.User, { nullable: true }),
    __param(0, type_graphql_1.Arg("banner", { nullable: true })),
    __param(1, type_graphql_1.Arg("avatar", { nullable: true })),
    __param(2, type_graphql_1.Arg("fullname", { nullable: true })),
    __param(3, type_graphql_1.Arg("email", { nullable: true })),
    __param(4, type_graphql_1.Arg("username", { nullable: true })),
    __param(5, type_graphql_1.Arg("timeSpend", { nullable: true })),
    __param(6, type_graphql_1.Arg("joined", { nullable: true })),
    __param(7, type_graphql_1.Arg("cancel", { nullable: true })),
    __param(8, type_graphql_1.Arg("document", { nullable: true })),
    __param(9, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Number, Number, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateInfo", null);
__decorate([
    type_graphql_1.Query(() => [UserInfo]),
    __param(0, type_graphql_1.Arg("search")),
    __param(1, type_graphql_1.Arg("friend", { nullable: true })),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "searchUser", null);
__decorate([
    type_graphql_1.Query(() => UserInfo, { nullable: true }),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUserById", null);
__decorate([
    type_graphql_1.Query(() => [User_1.User]),
    __param(0, type_graphql_1.Arg("scheduleId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUserFromSchedule", null);
__decorate([
    type_graphql_1.Query(() => [UserDocumentInfo]),
    __param(0, type_graphql_1.Arg("options")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetUserDocumentInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUserDocument", null);
UserResolver = __decorate([
    type_graphql_1.Resolver(User_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map