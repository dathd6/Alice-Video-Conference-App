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
exports.DocumentResolver = exports.DocumentValue = exports.SaveDocumentInput = exports.UpdateDocumentInput = void 0;
const type_graphql_1 = require("type-graphql");
const Document_1 = require("../entities/Document");
const UserDocument_1 = require("../entities/UserDocument");
const User_1 = require("../entities/User");
const Transcript_1 = require("../entities/Transcript");
const Schedule_1 = require("../entities/Schedule");
let TransInput = class TransInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], TransInput.prototype, "userId", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], TransInput.prototype, "context", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], TransInput.prototype, "type", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], TransInput.prototype, "startedAt", void 0);
TransInput = __decorate([
    type_graphql_1.InputType()
], TransInput);
let TransUpdate = class TransUpdate {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], TransUpdate.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], TransUpdate.prototype, "context", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], TransUpdate.prototype, "isDelete", void 0);
TransUpdate = __decorate([
    type_graphql_1.InputType()
], TransUpdate);
let UpdateDocumentInput = class UpdateDocumentInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], UpdateDocumentInput.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateDocumentInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateDocumentInput.prototype, "logo", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateDocumentInput.prototype, "startedAt", void 0);
__decorate([
    type_graphql_1.Field(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], UpdateDocumentInput.prototype, "duration", void 0);
__decorate([
    type_graphql_1.Field(() => TransUpdate, { nullable: true }),
    __metadata("design:type", TransUpdate)
], UpdateDocumentInput.prototype, "transcripts", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateDocumentInput.prototype, "company", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateDocumentInput.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], UpdateDocumentInput.prototype, "scheduleId", void 0);
UpdateDocumentInput = __decorate([
    type_graphql_1.InputType()
], UpdateDocumentInput);
exports.UpdateDocumentInput = UpdateDocumentInput;
let SaveDocumentInput = class SaveDocumentInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], SaveDocumentInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], SaveDocumentInput.prototype, "logo", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], SaveDocumentInput.prototype, "record", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], SaveDocumentInput.prototype, "scheduleId", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], SaveDocumentInput.prototype, "recordStartedAt", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], SaveDocumentInput.prototype, "startedAt", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], SaveDocumentInput.prototype, "duration", void 0);
__decorate([
    type_graphql_1.Field(() => [Number]),
    __metadata("design:type", Array)
], SaveDocumentInput.prototype, "members", void 0);
__decorate([
    type_graphql_1.Field(() => [Number]),
    __metadata("design:type", Array)
], SaveDocumentInput.prototype, "absents", void 0);
__decorate([
    type_graphql_1.Field(() => [TransInput]),
    __metadata("design:type", Array)
], SaveDocumentInput.prototype, "transcripts", void 0);
SaveDocumentInput = __decorate([
    type_graphql_1.InputType()
], SaveDocumentInput);
exports.SaveDocumentInput = SaveDocumentInput;
let DocumentValue = class DocumentValue {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Document_1.Document)
], DocumentValue.prototype, "document", void 0);
__decorate([
    type_graphql_1.Field(() => [User_1.User]),
    __metadata("design:type", Array)
], DocumentValue.prototype, "users", void 0);
__decorate([
    type_graphql_1.Field(() => [Boolean]),
    __metadata("design:type", Array)
], DocumentValue.prototype, "isabsent", void 0);
DocumentValue = __decorate([
    type_graphql_1.ObjectType()
], DocumentValue);
exports.DocumentValue = DocumentValue;
let DocumentResolver = class DocumentResolver {
    saveDocument(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let members = "";
            options.members.map((value) => {
                if (members === "")
                    members = value.toString();
                else
                    members += `-${value}`;
            });
            let absents = "";
            options.absents.map((value) => {
                if (absents === "")
                    absents = value.toString();
                else
                    absents += `-${value}`;
            });
            let document;
            try {
                document = yield Document_1.Document.create({
                    title: options.title,
                    logo: options.logo,
                    record: options.record,
                    scheduleId: options.scheduleId,
                    members: members,
                    absents: absents,
                    duration: options.duration,
                    recordStartedAt: options.recordStartedAt,
                    startedAt: options.startedAt,
                }).save();
                options.members.map((member) => __awaiter(this, void 0, void 0, function* () {
                    yield UserDocument_1.UserDocument.create({
                        userId: member,
                        documentId: document === null || document === void 0 ? void 0 : document.id,
                    }).save();
                }));
                options.absents.map((member) => __awaiter(this, void 0, void 0, function* () {
                    yield UserDocument_1.UserDocument.create({
                        userId: member,
                        documentId: document === null || document === void 0 ? void 0 : document.id,
                    }).save();
                }));
                options.transcripts.map((transcript) => __awaiter(this, void 0, void 0, function* () {
                    yield Transcript_1.Transcript.create({
                        context: transcript.context,
                        userId: transcript.userId,
                        type: transcript.type,
                        startedAt: transcript.startedAt,
                        documentId: document === null || document === void 0 ? void 0 : document.id,
                    }).save();
                }));
            }
            catch (err) { }
            return document === null || document === void 0 ? void 0 : document.id;
        });
    }
    updateDocument(options) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (options.title) {
                    yield Document_1.Document.update(options.id, {
                        title: options.title,
                    });
                }
                if (options.scheduleId) {
                    if (options.company) {
                        yield Schedule_1.Schedule.update(options.scheduleId, {
                            company: options.company,
                        });
                    }
                    if (options.description) {
                        yield Schedule_1.Schedule.update(options.scheduleId, {
                            description: options.description,
                        });
                    }
                }
                if ((_a = options.transcripts) === null || _a === void 0 ? void 0 : _a.id) {
                    if ((_b = options.transcripts) === null || _b === void 0 ? void 0 : _b.isDelete) {
                        yield Transcript_1.Transcript.delete((_c = options.transcripts) === null || _c === void 0 ? void 0 : _c.id);
                    }
                    else
                        yield Transcript_1.Transcript.update((_d = options.transcripts) === null || _d === void 0 ? void 0 : _d.id, {
                            context: (_e = options.transcripts) === null || _e === void 0 ? void 0 : _e.context,
                        });
                }
            }
            catch (err) { }
            return true;
        });
    }
    documents({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.session.userId) {
                const user_document = yield UserDocument_1.UserDocument.find({
                    where: {
                        userId: req.session.userId,
                    },
                });
                return user_document.map(({ document }) => {
                    return document;
                });
            }
            else {
                return undefined;
            }
        });
    }
    document(id, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.session.userId) {
                const document = yield UserDocument_1.UserDocument.findOne({
                    where: {
                        documentId: id,
                        userId: req.session.userId,
                    },
                });
                let users = [];
                let isabsent = [];
                return {
                    document: document === null || document === void 0 ? void 0 : document.document,
                    users,
                    isabsent,
                };
            }
            else {
                return undefined;
            }
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => Number, { nullable: true }),
    __param(0, type_graphql_1.Arg("options")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SaveDocumentInput]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "saveDocument", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("options")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateDocumentInput]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "updateDocument", null);
__decorate([
    type_graphql_1.Query(() => [Document_1.Document], { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "documents", null);
__decorate([
    type_graphql_1.Query(() => DocumentValue, { nullable: true }),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "document", null);
DocumentResolver = __decorate([
    type_graphql_1.Resolver(Document_1.Document)
], DocumentResolver);
exports.DocumentResolver = DocumentResolver;
//# sourceMappingURL=document.js.map