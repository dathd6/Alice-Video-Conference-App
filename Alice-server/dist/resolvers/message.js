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
exports.MessageResolver = exports.MessageInput = void 0;
const type_graphql_1 = require("type-graphql");
const Document_1 = require("../entities/Document");
const Message_1 = require("../entities/Message");
const User_1 = require("../entities/User");
let MessageInput = class MessageInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], MessageInput.prototype, "context", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], MessageInput.prototype, "type", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], MessageInput.prototype, "userId", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], MessageInput.prototype, "room", void 0);
MessageInput = __decorate([
    type_graphql_1.InputType()
], MessageInput);
exports.MessageInput = MessageInput;
let MessageResolver = class MessageResolver {
    chat(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("haha");
            let message = yield Message_1.Message.create({
                context: options.context,
                userId: options.userId,
                room: options.room,
                type: options.type,
            }).save();
            let user = yield User_1.User.findOne({
                where: {
                    id: options.userId,
                },
            });
            return Object.assign(Object.assign({}, message), { user });
        });
    }
    updateMessage(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Message_1.Message.update(id, {
                context,
            });
            return true;
        });
    }
    deleteMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Message_1.Message.delete(id);
            return true;
        });
    }
    messages(room) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Message_1.Message.find({
                where: {
                    room,
                },
            });
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => Message_1.Message),
    __param(0, type_graphql_1.Arg("options")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MessageInput]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "chat", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id")), __param(1, type_graphql_1.Arg("context")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "updateMessage", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "deleteMessage", null);
__decorate([
    type_graphql_1.Query(() => [Message_1.Message], { nullable: true }),
    __param(0, type_graphql_1.Arg("room")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "messages", null);
MessageResolver = __decorate([
    type_graphql_1.Resolver(Document_1.Document)
], MessageResolver);
exports.MessageResolver = MessageResolver;
//# sourceMappingURL=message.js.map