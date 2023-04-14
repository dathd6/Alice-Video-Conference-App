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
exports.Document = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const Schedule_1 = require("./Schedule");
const Transcript_1 = require("./Transcript");
const UserDocument_1 = require("./UserDocument");
let Document = class Document extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.updatedAt = new Date();
    }
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Document.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Document.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbCRmiC1UVZU50dPMqXNSRqTjcTxAOwu2CJADaOEuu-xOsrjh01WODSyZD_95OplBCrFk&usqp=CAU",
    }),
    __metadata("design:type", String)
], Document.prototype, "logo", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ default: "https://vjs.zencdn.net/v/oceans.mp4" }),
    __metadata("design:type", String)
], Document.prototype, "record", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Document.prototype, "recordStartedAt", void 0);
__decorate([
    type_graphql_1.Field(() => [Transcript_1.Transcript]),
    typeorm_1.OneToMany(() => Transcript_1.Transcript, (transcript) => transcript.document, {
        eager: true,
    }),
    __metadata("design:type", Array)
], Document.prototype, "transcripts", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Document.prototype, "moreInfo", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Document.prototype, "startedAt", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Document.prototype, "duration", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Document.prototype, "members", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Document.prototype, "absents", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Document.prototype, "scheduleId", void 0);
__decorate([
    type_graphql_1.Field(() => Schedule_1.Schedule),
    typeorm_1.ManyToOne(() => Schedule_1.Schedule, (schedule) => schedule.documents, { eager: true }),
    __metadata("design:type", Schedule_1.Schedule)
], Document.prototype, "schedule", void 0);
__decorate([
    typeorm_1.OneToMany(() => UserDocument_1.UserDocument, (user) => user.document),
    __metadata("design:type", Array)
], Document.prototype, "users", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Document.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Object)
], Document.prototype, "updatedAt", void 0);
Document = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Document);
exports.Document = Document;
//# sourceMappingURL=Document.js.map